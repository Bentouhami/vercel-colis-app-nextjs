// src/components/client-specific/profile/ProfileComponent.tsx

"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Mail, MapPin, Phone, Shield } from "lucide-react"
import { CheckCircleIcon } from "@heroicons/react/24/solid"
import { getCurrentUserId } from "@/lib/auth-utils"
import { getUserProfileById } from "@/services/frontend-services/UserService"
import type { ProfileDto } from "@/services/dtos/users/UserDto"

export default function ProfileComponent() {
    const router = useRouter()
    const [userData, setUserData] = useState<ProfileDto | null>(null)
    const [activeTab, setActiveTab] = useState("info")

    useEffect(() => {
        ; (async () => {
            try {
                const userId = await getCurrentUserId()
                if (userId) {
                    const user = await getUserProfileById(Number(userId))
                    setUserData(user || null)
                }
            } catch (error) {
                console.error("Error fetching user data:", error)
            }
        })()
    }, [])

    return (
        <div className="w-full space-y-6">
            {/* Profile Header */}
            <Card className="shadow-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-700 dark:from-indigo-800 dark:to-purple-900 text-white p-8 rounded-t-lg">
                    <div className="flex flex-col lg:flex-row items-center gap-6">
                        <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-700">
                            <AvatarImage src={userData?.image || ""} alt={userData?.name || "Profil"} />
                            <AvatarFallback className="text-2xl bg-indigo-500">{userData?.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="text-center lg:text-left flex-1">
                            <h1 className="text-3xl font-bold mb-2">
                                {userData?.name || `${userData?.firstName} ${userData?.lastName}` || "Utilisateur"}
                            </h1>
                            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                                <Badge className="bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 text-white px-3 py-1">
                                    {userData?.role}
                                </Badge>
                                <a
                                    href="/client/profile/settings"
                                    className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors"
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
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 h-12">
                    <TabsTrigger value="info" className="text-base">
                        Information
                    </TabsTrigger>
                    <TabsTrigger value="security" className="text-base">
                        Sécurité
                    </TabsTrigger>
                </TabsList>

                {/* Information Tab */}
                <TabsContent value="info" className="mt-6">
                    <Card className="shadow-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                        <CardContent className="pt-8 space-y-6">
                            <InfoItem icon={<Mail className="h-5 w-5 text-indigo-500" />} label="Email" value={userData?.email} />
                            <InfoItem
                                icon={<Phone className="h-5 w-5 text-indigo-500" />}
                                label="Téléphone"
                                value={userData?.phoneNumber || "N/A"}
                            />
                            {userData?.userAddresses && (
                                <InfoItem
                                    icon={<MapPin className="h-5 w-5 text-indigo-500" />}
                                    label="Adresse"
                                    value={[
                                        userData.userAddresses.streetNumber,
                                        userData.userAddresses.street,
                                        userData.userAddresses.city.name,
                                        userData.userAddresses.city.country.name,
                                    ]
                                        .filter(Boolean)
                                        .join(", ")}
                                />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="mt-6">
                    <Card className="shadow-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                        <CardContent className="pt-8 space-y-6">
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
    )
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start gap-4 p-5 border rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="mt-1">{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                <div className="font-medium text-gray-900 dark:text-gray-100 break-words">{value}</div>
            </div>
        </div>
    )
}
