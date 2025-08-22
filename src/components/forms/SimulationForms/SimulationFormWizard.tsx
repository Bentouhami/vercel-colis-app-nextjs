"use client"

import { type ChangeEvent, useEffect, useState, useCallback, useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StepIndicator } from "@/components/ui/StepIndicator"
import { ArrowRight, ArrowLeft, Edit, Plus } from "lucide-react"

// ────────────────────── étapes décomposées
import StepDeparture from "./steps/StepDeparture"
import StepDestination from "./steps/StepDestination"
import StepParcels from "./steps/StepParcels"
import StepConfirmation from "./steps/StepConfirmation"

// ───────── services, hooks & utils
import { useApi } from "@/hooks/useApi"
import {
    deleteSimulationCookie,
    getSimulation,
    submitSimulation,
    updateSimulationEdited,
} from "@/services/frontend-services/simulation/SimulationService"
import {
    getAllCountries,
    getAgenciesByCityId,
    getCitiesByCountryId,
    getDestinationCountries,
} from "@/services/frontend-services/AddressService"
import { simulationRequestSchema, parcelsSchema } from "@/utils/validationSchema"
import type {
    SimulationDtoRequest,
    SimulationResponseDto,
    PartielUpdateSimulationDto,
    CreateParcelDto,
} from "@/services/dtos"
import { COLIS_MAX_PER_ENVOI } from "@/utils/constants"
import { checkAuthStatus } from "@/lib/auth-utils"
import { updateSimulationUserId } from "@/services/backend-services/Bk_SimulationService"

// Skeleton & modal réutilisés
import SimulationSkeleton from "@/components/skeletons/SimulationSkeleton"
import SimulationConfirmationModal from "@/components/modals/SimulationConfirmationModal"
import { getSimulationFromCookie } from "@/lib/simulationCookie"

// Types pour les options
interface CountryOption {
    id: number
    name: string
}

interface CityOption {
    id: number
    name: string
}

interface AgencyOption {
    id: number
    name: string
}

// ──────────────────────── constantes
const STEPS = ["Départ", "Destination", "Colis", "Confirmation"] as const

