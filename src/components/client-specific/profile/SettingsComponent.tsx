"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import EditProfileForm from "@/components/forms/AuthForms/EditProfileForm"
import SecuritySettings from "@/components/client-specific/profile/SecuritySettings"
import NotificationSettings from '@/components/client-specific/profile/NotificationSettings';

// Mock data pour la prévisualisation
const mockUserData = {
    firstName: "Faisal",
    lastName: "Bentouhami",
    email: "bentouhami.faisal@gmail.com",
    phoneNumber: "+32456222054",
    birthDate: "1990-05-15",
    userAddresses: {
        street: "Rue des Martyrs",
        streetNumber: "28",
        complement: "",
        boxNumber: "",
        city: {
            name: "Frameries",
            country: {
                name: "Belgium",
            },
        },
    },
}

import { useRouter } from "next/navigation"

interface SettingsComponentProps {
    // onNavigateBack: () => void // No longer needed as a prop
}

export default function SettingsComponent({ /* onNavigateBack */ }: SettingsComponentProps) {
    const [activeTab, setActiveTab] = useState("profile")
    const router = useRouter()

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    <ArrowLeft className="h-4 w-4" />
                    Retour au profil
                </Button>
            </div>

            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">Paramètres du Profil</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                        Modifiez vos informations personnelles, vos paramètres de sécurité et vos préférences de notification.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 h-auto p-1 rounded-lg">
                    <TabsTrigger value="profile" className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-indigo-400">
                        Profil
                    </TabsTrigger>
                    <TabsTrigger value="security" className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-indigo-400">
                        Sécurité
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-indigo-400">
                        Notifications
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-6 p-4 border rounded-lg bg-white dark:bg-gray-800">
                    <EditProfileForm initialData={mockUserData} />
                </TabsContent>

                <TabsContent value="security" className="mt-6 p-4 border rounded-lg bg-white dark:bg-gray-800">
                    <SecuritySettings />
                </TabsContent>

                <TabsContent value="notifications" className="mt-6 p-4 border rounded-lg bg-white dark:bg-gray-800">
                    <NotificationSettings />
                </TabsContent>
            </Tabs>
        </CardContent>
            </Card>
        </div>
    )
}
