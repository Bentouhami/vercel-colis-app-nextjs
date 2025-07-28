"use client"

import type React from "react"
import { type ChangeEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Loader2,
    Mail,
    Phone,
    User,
    UserPlus,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Users,
    Send,
    Shield,
    Bug,
    Info,
    Copy,
    RefreshCw,
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
import { cn } from "@/lib/utils"

export default function AddReceiverForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [currentStep, setCurrentStep] = useState<"form" | "processing" | "success">("form")
    const [debugInfo, setDebugInfo] = useState<string>("")
    const [showDebug, setShowDebug] = useState(false)
    const [retryCount, setRetryCount] = useState(0)
    const [destinataireFormData, setDestinataireFormData] = useState<DestinataireInput>({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})

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

    const copyDebugInfo = () => {
        navigator.clipboard.writeText(debugInfo)
        toast.success("Informations de debug copiées dans le presse-papiers")
    }

    const handleRetry = () => {
        setRetryCount((prev) => prev + 1)
        setCurrentStep("form")
        setShowDebug(false)
        toast.info("Prêt pour une nouvelle tentative")
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        // Debug: Log form data
        console.log("🔍 Form Data:", destinataireFormData)
        let debugLog = `=== DEBUG LOG (Tentative ${retryCount + 1}) ===\nTimestamp: ${new Date().toISOString()}\n\nForm Data:\n${JSON.stringify(destinataireFormData, null, 2)}`
        setDebugInfo(debugLog)

        const validated = destinataireSchema.safeParse(destinataireFormData)
        if (!validated.success) {
            const newErrors: Record<string, string> = {}
            validated.error.errors.forEach((error) => {
                if (error.path[0]) {
                    newErrors[error.path[0].toString()] = error.message
                }
            })
            setErrors(newErrors)
            console.log("❌ Validation Errors:", newErrors)
            debugLog += `\n\nValidation Errors:\n${JSON.stringify(newErrors, null, 2)}`
            setDebugInfo(debugLog)
            toast.error("Veuillez corriger les erreurs dans le formulaire")
            return
        }

        setErrors({})
        setIsLoading(true)
        setCurrentStep("processing")

        try {
            // Format the destinataire data
            const formattedDestinataireData: CreateDestinataireDto = {
                ...destinataireFormData,
                name: `${destinataireFormData.firstName} ${destinataireFormData.lastName}`,
                image: "",
                role: RoleDto.DESTINATAIRE,
            }

            console.log("📤 Sending to API:", formattedDestinataireData)
            debugLog += `\n\nAPI Payload:\n${JSON.stringify(formattedDestinataireData, null, 2)}`
            setDebugInfo(debugLog)

            // Add the destinataire to the database
            console.log("🔄 Calling addDestinataire...")
            const destinataireId = await addDestinataire(formattedDestinataireData)
            console.log("✅ Destinataire ID received:", destinataireId)
            debugLog += `\n\nDestinataire ID received: ${destinataireId}`

            if (!destinataireId) {
                console.log("❌ No destinataire ID returned")
                debugLog += `\n\nERROR: No destinataire ID returned`
                setDebugInfo(debugLog)
                toast.error("Une erreur est survenue lors de l'enregistrement du destinataire.")
                setCurrentStep("form")
                setShowDebug(true)
                return
            }

            const simulationResults = await getSimulationFromCookie()
            console.log("📋 Simulation from cookie:", simulationResults)
            debugLog += `\n\nSimulation from cookie:\n${JSON.stringify(simulationResults, null, 2)}`

            if (!simulationResults) {
                console.log("❌ No simulation found in cookie")
                debugLog += `\n\nERROR: No simulation found in cookie`
                setDebugInfo(debugLog)
                toast.error("Une erreur est survenue lors de la récupération de la simulation.")
                setCurrentStep("form")
                setShowDebug(true)
                return
            }

            // Update simulation destinataire
            console.log("🔄 Updating simulation with destinataire ID:", destinataireId)
            debugLog += `\n\nUpdating simulation ${simulationResults.id} with destinataire ID: ${destinataireId}`
            const isUpdatedDestinataireId = await updateSimulationDestinataire(simulationResults.id, destinataireId)

            if (!isUpdatedDestinataireId) {
                console.log("❌ Failed to update simulation destinataire")
                debugLog += `\n\nERROR: Failed to update simulation destinataire`
                setDebugInfo(debugLog)
                toast.error("Une erreur est survenue lors de la mise à jour de la simulation.")
                setCurrentStep("form")
                setShowDebug(true)
                return
            }

            // Assign transport
            console.log("🚛 Assigning transport to simulation:", simulationResults.id)
            debugLog += `\n\nAssigning transport to simulation: ${simulationResults.id}`
            const isAssignedTransportToSimulation = await assignTransportToSimulation(simulationResults.id)

            if (!isAssignedTransportToSimulation) {
                console.log("❌ Failed to assign transport")
                debugLog += `\n\nERROR: Failed to assign transport`
                setDebugInfo(debugLog)
                toast.error("Une erreur est survenue lors de l'assignation du transport à la simulation.")
                setCurrentStep("form")
                setShowDebug(true)
                return
            }

            console.log("🎉 All operations successful!")
            debugLog += `\n\nSUCCESS: All operations completed successfully!`
            setDebugInfo(debugLog)
            setCurrentStep("success")
            toast.success("Destinataire ajouté avec succès à votre simulation.")

            setTimeout(() => {
                router.push("/client/envois/recapitulatif")
            }, 3000)
        } catch (error: any) {
            console.error("💥 Error in handleSubmit:", error)

            // Enhanced error logging
            const errorDetails = {
                message: error.message,
                name: error.name,
                stack: error.stack,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                config: error.config
                    ? {
                        url: error.config.url,
                        method: error.config.method,
                        headers: error.config.headers,
                        data: error.config.data,
                    }
                    : null,
            }

            console.log("🔍 Detailed Error:", errorDetails)
            debugLog += `\n\nERROR DETAILS:\n${JSON.stringify(errorDetails, null, 2)}`
            setDebugInfo(debugLog)

            let errorMessage = error.message || "Une erreur est survenue lors de l'ajout du destinataire."

            // Ne pas modifier le message d'erreur s'il vient déjà du service
            if (
                !error.message?.includes("Erreur de validation") &&
                !error.message?.includes("Non autorisé") &&
                !error.message?.includes("Accès interdit")
            ) {
                if (error.response?.status === 400) {
                    errorMessage = "Données invalides. Vérifiez les informations saisies."
                } else if (error.response?.status === 409) {
                    errorMessage = "Ce destinataire existe déjà avec cette adresse email."
                } else if (error.response?.status === 422) {
                    errorMessage = "Format des données incorrect. Vérifiez l'email et le téléphone."
                }
            }

            toast.error(errorMessage)
            setCurrentStep("form")
            setShowDebug(true)
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoBack = () => {
        router.back()
    }

    const isFormValid = () => {
        return (
            Object.values(destinataireFormData).every((value) => value.trim() !== "") &&
            Object.values(errors).every((error) => error === "")
        )
    }

    if (currentStep === "processing") {
        return (
            <RequireAuth allowedRoles={[RoleDto.CLIENT, RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT]}>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                    <div className="max-w-2xl mx-auto px-4">
                        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-12 text-center space-y-6">
                                <div className="relative">
                                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center animate-pulse">
                                        <Loader2 className="h-10 w-10 text-white animate-spin" />
                                    </div>
                                    <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-blue-200 rounded-full animate-ping" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-gray-900">Traitement en cours...</h2>
                                    <p className="text-gray-600">Nous ajoutons le destinataire à votre simulation</p>
                                    {retryCount > 0 && <p className="text-sm text-blue-600">Tentative {retryCount + 1}</p>}
                                </div>
                                <div className="flex justify-center space-x-1">
                                    {[0, 1, 2].map((i) => (
                                        <div
                                            key={i}
                                            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                            style={{ animationDelay: `${i * 0.1}s` }}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </RequireAuth>
        )
    }

    if (currentStep === "success") {
        return (
            <RequireAuth allowedRoles={[RoleDto.CLIENT, RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT]}>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                    <div className="max-w-2xl mx-auto px-4">
                        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-12 text-center space-y-6">
                                <div className="relative">
                                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="h-10 w-10 text-white" />
                                    </div>
                                    <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-green-200 rounded-full animate-ping" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-gray-900">Destinataire ajouté !</h2>
                                    <p className="text-gray-600">
                                        {destinataireFormData.firstName} {destinataireFormData.lastName} a été ajouté avec succès
                                    </p>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <p className="text-sm text-green-700">Redirection vers le récapitulatif dans quelques secondes...</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </RequireAuth>
        )
    }

    return (
        <RequireAuth allowedRoles={[RoleDto.CLIENT, RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT]}>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
                    {/* Debug Panel */}
                    {showDebug && debugInfo && (
                        <Alert className="border-orange-200 bg-orange-50">
                            <Bug className="h-4 w-4" />
                            <AlertDescription>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">Informations de débogage</span>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" onClick={copyDebugInfo} className="h-6 w-6 p-0" title="Copier">
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={handleRetry} className="h-6 w-6 p-0" title="Réessayer">
                                            <RefreshCw className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowDebug(false)}
                                            className="h-6 w-6 p-0"
                                            title="Fermer"
                                        >
                                            ×
                                        </Button>
                                    </div>
                                </div>
                                <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-60 whitespace-pre-wrap">
                                    {debugInfo}
                                </pre>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Header avec navigation */}
                    <div className="flex items-center gap-4 mb-8">
                        <Button variant="ghost" size="sm" onClick={handleGoBack} className="text-gray-600 hover:text-gray-900">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Retour
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Ajouter un destinataire
                            </h1>
                            <p className="text-gray-600 mt-1">Étape finale de votre simulation</p>
                        </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Simulation créée</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-600 font-medium">
                                <Users className="h-4 w-4" />
                                <span>Destinataire</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Send className="h-4 w-4" />
                                <span>Récapitulatif</span>
                            </div>
                        </div>
                        <div className="mt-2 bg-gray-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full w-2/3 transition-all duration-500" />
                        </div>
                    </div>

                    {/* Formulaire principal */}
                    <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                        <CardHeader className="text-center space-y-4 pb-6">
                            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                <UserPlus className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold text-gray-900">Informations du destinataire</CardTitle>
                                <CardDescription className="text-gray-600 mt-2">
                                    Veuillez remplir les informations de la personne qui recevra le colis
                                </CardDescription>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Prénom */}
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="flex items-center gap-2 text-sm font-medium text-gray-700">
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
                                            className={cn(
                                                "h-12 transition-all duration-200",
                                                errors.firstName
                                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
                                            )}
                                            disabled={isLoading}
                                        />
                                        {errors.firstName && (
                                            <div className="flex items-center gap-1 text-red-600 text-sm">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.firstName}
                                            </div>
                                        )}
                                    </div>

                                    {/* Nom */}
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="flex items-center gap-2 text-sm font-medium text-gray-700">
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
                                            className={cn(
                                                "h-12 transition-all duration-200",
                                                errors.lastName
                                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
                                            )}
                                            disabled={isLoading}
                                        />
                                        {errors.lastName && (
                                            <div className="flex items-center gap-1 text-red-600 text-sm">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.lastName}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <Mail className="h-4 w-4 text-blue-500" />
                                        Adresse email *
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={destinataireFormData.email}
                                        onChange={handleInputChange}
                                        onBlur={() => handleBlur("email")}
                                        placeholder="exemple@email.com"
                                        className={cn(
                                            "h-12 transition-all duration-200",
                                            errors.email
                                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
                                        )}
                                        disabled={isLoading}
                                    />
                                    {errors.email && (
                                        <div className="flex items-center gap-1 text-red-600 text-sm">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.email}
                                        </div>
                                    )}
                                </div>

                                {/* Téléphone */}
                                <div className="space-y-2">
                                    <Label htmlFor="phoneNumber" className="flex items-center gap-2 text-sm font-medium text-gray-700">
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
                                        placeholder="+33 6 XX XX XX XX"
                                        className={cn(
                                            "h-12 transition-all duration-200",
                                            errors.phoneNumber
                                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
                                        )}
                                        disabled={isLoading}
                                    />
                                    {errors.phoneNumber && (
                                        <div className="flex items-center gap-1 text-red-600 text-sm">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.phoneNumber}
                                        </div>
                                    )}
                                </div>

                                <Separator className="my-6" />

                                {/* Info sécurité */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-medium text-blue-900">Protection des données</h4>
                                            <p className="text-sm text-blue-700">
                                                Les informations du destinataire sont sécurisées et utilisées uniquement pour la livraison.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Boutons d'action */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleGoBack}
                                        className="flex-1 h-12 text-base bg-transparent"
                                        disabled={isLoading}
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Retour
                                    </Button>
                                    <Button
                                        type="submit"
                                        className={cn(
                                            "flex-1 h-12 text-base font-medium transition-all duration-200",
                                            "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
                                            "shadow-lg hover:shadow-xl transform hover:scale-[1.02]",
                                            !isFormValid() && "opacity-50 cursor-not-allowed",
                                        )}
                                        disabled={isLoading || !isFormValid()}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Ajout en cours...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                <UserPlus className="h-4 w-4" />
                                                Ajouter le destinataire
                                            </span>
                                        )}
                                    </Button>
                                </div>

                                {/* Debug toggle */}
                                {process.env.NODE_ENV === "development" && (
                                    <div className="pt-4 border-t">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowDebug(!showDebug)}
                                            className="text-xs text-gray-500"
                                        >
                                            <Info className="h-3 w-3 mr-1" />
                                            {showDebug ? "Masquer" : "Afficher"} les infos de débogage
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </CardContent>
                    </Card>

                    {/* Footer info */}
                    <div className="text-center text-sm text-gray-500">
                        <p>Une fois ajouté, vous pourrez consulter le récapitulatif complet de votre envoi</p>
                    </div>
                </div>
            </div>
        </RequireAuth>
    )
}
