// src/components/client-specific/profile/ProfileComponent.tsx

"use client"

import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarDays, Mail, MapPin, Phone, Shield, ArrowLeft, Edit, Save, X, AlertCircle } from "lucide-react"
import { CheckCircleIcon } from "@heroicons/react/24/solid"
import { getCurrentUserId } from "@/lib/auth-utils"
import { getUserProfileById } from "@/services/frontend-services/UserService"
import type { ProfileDto } from "@/services/dtos/users/UserDto"

interface ProfileComponentProps {
    userId?: string | number; // Optional: if provided, loads specific user; if not, loads current user
    isAdminView?: boolean; // Optional: enables admin-specific features
    onUserUpdated?: (user: ProfileDto) => void; // Optional: callback when user is updated
    showEditButton?: boolean; // Optional: whether to show edit functionality
}

export default function ProfileComponent({
    userId,
    isAdminView = false,
    onUserUpdated,
    showEditButton = true
}: ProfileComponentProps) {
    const [userData, setUserData] = useState<ProfileDto | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState("info")
    const [isEditing, setIsEditing] = useState(false)

    const isCurrentUser = !userId || !isAdminView

    const fetchUserData = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            let targetUserId: number | null = null

            if (userId) {
                // If userId is provided, use it (admin viewing specific user)
                targetUserId = Number(userId)
            } else {
                // If no userId provided, get current user (user viewing own profile)
                const currentUserId = await getCurrentUserId()
                targetUserId = currentUserId ? Number(currentUserId) : null
            }

            if (!targetUserId) {
                throw new Error("Unable to determine user ID")
            }

            const user = await getUserProfileById(targetUserId)
            setUserData(user)

            // Notify parent component if callback provided
            if (onUserUpdated && user) {
                onUserUpdated(user)
            }
        } catch (error) {
            console.error("Error fetching user data:", error)
            setError(error instanceof Error ? error.message : "Failed to load user profile")
        } finally {
            setLoading(false)
        }
    }, [onUserUpdated, userId])

    useEffect(() => {
        fetchUserData()
    }, [fetchUserData])

    const handleEditToggle = () => {
        setIsEditing(!isEditing)
    }

    const handleSave = async () => {
        // TODO: Implement save functionality
        // This would involve calling an update API endpoint
        setIsEditing(false)
        // Refresh data after save
        await fetchUserData()
    }

    // Loading state
    if (loading) {
        return <ProfileSkeleton />
    }

    // Error state
    if (error) {
        return (
            <div className="w-full space-y-6">
                <Card className="shadow-lg">
                    <CardContent className="pt-8">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {error}
                            </AlertDescription>
                        </Alert>
                        <div className="mt-4 flex gap-3">
                            <Button onClick={fetchUserData} variant="outline">
                                Try Again
                            </Button>
                            {isAdminView && (
                                <Button
                                    onClick={() => window.history.back()}
                                    variant="ghost"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="w-full space-y-6">
            {/* Admin Navigation */}
            {isAdminView && (
                <div className="flex items-center justify-between">
                    <Button
                        onClick={() => window.history.back()}
                        variant="ghost"
                        className="mb-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Users
                    </Button>
                    {userData && (
                        <Badge variant="secondary" className="mb-4">
                            User ID: {userId}
                        </Badge>
                    )}
                </div>
            )}

            {/* Profile Header */}
            <Card className="shadow-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-700 dark:from-indigo-800 dark:to-purple-900 text-white p-8 rounded-t-lg">
                    <div className="flex flex-col lg:flex-row items-center gap-6">
                        <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-700">
                            <AvatarImage src={userData?.image || ""} alt={userData?.name || "Profile"} />
                            <AvatarFallback className="text-2xl bg-indigo-500">
                                {userData?.name?.charAt(0) || userData?.firstName?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center lg:text-left flex-1">
                            <h1 className="text-3xl font-bold mb-2">
                                {userData?.name || `${userData?.firstName} ${userData?.lastName}` || "User"}
                            </h1>
                            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                                <Badge className="bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 text-white px-3 py-1">
                                    {userData?.role}
                                </Badge>
                                {isAdminView && userData?.isVerified && (
                                    <Badge className="bg-green-500/20 hover:bg-green-500/30 text-white px-3 py-1">
                                        ✓ Verified
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2">
                            {showEditButton && isAdminView && (
                                <>
                                    {!isEditing ? (
                                        <Button
                                            onClick={handleEditToggle}
                                            variant="secondary"
                                            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                                        >
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Profile
                                        </Button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={handleSave}
                                                variant="secondary"
                                                className="bg-green-500/20 hover:bg-green-500/30 text-white border-green-500/30"
                                            >
                                                <Save className="mr-2 h-4 w-4" />
                                                Save
                                            </Button>
                                            <Button
                                                onClick={handleEditToggle}
                                                variant="secondary"
                                                className="bg-red-500/20 hover:bg-red-500/30 text-white border-red-500/30"
                                            >
                                                <X className="mr-2 h-4 w-4" />
                                                Cancel
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}

                            {isCurrentUser && !isAdminView && (
                                <a
                                    href="/client/profile/settings"
                                    className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors"
                                >
                                    Edit Profile
                                </a>
                            )}
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
                        {isAdminView ? "Account Status" : "Security"}
                    </TabsTrigger>
                </TabsList>

                {/* Information Tab */}
                <TabsContent value="info" className="mt-6">
                    <Card className="shadow-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                        <CardContent className="pt-8 space-y-6">
                            <InfoItem
                                icon={<Mail className="h-5 w-5 text-indigo-500" />}
                                label="Email"
                                value={userData?.email}
                                isEditing={isEditing}
                            />
                            <InfoItem
                                icon={<Phone className="h-5 w-5 text-indigo-500" />}
                                label={isAdminView ? "Phone Number" : "Téléphone"}
                                value={userData?.phoneNumber || "N/A"}
                                isEditing={isEditing}
                            />
                            {userData?.userAddresses && (
                                <InfoItem
                                    icon={<MapPin className="h-5 w-5 text-indigo-500" />}
                                    label={isAdminView ? "Address" : "Adresse"}
                                    value={[
                                        userData.userAddresses.streetNumber,
                                        userData.userAddresses.street,
                                        userData.userAddresses.city.name,
                                        userData.userAddresses.city.country.name,
                                    ]
                                        .filter(Boolean)
                                        .join(", ")}
                                    isEditing={isEditing}
                                />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security/Account Status Tab */}
                <TabsContent value="security" className="mt-6">
                    <Card className="shadow-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                        <CardContent className="pt-8 space-y-6">
                            <InfoItem
                                icon={<Shield className="h-5 w-5 text-indigo-500" />}
                                label={isAdminView ? "Verification Status" : "Statut de vérification"}
                                value={
                                    <div className="flex items-center gap-2">
                                        <Badge className={userData?.isVerified ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                                            {userData?.isVerified ?
                                                (isAdminView ? "Verified" : "Vérifié") :
                                                (isAdminView ? "Not Verified" : "Non vérifié")
                                            }
                                        </Badge>
                                        {userData?.isVerified && <CheckCircleIcon className="h-5 w-5 text-green-400" />}
                                    </div>
                                }
                                isEditing={isEditing}
                            />
                            {userData?.birthDate && (
                                <InfoItem
                                    icon={<CalendarDays className="h-5 w-5 text-indigo-500" />}
                                    label={isAdminView ? "Birth Date" : "Date de naissance"}
                                    value={new Date(userData.birthDate).toLocaleDateString(
                                        isAdminView ? "en-US" : "fr-FR",
                                        {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        }
                                    )}
                                    isEditing={isEditing}
                                />
                            )}

                            {/* Admin-only information */}
                            {isAdminView && (
                                <>
                                    <InfoItem
                                        icon={<CalendarDays className="h-5 w-5 text-indigo-500" />}
                                        label="User ID"
                                        value={userId?.toString() || "N/A"}
                                        isEditing={false} // Never editable
                                    />
                                    <InfoItem
                                        icon={<Shield className="h-5 w-5 text-indigo-500" />}
                                        label="Role"
                                        value={userData?.role || "N/A"}
                                        isEditing={isEditing}
                                    />
                                </>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

// Updated InfoItem component to support editing
function InfoItem({
    icon,
    label,
    value,
    isEditing = false
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    isEditing?: boolean;
}) {
    return (
        <div className="flex items-start gap-4 p-5 border rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="mt-1">{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                <div className="font-medium text-gray-900 dark:text-gray-100 break-words">
                    {isEditing && typeof value === 'string' ? (
                        <input
                            type="text"
                            defaultValue={value}
                            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                        />
                    ) : (
                        value
                    )}
                </div>
            </div>
        </div>
    )
}

// Loading skeleton component
function ProfileSkeleton() {
    return (
        <div className="w-full space-y-6">
            <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 rounded-t-lg">
                    <div className="flex flex-col lg:flex-row items-center gap-6">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <div className="text-center lg:text-left flex-1 space-y-3">
                            <Skeleton className="h-8 w-64" />
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-6 w-32" />
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <Card className="shadow-lg">
                <CardContent className="pt-8 space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start gap-4 p-5 border rounded-lg border-gray-200">
                            <Skeleton className="h-5 w-5 rounded" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
