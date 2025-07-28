"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { ProfileDto } from "@/services/dtos"
import { getUserProfileById, updateUserProfile } from "@/services/frontend-services/UserService"
import { editProfileSchema } from "@/utils/validationSchema"

export type EditProfileFormType = z.infer<typeof editProfileSchema>

export default function EditProfileForm() {
    const { data: session, update } = useSession()
    const userId = session?.user?.id

    const [isPending, setIsPending] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isLoadingData, setIsLoadingData] = useState(true)

    const form = useForm<EditProfileFormType>({
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            birthDate: "",
            phoneNumber: "",
            email: "",
            address: {
                street: "",
                complement: "",
                streetNumber: "",
                boxNumber: "",
                city: "",
                country: "",
            },
        },
    })

    useEffect(() => {
        const fetchUserProfileData = async () => {
            if (!userId) {
                setIsLoadingData(false)
                return
            }
            try {
                const userData = await getUserProfileById(Number(userId))

                if (userData) {
                    form.reset({
                        firstName: userData.firstName || "",
                        lastName: userData.lastName || "",
                        birthDate: userData.birthDate ? new Date(userData.birthDate).toISOString().split("T")[0] : "",
                        phoneNumber: userData.phoneNumber || "",
                        email: userData.email || "",
                        address: {
                            street: userData.userAddresses?.street || "",
                            complement: userData.userAddresses?.complement || "",
                            streetNumber: userData.userAddresses?.streetNumber || "",
                            boxNumber: userData.userAddresses?.boxNumber || "",
                            city: userData.userAddresses?.city?.name || "",
                            country: userData.userAddresses?.city?.country?.name || "",
                        },
                    })
                }
            } catch (error) {
                console.error("Error fetching user profile:", error)
                toast.error("Erreur lors du chargement des données du profil.")
            } finally {
                setIsLoadingData(false)
            }
        }

        fetchUserProfileData()
    }, [userId, form])

    async function handleSubmit(formValues: EditProfileFormType) {
        setIsPending(true)
        try {
            const updatedProfile = await updateUserProfile(Number(userId), formValues)
            if (updatedProfile) {
                toast.success("Profil mis à jour avec succès !")
                setIsEditing(false)
                // Optionally, update session if needed
                update({
                    firstName: updatedProfile.firstName,
                    lastName: updatedProfile.lastName,
                    email: updatedProfile.email,
                    phoneNumber: updatedProfile.phoneNumber,
                })
            } else {
                toast.error("Échec de la mise à jour du profil.")
            }
        } catch (error) {
            console.error("Error updating profile:", error)
            toast.error("Une erreur est survenue lors de la mise à jour du profil.")
        } finally {
            setIsPending(false)
        }
    }

    if (isLoadingData) {
        return <div className="text-center py-8">Chargement du profil...</div> // Or a proper skeleton loader
    }

    return (
        <div className="space-y-6">
            {/* Profile Picture Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        Photo de profil
                        <Badge variant="secondary">Optionnel</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={session?.user?.image || "/placeholder.svg?height=96&width=96"} alt="Profile" />
                            <AvatarFallback className="text-2xl bg-indigo-500 text-white">
                                {session?.user?.firstName?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                            <Button variant="outline" size="sm">
                                <Camera className="h-4 w-4 mr-2" />
                                Changer la photo
                            </Button>
                            <p className="text-sm text-gray-500 dark:text-gray-400">JPG, PNG ou GIF. Taille maximale de 2MB.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        Informations personnelles
                        {!isEditing && (
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                                Modifier
                            </Button>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">Prénom</Label>
                                <Input
                                    id="firstName"
                                    {...form.register("firstName")}
                                    disabled={!isEditing}
                                    className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
                                />
                                {form.formState.errors.firstName && (
                                    <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastName">Nom</Label>
                                <Input
                                    id="lastName"
                                    {...form.register("lastName")}
                                    disabled={!isEditing}
                                    className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
                                />
                                {form.formState.errors.lastName && (
                                    <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...form.register("email")}
                                    disabled={!isEditing}
                                    className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
                                />
                                {form.formState.errors.email && (
                                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Téléphone</Label>
                                <Input
                                    id="phoneNumber"
                                    {...form.register("phoneNumber")}
                                    disabled={!isEditing}
                                    className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
                                />
                                {form.formState.errors.phoneNumber && (
                                    <p className="text-sm text-red-500">{form.formState.errors.phoneNumber.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="birthDate">Date de naissance</Label>
                            <Input
                                id="birthDate"
                                type="date"
                                {...form.register("birthDate")}
                                disabled={!isEditing}
                                className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
                            />
                            {form.formState.errors.birthDate && (
                                <p className="text-sm text-red-500">{form.formState.errors.birthDate.message}</p>
                            )}
                        </div>

                        {/* Address Section */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-medium mb-4">Adresse</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="streetNumber">Numéro</Label>
                                    <Input
                                        id="streetNumber"
                                        {...form.register("address.streetNumber")}
                                        disabled={!isEditing}
                                        className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="street">Rue</Label>
                                    <Input
                                        id="street"
                                        {...form.register("address.street")}
                                        disabled={!isEditing}
                                        className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
                                    />
                                    {form.formState.errors.address?.street && (
                                        <p className="text-sm text-red-500">{form.formState.errors.address.street.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">Ville</Label>
                                    <Input
                                        id="city"
                                        {...form.register("address.city")}
                                        disabled={!isEditing}
                                        className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
                                    />
                                    {form.formState.errors.address?.city && (
                                        <p className="text-sm text-red-500">{form.formState.errors.address.city.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="country">Pays</Label>
                                    <Input
                                        id="country"
                                        {...form.register("address.country")}
                                        disabled={!isEditing}
                                        className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
                                    />
                                    {form.formState.errors.address?.country && (
                                        <p className="text-sm text-red-500">{form.formState.errors.address.country.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex gap-3 pt-4">
                                <Button type="submit" disabled={isPending} className="flex-1">
                                    <Save className="h-4 w-4 mr-2" />
                                    {isPending ? "Enregistrement..." : "Enregistrer les modifications"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditing(false)
                                        form.reset()
                                    }}
                                    disabled={isPending}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Annuler
                                </Button>
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
