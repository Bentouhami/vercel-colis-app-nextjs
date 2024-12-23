"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Mail, MapPin, Phone, Shield } from "lucide-react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

import RequireAuth from "@/components/auth/RequireAuth";
import { getCurrentUserId } from "@/lib/auth";
import { getUserProfileById } from "@/services/frontend-services/UserService";
import { ProfileDto } from "@/services/dtos/users/UserDto";

export default function ProfileComponent() {
    const router = useRouter();
    const [userData, setUserData] = useState<ProfileDto | null>(null);
    const [activeTab, setActiveTab] = useState("info");
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const fullName =
        userData?.name ||
        `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim();

    const formatDate = (date: Date | null | undefined) =>
        date
            ? new Date(date).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })
            : "N/A";

    useEffect(() => {
        (async () => {
            try {
                const userId = await getCurrentUserId();
                if (!userId) {
                    router.push("/client/auth/login");
                    return;
                }
                const user = await getUserProfileById(Number(userId));
                setUserData(user || null);
                // Trigger animations after data is loaded
                setTimeout(() => setIsVisible(true), 100);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        })();
    }, [router]);

    return (
        <RequireAuth>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Profile Header with animations */}
                    <div className={`transform transition-all duration-1000 ease-out ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>
                        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                            <CardContent className="pt-6">
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    {/* Animated Avatar */}
                                    <div className={`transform transition-all duration-700 delay-300 ${
                                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                                    }`}>
                                        <Avatar className="h-32 w-32 border-4 border-white transition-transform duration-300 hover:scale-105">
                                            <AvatarImage src={userData?.image || ""} alt={fullName} />
                                            <AvatarFallback className="text-2xl bg-blue-400">
                                                {fullName
                                                    .split(" ")
                                                    .map((word) => word[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <div className="text-center md:text-left space-y-2">
                                        {/* Animated Name */}
                                        <h1 className={`text-3xl font-bold transform transition-all duration-700 delay-500 ${
                                            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                                        }`}>
                                            {fullName}
                                        </h1>
                                        {/* Animated Roles */}
                                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                            {userData?.roles.map((role, i) => (
                                                <Badge
                                                    key={i}
                                                    className={`bg-white/20 hover:bg-white/30 transform transition-all duration-500 hover:scale-110 ${
                                                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                                                    }`}
                                                    style={{ transitionDelay: `${700 + (i * 100)}ms` }}
                                                >
                                                    {role}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Animated Tabs Section */}
                    <div className={`transform transition-all duration-1000 delay-1000 ${
                        isVisible ? 'opacity-100' : 'opacity-0'
                    }`}>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger
                                    value="info"
                                    className="transition-all duration-200 hover:scale-105"
                                >
                                    Information
                                </TabsTrigger>
                                <TabsTrigger
                                    value="security"
                                    className="transition-all duration-200 hover:scale-105"
                                >
                                    Sécurité
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent
                                value="info"
                                ref={ref}
                                className={`mt-4 transform transition-all duration-500 ${
                                    activeTab === 'info' ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                                }`}
                            >
                                <Card className="shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
                                    <CardContent className="pt-6 grid gap-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <InfoItem
                                                icon={<Mail className="h-5 w-5 text-blue-500" />}
                                                label="Email"
                                                value={userData?.email}
                                            />
                                            <InfoItem
                                                icon={<Phone className="h-5 w-5 text-blue-500" />}
                                                label="Téléphone"
                                                value={userData?.phoneNumber || "N/A"}
                                            />

                                            {userData?.Address && (
                                                <InfoItem
                                                    icon={<MapPin className="h-5 w-5 text-blue-500" />}
                                                    label="Adresse"
                                                    value={[
                                                        userData.Address.number,
                                                        userData.Address.street,
                                                        userData.Address.city,
                                                        userData.Address.country,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(", ")}
                                                    className="col-span-2"
                                                />
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent
                                value="security"
                                className={`mt-4 transform transition-all duration-500 ${
                                    activeTab === 'security' ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                                }`}
                            >
                                <Card className="shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
                                    <CardContent className="pt-6 space-y-4">
                                        <InfoItem
                                            icon={<Shield className="h-5 w-5 text-blue-500" />}
                                            label="Statut de vérification"
                                            value={
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        className={
                                                            userData?.isVerified ? "bg-green-500" : "bg-red-500"
                                                        }
                                                    >
                                                        {userData?.isVerified ? "Vérifié" : "Non vérifié"}
                                                    </Badge>

                                                    {userData?.isVerified && (
                                                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                                    )}
                                                </div>
                                            }
                                        />

                                        {userData?.birthDate && (
                                            <InfoItem
                                                icon={<CalendarDays className="h-5 w-5 text-blue-500" />}
                                                label="Date de naissance"
                                                value={formatDate(userData.birthDate)}
                                            />
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </RequireAuth>
    );
}

function InfoItem({
                      icon,
                      label,
                      value,
                      className = "",
                  }: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`flex items-center gap-3 ${className} transform transition-all duration-300 hover:translate-x-1`}>
            {icon}
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="font-medium">{value}</p>
            </div>
        </div>
    );
}