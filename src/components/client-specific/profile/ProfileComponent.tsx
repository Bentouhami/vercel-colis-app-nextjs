"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Mail, MapPin, Phone, Shield } from "lucide-react"
import { CheckCircleIcon } from "@heroicons/react/24/solid"

import RequireAuth from "@/components/auth/RequireAuth"
import { getCurrentUserId } from "@/lib/auth"
import { getUserProfileById } from "@/services/frontend-services/UserService"
import { ProfileDto } from "@/services/dtos/users/UserDto"
import { RoleDto } from "@/services/dtos"

export default function ProfileComponent() {
    const router = useRouter()
    const [userData, setUserData] = useState<ProfileDto | null>(null)
    const [activeTab, setActiveTab] = useState("info")

    useEffect(() => {
        (async () => {
            try {
                const userId = await getCurrentUserId()
                if (!userId) {
                    router.push("/client/auth/login")
                    return
                }
                const user = await getUserProfileById(Number(userId))
                setUserData(user || null)
            } catch (error) {
                console.error("Error fetching user data:", error)
            }
        })()
    }, [router])

    return (
        <RequireAuth allowedRoles={[RoleDto.CLIENT, RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT]}>
            <div className="container mx-auto max-w-3xl py-8">
                {/* Profile Header */}
                <Card className="mb-6 shadow-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                    <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-700 dark:from-indigo-800 dark:to-purple-900 text-white p-6 rounded-t-lg">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-700">
                                <AvatarImage src={userData?.image || ""} alt={userData?.name || "Profil"} />
                                <AvatarFallback className="text-2xl bg-indigo-500">
                                    {userData?.name?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>

                            <div className="text-center md:text-left">
                                <h1 className="text-3xl font-bold">{userData?.name || `${userData?.firstName} ${userData?.lastName}` || "Utilisateur"}</h1>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
                                    <Badge className="bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 text-white">
                                        {userData?.role}
                                    </Badge>
                                    <a 
                                        href="/client/profile/settings" 
                                        className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors"
                                    >
                                        Modifier mon profil
                                    </a>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 border dark:border-gray-700">
                        <TabsTrigger value="info">Information</TabsTrigger>
                        <TabsTrigger value="security">Sécurité</TabsTrigger>
                    </TabsList>

                    {/* Information Tab */}
                    <TabsContent value="info" className="mt-4">
                        <Card className="shadow-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                            <CardContent className="pt-6 grid gap-6">
                                <InfoItem icon={<Mail className="h-5 w-5 text-indigo-500" />} label="Email" value={userData?.email} />
                                <InfoItem icon={<Phone className="h-5 w-5 text-indigo-500" />} label="Téléphone" value={userData?.phoneNumber || "N/A"} />
                                {userData?.userAddresses && (
                                    <InfoItem
                                        icon={<MapPin className="h-5 w-5 text-indigo-500" />}
                                        label="Adresse"
                                        value={[
                                            userData.userAddresses.streetNumber,
                                            userData.userAddresses.street,
                                            userData.userAddresses.city.name,
                                            userData.userAddresses.city.country.name,
                                        ].filter(Boolean).join(", ")}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security" className="mt-4">
                        <Card className="shadow-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                            <CardContent className="pt-6 space-y-4">
                                <InfoItem
                                    icon={<Shield className="h-5 w-5 text-indigo-500" />}
                                    label="Statut de vérification"
                                    value={
                                        <div className="flex items-center gap-2">
                                            <Badge className={userData?.isVerified ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                                                {userData?.isVerified ? "Vérifié" : "Non vérifié"}
                                            </Badge>
                                            {userData?.isVerified && <CheckCircleIcon className="h-5 w-5 text-green-400" />}
                                        </div>
                                    }
                                />

                                {userData?.birthDate && (
                                    <InfoItem
                                        icon={<CalendarDays className="h-5 w-5 text-indigo-500" />}
                                        label="Date de naissance"
                                        value={new Date(userData.birthDate).toLocaleDateString("fr-FR", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </RequireAuth>
    )
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 p-4 border rounded-md border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            {icon}
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                <div className="font-medium">{value}</div>
            </div>
        </div>
    )
}
