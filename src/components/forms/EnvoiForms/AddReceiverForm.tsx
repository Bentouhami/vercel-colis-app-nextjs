"use client"

import type React from "react"

import { useState, useCallback, useMemo, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
    User,
    Mail,
    Phone,
    ArrowLeft,
    UserPlus,
    Loader2,
    CheckCircle,
    AlertCircle,
    ChevronDown,
    Copy,
    RotateCcw,
    Bug,
    Users,
    Search,
    Clock,
    Sparkles,
    Star,
    Zap,
} from "lucide-react"
import { toast } from "sonner"
import { type DestinataireInput, destinataireSchema } from "@/utils/validationSchema"
import { addDestinataire } from "@/services/frontend-services/UserService"
import { RoleDto } from "@/services/dtos/enums/EnumsDto"
import type { CreateDestinataireDto } from "@/services/dtos/users/UserDto"
import {
    assignTransportToSimulation,
    updateSimulationDestinataire,
} from "@/services/frontend-services/simulation/SimulationService"
import { getSimulationFromCookie } from "@/lib/simulationCookie"
import RequireAuth from "@/components/auth/RequireAuth"

interface DebugInfo {
    formData: DestinataireInput | null
    apiPayload: CreateDestinataireDto | null
    response: any
    error: any
    timestamp: string
    attemptCount: number
}

// Mock data pour l'aperçu des destinataires sauvegardés
const mockSavedDestinataires = [
    {
        id: "dest-001",
        firstName: "Marie",
        lastName: "Dubois",
        email: "marie.dubois@email.com",
        phoneNumber: "+32 65 12 34 56",
        isDefault: true,
        lastUsed: "Il y a 2 jours",
    },
    {
        id: "dest-002",
        firstName: "Pierre",
        lastName: "Martin",
        email: "pierre.martin@company.be",
        phoneNumber: "+32 2 123 45 67",
        isDefault: false,
        lastUsed: "Il y a 1 semaine",
    },
]