// ──────────────────────── composant principal
const SimulationFormWizard = ({ isEditMode = false }: { isEditMode?: boolean }) => {
    const router = useRouter()
    const { call } = useApi()
    const [isPending, startTransition] = useTransition()

    // ui / chargement
    const [loading, setLoading] = useState(true)
    const [currentStep, setCurrentStep] = useState<0 | 1 | 2 | 3>(0)

    // auth
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [userId, setUserId] = useState<string | number | null>(null)
    const [simulationConfirmationModal, setSimulationConfirmationModal] = useState(false)

    // simulation existante (pour le mode édition)
    const [existingSimulation, setExistingSimulation] = useState<SimulationResponseDto | null>(null)

    // état du formulaire
    const [departure, setDeparture] = useState({ country: "", city: "", agencyName: "" })
    const [destination, setDestination] = useState({ country: "", city: "", agencyName: "" })
    const [options, setOptions] = useState({
        countries: [] as CountryOption[],
        destinationCountries: [] as CountryOption[],
        departureCities: [] as CityOption[],
        departureAgencies: [] as AgencyOption[],
        destinationCities: [] as CityOption[],
        destinationAgencies: [] as AgencyOption[],
    })

    const [packageCount, setPackageCount] = useState(1)
    const [parcels, setParcels] = useState<CreateParcelDto[]>([{ height: 0, width: 0, length: 0, weight: 0 }])
    const [currentPackage, setCurrentPackage] = useState(0)

    // ───────── effets → auth
    useEffect(() => {
        ; (async () => {
            const authResult = await checkAuthStatus(false)
            setIsAuthenticated(authResult.isAuthenticated)
            setUserId(authResult.userId || null)
        })()
    }, [])

    // ───────── effets → simulation existante
    const loadExistingSimulation = useCallback(async () => {
        if (!isEditMode) {
            // Mode création normale
            try {
                const simulationCookie = await getSimulationFromCookie()
                const simulationData = await getSimulation()
                if (simulationCookie) {
                    if (simulationData && !simulationData?.userId && isAuthenticated && userId) {
                        await updateSimulationUserId(simulationCookie.id, Number(userId))
                    }
                    setSimulationConfirmationModal(true)
                }
                setLoading(false)
            } catch (error) {
                console.error("Erreur lors de la recherche de la simulation:", error)
                setLoading(false)
            }
            return
        }

        // Mode édition
        setLoading(true)
        try {
            const simData = await getSimulation()
            if (!simData) {
                toast.error("Aucune simulation à modifier. Redirection...")
                router.push("/client/simulation")
                return
            }

            // Link user if authenticated and not yet linked
            if (isAuthenticated && userId && !simData.userId) {
                await updateSimulationUserId(simData.id, Number(userId))
                simData.userId = Number(userId)
            }

            setExistingSimulation(simData)

            // Charger les pays d'abord
            const countries = await getAllCountries()
            setOptions((prev) => ({ ...prev, countries }))

            // Pré-remplir les données de départ
            const departureCountry = countries.find((c: CountryOption) => c.name === simData.departureCountry)
            if (departureCountry) {
                setDeparture((prev) => ({ ...prev, country: departureCountry.id.toString() }))

                // Charger les villes de départ
                const cities = await getCitiesByCountryId(departureCountry.id)
                setOptions((prev) => ({ ...prev, departureCities: cities }))

                const departureCity = cities.find((c: CityOption) => c.name === simData.departureCity)
                if (departureCity) {
                    setDeparture((prev) => ({ ...prev, city: departureCity.id.toString() }))

                    // Charger les agences de départ
                    const agencies = await getAgenciesByCityId(departureCity.id)
                    setOptions((prev) => ({ ...prev, departureAgencies: agencies }))

                    const departureAgency = agencies.find((a: AgencyOption) => a.name === simData.departureAgency)
                    if (departureAgency) {
                        setDeparture((prev) => ({ ...prev, agencyName: departureAgency.id.toString() }))

                        // Charger les pays de destination
                        const destCountries = await getDestinationCountries(departureCountry.id)
                        setOptions((prev) => ({ ...prev, destinationCountries: destCountries }))

                        const destinationCountry = destCountries.find((c: CountryOption) => c.name === simData.destinationCountry)
                        if (destinationCountry) {
                            setDestination((prev) => ({ ...prev, country: destinationCountry.id.toString() }))

                            // Charger les villes de destination
                            const destCities = await getCitiesByCountryId(destinationCountry.id)
                            setOptions((prev) => ({ ...prev, destinationCities: destCities }))

                            const destinationCity = destCities.find((c: CityOption) => c.name === simData.destinationCity)
                            if (destinationCity) {
                                setDestination((prev) => ({ ...prev, city: destinationCity.id.toString() }))

                                // Charger les agences de destination
                                const destAgencies = await getAgenciesByCityId(destinationCity.id)
                                setOptions((prev) => ({ ...prev, destinationAgencies: destAgencies }))

                                const destinationAgency = destAgencies.find((a: AgencyOption) => a.name === simData.destinationAgency)
                                if (destinationAgency) {
                                    setDestination((prev) => ({ ...prev, agencyName: destinationAgency.id.toString() }))
                                }
                            }
                        }
                    }
                }
            }

            // Pré-remplir les colis
            if (simData.parcels?.length > 0) {
                setParcels(simData.parcels)
                setPackageCount(simData.parcels.length)
            }
        } catch (error) {
            console.error("Erreur lors du chargement de la simulation:", error)
            toast.error("Erreur lors du chargement. Redirection...")
            router.push("/client/simulation")
        } finally {
            setLoading(false)
        }
    }, [isEditMode, isAuthenticated, userId, router])

    useEffect(() => {
        loadExistingSimulation()
    }, [loadExistingSimulation])

    // ───────── data‑fetching (pays, villes, agences) → identique
    useEffect(() => {
        if (isEditMode) return // Déjà chargé dans loadExistingSimulation
            ; (async () => {
                try {
                    const data = await getAllCountries()
                    setOptions((prev) => ({ ...prev, countries: data }))
                } catch (error) {
                    console.error("Error fetching countries:", error)
                }
            })()
    }, [isEditMode])

    useEffect(() => {
        if (!departure.country) {
            setOptions((prev) => ({ ...prev, departureCities: [] }))
            setDeparture((prev) => ({ ...prev, city: "", agencyName: "" }))
            return
        }
        ; (async () => {
            try {
                const countryId = Number(departure.country)
                const data = await getCitiesByCountryId(countryId)
                setOptions((prev) => ({ ...prev, departureCities: data }))
                if (!isEditMode) {
                    setDeparture((prev) => ({ ...prev, city: "", agencyName: "" }))
                }
            } catch (error) {
                console.error("Error fetching departure cities:", error)
                toast.error("Failed to fetch cities. Please try again.")
            }
        })()
    }, [departure.country, isEditMode])

    useEffect(() => {
        if (!departure.city) {
            setOptions((prev) => ({ ...prev, departureAgencies: [] }))
            if (!isEditMode) {
                setDeparture((prev) => ({ ...prev, agencyName: "" }))
            }
            return
        }
        ; (async () => {
            try {
                const cityObj = options.departureCities.find((c) => c.id === Number(departure.city))
                if (cityObj) {
                    const data = await getAgenciesByCityId(cityObj.id)
                    setOptions((prev) => ({ ...prev, departureAgencies: data }))
                    if (!isEditMode) {
                        setDeparture((prev) => ({ ...prev, agencyName: "" }))
                    }
                }
            } catch (error) {
                console.error("Error fetching departure agencies:", error)
                toast.error("Failed to fetch agencies. Please try again.")
            }
        })()
    }, [departure.city, options.departureCities, isEditMode])

    useEffect(() => {
        if (!departure.agencyName) {
            setOptions((prev) => ({ ...prev, destinationCountries: [] }))
            if (!isEditMode) {
                setDestination({ country: "", city: "", agencyName: "" })
            }
            return
        }
        ; (async () => {
            try {
                const data = await getDestinationCountries(departure.country)
                setOptions((prev) => ({ ...prev, destinationCountries: data }))
                if (!isEditMode) {
                    setDestination({ country: "", city: "", agencyName: "" })
                }
            } catch (error) {
                console.error("Error fetching destination countries:", error)
            }
        })()
    }, [departure.agencyName, departure.country, isEditMode])

    useEffect(() => {
        if (!destination.country) {
            setOptions((prev) => ({ ...prev, destinationCities: [] }))
            if (!isEditMode) {
                setDestination((prev) => ({ ...prev, city: "", agencyName: "" }))
            }
            return
        }
        ; (async () => {
            try {
                const countryId = Number(destination.country)
                const data = await getCitiesByCountryId(countryId)
                setOptions((prev) => ({ ...prev, destinationCities: data }))
                if (!isEditMode) {
                    setDestination((prev) => ({ ...prev, city: "", agencyName: "" }))
                }
            } catch (error) {
                console.error("Error fetching destination cities:", error)
            }
        })()
    }, [destination.country, isEditMode])

    useEffect(() => {
        if (!destination.city) {
            setOptions((prev) => ({ ...prev, destinationAgencies: [] }))
            if (!isEditMode) {
                setDestination((prev) => ({ ...prev, agencyName: "" }))
            }
            return
        }
        ; (async () => {
            try {
                const cityObj = options.destinationCities.find((c) => c.id === Number(destination.city))
                if (cityObj) {
                    const data = await getAgenciesByCityId(cityObj.id)
                    setOptions((prev) => ({ ...prev, destinationAgencies: data }))
                    if (!isEditMode) {
                        setDestination((prev) => ({ ...prev, agencyName: "" }))
                    }
                }
            } catch (error) {
                console.error("Error fetching destination agencies. Please try again.")
                toast.error("Failed to fetch destination agencies. Please try again.")
            }
        })()
    }, [destination.city, options.destinationCities, isEditMode])

    // ───────── handlers
    const handleDepartureChange = (field: keyof typeof departure, value: string) =>
        setDeparture((prev) => ({ ...prev, [field]: value }))

    const handleDestinationChange = (field: keyof typeof destination, value: string) =>
        setDestination((prev) => ({ ...prev, [field]: value }))

    const handlePackageCountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newCount = Number.parseInt(e.target.value, 10)
        if (newCount > COLIS_MAX_PER_ENVOI) return

        setPackageCount(newCount)
        const newParcels = Array.from(
            { length: newCount },
            (_, i) => parcels[i] || { height: 0, width: 0, length: 0, weight: 0 },
        )
        setParcels(newParcels)
        if (currentPackage >= newCount) setCurrentPackage(newCount - 1)
    }

    const handlePackageChange = (index: number, field: string, value: number) => {
        const updated = parcels.map((pkg, i) => (i === index ? { ...pkg, [field]: value } : pkg))
        setParcels(updated)
    }

    // Nouvelles fonctions pour la gestion des colis
    const handleAddParcel = () => {
        if (parcels.length >= COLIS_MAX_PER_ENVOI) {
            toast.error(`Maximum ${COLIS_MAX_PER_ENVOI} colis par envoi`)
            return
        }
        const newParcels = [...parcels, { height: 0, width: 0, length: 0, weight: 0 }]
        setParcels(newParcels)
        setPackageCount(newParcels.length)
        setCurrentPackage(newParcels.length - 1)
        toast.success("Nouveau colis ajouté")
    }

    const handleRemoveParcel = (index: number) => {
        if (parcels.length <= 1) {
            toast.error("Vous devez avoir au moins un colis")
            return
        }
        const newParcels = parcels.filter((_, i) => i !== index)
        setParcels(newParcels)
        setPackageCount(newParcels.length)
        if (currentPackage >= newParcels.length) {
            setCurrentPackage(newParcels.length - 1)
        }
        toast.success("Colis supprimé")
    }

    const handleDuplicateParcel = (index: number) => {
        if (parcels.length >= COLIS_MAX_PER_ENVOI) {
            toast.error(`Maximum ${COLIS_MAX_PER_ENVOI} colis par envoi`)
            return
        }
        const parcelToDuplicate = { ...parcels[index] }
        const newParcels = [...parcels]
        newParcels.splice(index + 1, 0, parcelToDuplicate)
        setParcels(newParcels)
        setPackageCount(newParcels.length)
        setCurrentPackage(index + 1)
        toast.success("Colis dupliqué")
    }

    // Traductions des messages Zod anglais → français pour les colis
    const parcelErrorTranslations: Record<string, string> = {
        "Height must be positive": "La hauteur doit être un nombre positif",
        "Width must be positive": "La largeur doit être un nombre positif",
        "Length must be positive": "La longueur doit être un nombre positif",
        "Weight must be at least 1kg": "Le poids doit être d'au moins 1 kg",
        "Weight must be at most 70kg": "Le poids doit être d'au plus 70 kg",
        "The sum of dimensions (L + W + H) must be less than 360 cm":
            "La somme des dimensions (L + l + H) doit être inférieure à 360 cm",
        "The largest side must be at most 120 cm": "La plus grande dimension doit être d'au plus 120 cm",
        "The volume must be at least 1728 cm³": "Le volume doit être d'au moins 1728 cm³",
        "Parcel height must be a positive number": "La hauteur du colis doit être un nombre positif",
        "Parcel width must be a positive number": "La largeur du colis doit être un nombre positif",
        "Parcel length must be a positive number": "La longueur du colis doit être un nombre positif",
        "Parcel weight must be a positive number": "Le poids du colis doit être un nombre positif",
    }

    const next = () => {
        switch (currentStep) {
            case 0:
                if (!departure.country || !departure.city || !departure.agencyName) {
                    toast.error("Veuillez compléter toutes les informations de départ.")
                    return
                }
                break
            case 1:
                if (!destination.country || !destination.city || !destination.agencyName) {
                    toast.error("Veuillez compléter toutes les informations de destination.")
                    return
                }
                break
            case 2: {
                // validation détaillée des colis selon parcelsSchema
                for (let i = 0; i < parcels.length; i++) {
                    const res = parcelsSchema.safeParse(parcels[i])
                    if (!res.success) {
                        const enMsg = res.error.errors[0].message
                        const frMsg = parcelErrorTranslations[enMsg] || enMsg
                        toast.error(`Colis ${i + 1} : ${frMsg}`)
                        return
                    }
                }
                break
            }
        }
        setCurrentStep((prev) => (prev < 3 ? ((prev + 1) as 0 | 1 | 2 | 3) : prev))
    }

    const prev = () => setCurrentStep((prev) => (prev > 0 ? ((prev - 1) as 0 | 1 | 2 | 3) : prev))

    // submit
    const handleSubmit = async () => {
        setLoading(true)
        if (isEditMode && existingSimulation) {
            // Mode édition
            try {
                const updateData: PartielUpdateSimulationDto = {
                    id: existingSimulation.id,
                    userId: existingSimulation.userId,
                    destinataireId: existingSimulation.destinataireId,
                    departureCountry: departure.country,
                    departureCity: departure.city,
                    departureAgency: departure.agencyName,
                    destinationCountry: destination.country,
                    destinationCity: destination.city,
                    destinationAgency: destination.agencyName,
                    parcels: parcels,
                    simulationStatus: existingSimulation.simulationStatus,
                    envoiStatus: existingSimulation.envoiStatus,
                }

                const response = await call(() => updateSimulationEdited(updateData))
                if (!response) {
                    toast.error("Une erreur est survenue lors de la mise à jour de la simulation.")
                    setLoading(false)
                    return
                }

                startTransition(() => {
                    toast.success("Simulation mise à jour avec succès !")
                    router.push("/client/simulation/results")
                })
            } catch (error) {
                console.error("Erreur lors de la mise à jour de la simulation:", error)
                toast.error("Une erreur est survenue lors de la mise à jour de la simulation.")
            } finally {
                setLoading(false)
            }
        } else {
            // Mode création
            const simulationData: SimulationDtoRequest = {
                departureCountry: departure.country,
                departureCity: departure.city,
                departureAgency: departure.agencyName,
                destinationCountry: destination.country,
                destinationCity: destination.city,
                destinationAgency: destination.agencyName,
                parcels,
            }

            const validated = simulationRequestSchema.safeParse(simulationData)
            if (!validated.success) {
                validated.error.errors.forEach((err) => toast.error(err.message))
                setLoading(false)
                return
            }

            try {
                const response = await call(() => submitSimulation(simulationData))
                if (!response) {
                    toast.error("Une erreur est survenue lors de la soumission de la simulation.")
                    setLoading(false)
                    return
                }

                startTransition(() => {
                    toast.success("Simulation envoyée avec succès !")
                    router.push("/client/simulation/results")
                })
            } catch (error) {
                console.error("Erreur lors de la soumission de la simulation:", error)
                toast.error("Une erreur est survenue lors de la soumission de la simulation.")
            } finally {
                setLoading(false)
            }
        }
    }

    // modal cookie
    const handleKeepSimulation = () => {
        setSimulationConfirmationModal(false)
        toast.success("Continuant avec la simulation...")
        setTimeout(() => router.push("/client/simulation/results"), 1500)
    }

    const handleCreateNewSimulation = async () => {
        setSimulationConfirmationModal(false)
        toast.success("La suppression de la simulation est en cours...")
        await deleteSimulationCookie()
        router.refresh()
    }

    // ───────── render
    if (loading || isPending) return <SimulationSkeleton />

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Indicateur d'étapes */}
            <StepIndicator steps={STEPS} currentStep={currentStep + 1} />

            {/* Contenu des étapes */}
            <Card>
                <CardContent className="p-4 md:p-6">
                    {currentStep === 0 && (
                        <StepDeparture
                            departure={departure}
                            countries={options.countries}
                            cities={options.departureCities}
                            agencies={options.departureAgencies}
                            onChange={handleDepartureChange}
                        />
                    )}
                    {currentStep === 1 && (
                        <StepDestination
                            destination={destination}
                            countries={options.destinationCountries}
                            cities={options.destinationCities}
                            agencies={options.destinationAgencies}
                            onChange={handleDestinationChange}
                            disabled={!departure.agencyName}
                        />
                    )}
                    {currentStep === 2 && (
                        <StepParcels
                            packageCount={packageCount}
                            parcels={parcels}
                            currentPackage={currentPackage}
                            onPackageCountChange={handlePackageCountChange}
                            onPackageChange={handlePackageChange}
                            setCurrentPackage={setCurrentPackage}
                            onAddParcel={handleAddParcel}
                            onRemoveParcel={handleRemoveParcel}
                            onDuplicateParcel={handleDuplicateParcel}
                            isEditMode={isEditMode}
                        />
                    )}
                    {currentStep === 3 && (
                        <StepConfirmation departure={departure} destination={destination} parcels={parcels} options={options} />
                    )}
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between gap-3">
                {currentStep > 0 ? (
                    <Button variant="outline" onClick={prev} className="w-full sm:w-auto bg-transparent">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Précédent
                    </Button>
                ) : (
                    <div className="hidden sm:block" />
                )}

                {currentStep < 3 ? (
                    <Button onClick={next} className="w-full sm:w-auto">
                        Suivant
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                ) : (
                    <Button onClick={handleSubmit} className="w-full sm:w-auto">
                        {isEditMode ? (
                            <>
                                <Edit className="h-4 w-4 mr-2" />
                                Mettre à jour
                            </>
                        ) : (
                            <>
                                <Plus className="h-4 w-4 mr-2" />
                                Soumettre
                            </>
                        )}
                    </Button>
                )}
            </div>

            {simulationConfirmationModal && (
                <SimulationConfirmationModal
                    show={simulationConfirmationModal}
                    handleClose={() => setSimulationConfirmationModal(false)}
                    handleConfirm={handleKeepSimulation}
                    handleCreateNew={handleCreateNewSimulation}
                />
            )}
        </div>
    )
}

export default SimulationFormWizard