export default function AddReceiverForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
    const [isDebugOpen, setIsDebugOpen] = useState(false)
    const [attemptCount, setAttemptCount] = useState(0)

    const [destinataireFormData, setDestinataireFormData] = useState<DestinataireInput>({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    // Validation functions from original code
    const validateField = (name: string, value: string) => {
        try {
            const fieldSchema = destinataireSchema.shape[name as keyof DestinataireInput]
            fieldSchema.parse(value)
            setErrors((prev) => ({ ...prev, [name]: "" }))
        } catch (error: any) {
            setErrors((prev) => ({
                ...prev,
                [name]: error.errors[0]?.message || "Champ invalide",
            }))
        }
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setDestinataireFormData((prev) => ({ ...prev, [name]: value }))
        if (touched[name]) {
            validateField(name, value)
        }
    }

    const handleBlur = (name: string) => {
        setTouched((prev) => ({ ...prev, [name]: true }))
        validateField(name, destinataireFormData[name as keyof DestinataireInput])
    }

    // Memoized form validation status
    const formStatus = useMemo(() => {
        const hasErrors = Object.keys(errors).some((key) => errors[key])
        const isEmpty = !Object.values(destinataireFormData).some((value) => value.trim())
        const isComplete = Object.values(destinataireFormData).every((value) => value.trim())

        if (isEmpty) return { status: "empty", message: "Remplissez le formulaire" }
        if (hasErrors) return { status: "invalid", message: "Corrigez les erreurs" }
        if (isComplete && !hasErrors) return { status: "valid", message: "Formulaire valide" }

        return { status: "incomplete", message: "Complétez le formulaire" }
    }, [errors, destinataireFormData])

    const handleGoBack = useCallback(() => {
        router.back()
    }, [router])

    const copyDebugInfo = useCallback(async () => {
        if (!debugInfo) return

        const debugText = `
=== DEBUG INFO ===
Timestamp: ${debugInfo.timestamp}
Attempt: ${debugInfo.attemptCount}

Form Data:
${JSON.stringify(debugInfo.formData, null, 2)}

API Payload:
${JSON.stringify(debugInfo.apiPayload, null, 2)}

Response:
${JSON.stringify(debugInfo.response, null, 2)}

Error:
${JSON.stringify(debugInfo.error, null, 2)}
    `.trim()

        try {
            await navigator.clipboard.writeText(debugText)
            toast.success("Informations de debug copiées dans le presse-papiers")
        } catch (error) {
            console.error("Failed to copy debug info:", error)
            toast.error("Impossible de copier les informations")
        }
    }, [debugInfo])


    // Original handleSubmit logic with debug integration
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        // Prevent multiple submissions
        if (isLoading) {
            return
        }

        const currentAttempt = attemptCount + 1
        setAttemptCount(currentAttempt)
        const timestamp = new Date().toISOString()

        const validated = destinataireSchema.safeParse(destinataireFormData)
        if (!validated.success) {
            const newErrors: Record<string, string> = {}
            validated.error.errors.forEach((error) => {
                if (error.path[0]) {
                    newErrors[error.path[0].toString()] = error.message
                }
            })
            setErrors(newErrors)
            toast.error("Veuillez corriger les erreurs dans le formulaire")
            return
        }

        setErrors({})
        setIsLoading(true)
        setSubmitSuccess(false)

        try {
            // Format the destinataire data
            const formattedDestinataireData: CreateDestinataireDto = {
                ...destinataireFormData,
                name: `${destinataireFormData.firstName} ${destinataireFormData.lastName}`,
                image: "",
                role: RoleDto.DESTINATAIRE,
            }



            // Add the destinataire to the database
            const destinataireId = await addDestinataire(formattedDestinataireData)
            if (!destinataireId) {
                throw new Error("Une erreur est survenue lors de l'enregistrement du destinataire.")
            }

            const simulationResults = await getSimulationFromCookie()
            if (!simulationResults) {
                throw new Error("Une erreur est survenue lors de la récupération de la simulation.")
            }

            // Update simulation destinataire
            const isUpdatedDestinataireId = await updateSimulationDestinataire(simulationResults.id, destinataireId)
            if (!isUpdatedDestinataireId) {
                throw new Error("Une erreur est survenue lors de la mise à jour de la simulation.")
            }

            // Assign transport
            const isAssignedTransportToSimulation = await assignTransportToSimulation(simulationResults.id)
            if (!isAssignedTransportToSimulation) {
                throw new Error("Une erreur est survenue lors de l'assignation du transport à la simulation.")
            }



            setDebugInfo({
                formData: destinataireFormData,
                apiPayload: formattedDestinataireData,
                response: { success: true, destinataireId, simulationId: simulationResults.id },
                error: null,
                timestamp,
                attemptCount: currentAttempt,
            })

            setSubmitSuccess(true)
            toast.success("Destinataire ajouté avec succès à votre simulation.")

            setTimeout(() => {
                router.push("/client/envois/recapitulatif")
            }, 3000)
        } catch (error: any) {
            console.error("🔍 Detailed Error:", error)

            setDebugInfo({
                formData: destinataireFormData,
                apiPayload: {
                    ...destinataireFormData,
                    name: `${destinataireFormData.firstName} ${destinataireFormData.lastName}`,
                    image: "",
                    role: RoleDto.DESTINATAIRE,
                },
                response: null,
                error: {
                    message: error.message || "Erreur inconnue",
                    stack: error.stack,
                    config: error.config || {},
                },
                timestamp,
                attemptCount: currentAttempt,
            })

            const errorMessage = error.message || "Une erreur est survenue lors de l'ajout du destinataire."
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }


    const retrySubmission = useCallback(() => {
        if (!isLoading) {
            const form = document.querySelector("form") as HTMLFormElement
            if (form) {
                form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
            }
        }
    }, [isLoading])

    return (
        <RequireAuth allowedRoles={[RoleDto.CLIENT, RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT]}>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Section Sélection Rapide - Coming Soon */}
                <div className="animate-in slide-in-from-top-4 duration-700">
                    <Card className="relative transition-all duration-300 hover:shadow-lg border-dashed border-2 border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20">
                        {/* Coming Soon Badge */}
                        <div className="absolute -top-3 -right-3 z-10">
                            <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-1 text-xs font-semibold shadow-lg animate-pulse">
                                <Clock className="w-3 h-3 mr-1" />
                                Coming Soon
                            </Badge>
                        </div>

                        <CardHeader className="relative">
                            <CardTitle className="flex items-center gap-2 text-muted-foreground">
                                <Users className="h-5 w-5" />
                                Sélection Rapide
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                    Fonctionnalité Future
                                </Badge>
                            </CardTitle>

                            {/* TFE Notice */}
                            <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-in fade-in duration-1000 delay-300">
                                <div className="flex items-start gap-2">
                                    <Sparkles className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm">
                                        <p className="font-medium text-green-800 dark:text-green-300">Fonctionnalité Post-TFE</p>
                                        <p className="text-green-600 dark:text-green-400 mt-1">
                                            Sélectionnez rapidement un destinataire depuis votre carnet d&apos;adresses sauvegardé. Plus besoin de
                                            ressaisir les informations !
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="opacity-60">
                            <div className="space-y-4">
                                {/* Search Bar Preview */}
                                <div className="relative animate-in slide-in-from-left-4 duration-700 delay-500">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher dans vos destinataires sauvegardés..."
                                        className="w-full pl-10 pr-4 py-3 border border-dashed rounded-lg bg-transparent cursor-not-allowed text-muted-foreground"
                                        disabled
                                    />
                                </div>

                                {/* Saved Recipients Preview */}
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground mb-3">
                                        Vos destinataires récents :
                                    </p>
                                    {mockSavedDestinataires.map((destinataire, index) => (
                                        <div
                                            key={destinataire.id}
                                            className={`flex items-center gap-3 p-3 border border-dashed rounded-lg bg-card/50 cursor-not-allowed animate-in slide-in-from-left-4 duration-500`}
                                            style={{ animationDelay: `${(index + 1) * 200 + 600}ms` }}
                                        >
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 text-xs">
                                                    {destinataire.firstName[0]}
                                                    {destinataire.lastName[0]}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-foreground text-sm truncate">
                                                        {destinataire.firstName} {destinataire.lastName}
                                                    </p>
                                                    {destinataire.isDefault && (
                                                        <Badge variant="outline" className="text-xs">
                                                            <Star className="w-2 h-2 mr-1" />
                                                            Défaut
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {destinataire.email}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="w-3 h-3" />
                                                        {destinataire.phoneNumber}
                                                    </span>
                                                </div>
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled
                                                className="cursor-not-allowed opacity-50 bg-transparent text-xs"
                                            >
                                                <Zap className="w-3 h-3 mr-1" />
                                                Sélectionner
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                <div className="text-center py-2">
                                    <Button variant="outline" className="cursor-not-allowed opacity-50 bg-transparent" disabled>
                                        <Clock className="w-4 h-4 mr-2" />
                                        Fonctionnalité en développement
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex items-center gap-4 animate-in fade-in duration-500 delay-700">
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                    <span className="text-sm text-muted-foreground font-medium">OU</span>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                </div>

                {/* Formulaire d'ajout manuel */}
                <div className="animate-in slide-in-from-bottom-4 duration-700 delay-200">
                    <Card className="shadow-xl border-0 bg-card/90 backdrop-blur-sm">
                        <CardHeader className="text-center space-y-4 pb-8">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center animate-in zoom-in duration-500 delay-400">
                                <UserPlus className="h-8 w-8 text-white" />
                            </div>

                            <div className="animate-in fade-in duration-500 delay-600">
                                <CardTitle className="text-2xl font-bold text-foreground">Ajouter un nouveau destinataire</CardTitle>
                                <p className="text-muted-foreground mt-2">Renseignez les informations du destinataire pour votre envoi</p>
                            </div>

                            {/* Status Badge */}
                            <div className="animate-in fade-in duration-500 delay-800">
                                <Badge
                                    variant={
                                        formStatus.status === "valid"
                                            ? "default"
                                            : formStatus.status === "invalid"
                                                ? "destructive"
                                                : "secondary"
                                    }
                                    className="text-sm px-3 py-1"
                                >
                                    {formStatus.status === "valid" && <CheckCircle className="h-4 w-4 mr-1" />}
                                    {formStatus.status === "invalid" && <AlertCircle className="h-4 w-4 mr-1" />}
                                    {formStatus.message}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Nom et Prénom */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-left-4 duration-500 delay-500">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="flex items-center gap-2 text-foreground">
                                            <User className="h-4 w-4 text-blue-500" />
                                            Prénom *
                                        </Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            value={destinataireFormData.firstName}
                                            onChange={handleInputChange}
                                            onBlur={() => handleBlur("firstName")}
                                            placeholder="Entrez le prénom"
                                            className={`transition-all duration-200 ${errors.firstName ? "border-red-500" : ""}`}
                                            disabled={isLoading}
                                        />
                                        {errors.firstName && (
                                            <p className="text-sm text-red-600 dark:text-red-500 flex items-center gap-1 animate-in fade-in duration-200">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.firstName}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="flex items-center gap-2 text-foreground">
                                            <User className="h-4 w-4 text-blue-500" />
                                            Nom *
                                        </Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            value={destinataireFormData.lastName}
                                            onChange={handleInputChange}
                                            onBlur={() => handleBlur("lastName")}
                                            placeholder="Entrez le nom"
                                            className={`transition-all duration-200 ${errors.lastName ? "border-red-500" : ""}`}
                                            disabled={isLoading}
                                        />
                                        {errors.lastName && (
                                            <p className="text-sm text-red-600 dark:text-red-500 flex items-center gap-1 animate-in fade-in duration-200">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.lastName}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2 animate-in slide-in-from-left-4 duration-500 delay-600">
                                    <Label htmlFor="email" className="flex items-center gap-2 text-foreground">
                                        <Mail className="h-4 w-4 text-blue-500" />
                                        Email *
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={destinataireFormData.email}
                                        onChange={handleInputChange}
                                        onBlur={() => handleBlur("email")}
                                        placeholder="exemple@email.com"
                                        className={`transition-all duration-200 ${errors.email ? "border-red-500" : ""}`}
                                        disabled={isLoading}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-600 dark:text-red-500 flex items-center gap-1 animate-in fade-in duration-200">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Téléphone */}
                                <div className="space-y-2 animate-in slide-in-from-left-4 duration-500 delay-700">
                                    <Label htmlFor="phoneNumber" className="flex items-center gap-2 text-foreground">
                                        <Phone className="h-4 w-4 text-blue-500" />
                                        Numéro de téléphone *
                                    </Label>
                                    <Input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        type="tel"
                                        value={destinataireFormData.phoneNumber}
                                        onChange={handleInputChange}
                                        onBlur={() => handleBlur("phoneNumber")}
                                        placeholder="+32 123 456 789"
                                        className={`transition-all duration-200 ${errors.phoneNumber ? "border-red-500" : ""}`}
                                        disabled={isLoading}
                                    />
                                    {errors.phoneNumber && (
                                        <p className="text-sm text-red-600 dark:text-red-500 flex items-center gap-1 animate-in fade-in duration-200">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.phoneNumber}
                                        </p>
                                    )}
                                </div>

                                <Separator className="my-6" />

                                {/* Boutons d'action */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-in slide-in-from-bottom-4 duration-500 delay-800">
                                    <Button
                                        type="submit"
                                        disabled={
                                            isLoading || formStatus.status === "invalid" || formStatus.status === "empty" || submitSuccess
                                        }
                                        className="flex-1 h-12 text-lg font-medium bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                                Ajout en cours...
                                            </>
                                        ) : submitSuccess ? (
                                            <>
                                                <CheckCircle className="h-5 w-5 mr-2" />
                                                Ajouté avec succès !
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="h-5 w-5 mr-2" />
                                                Ajouter le destinataire
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleGoBack}
                                        disabled={isLoading}
                                        className="h-12 px-6 border-2 hover:bg-muted transition-all duration-200 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ArrowLeft className="h-5 w-5 mr-2" />
                                        Retour
                                    </Button>
                                </div>
                            </form>

                            {/* Panel de Debug */}
                            {debugInfo && (
                                <div className="mt-6 animate-in fade-in duration-500">
                                    <Collapsible open={isDebugOpen} onOpenChange={setIsDebugOpen}>
                                        <CollapsibleTrigger asChild>
                                            <Button variant="outline" className="w-full justify-between text-sm bg-transparent">
                                                <div className="flex items-center gap-2">
                                                    <Bug className="h-4 w-4" />
                                                    Informations de debug (Tentative #{debugInfo.attemptCount})
                                                </div>
                                                <ChevronDown className={`h-4 w-4 transition-transform ${isDebugOpen ? "rotate-180" : ""}`} />
                                            </Button>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="mt-4">
                                            <Card className="bg-muted border-gray-200 dark:border-gray-700">
                                                <CardContent className="p-4 space-y-4">
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={copyDebugInfo}
                                                            className="text-xs bg-transparent"
                                                            disabled={isLoading}
                                                        >
                                                            <Copy className="h-3 w-3 mr-1" />
                                                            Copier
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={retrySubmission}
                                                            disabled={isLoading}
                                                            className="text-xs bg-transparent"
                                                        >
                                                            {isLoading ? (
                                                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                            ) : (
                                                                <RotateCcw className="h-3 w-3 mr-1" />
                                                            )}
                                                            Réessayer
                                                        </Button>
                                                    </div>

                                                    <div className="space-y-3 text-xs text-foreground">
                                                        <div>
                                                            <strong>Timestamp:</strong> {debugInfo.timestamp}
                                                        </div>

                                                        <div>
                                                            <strong>Form Data:</strong>
                                                            <pre className="mt-1 p-2 bg-background rounded border text-xs overflow-x-auto">
                                                                {JSON.stringify(debugInfo.formData, null, 2)}
                                                            </pre>
                                                        </div>

                                                        <div>
                                                            <strong>API Payload:</strong>
                                                            <pre className="mt-1 p-2 bg-background rounded border text-xs overflow-x-auto">
                                                                {JSON.stringify(debugInfo.apiPayload, null, 2)}
                                                            </pre>
                                                        </div>

                                                        {debugInfo.response && (
                                                            <div>
                                                                <strong>Response:</strong>
                                                                <pre className="mt-1 p-2 bg-green-50 dark:bg-green-900/20 rounded border text-xs overflow-x-auto">
                                                                    {JSON.stringify(debugInfo.response, null, 2)}
                                                                </pre>
                                                            </div>
                                                        )}

                                                        {debugInfo.error && (
                                                            <div>
                                                                <strong>Error Details:</strong>
                                                                <pre className="mt-1 p-2 bg-red-50 dark:bg-red-900/20 rounded border text-xs overflow-x-auto">
                                                                    {JSON.stringify(debugInfo.error, null, 2)}
                                                                </pre>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </RequireAuth>
    )
}