// path src/components/client-specific/profile/NotificationSettings.tsx

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Bell, Mail, Smartphone, MessageSquare, Clock, Sparkles } from "lucide-react"

export default function NotificationSettings() {
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [smsNotifications, setSmsNotifications] = useState(false)
    const [pushNotifications, setPushNotifications] = useState(true)
    const [orderUpdates, setOrderUpdates] = useState(true)
    const [promotions, setPromotions] = useState(false)
    const [newsletter, setNewsletter] = useState(true)

    return (
        <div className="space-y-6">
            {/* Communication Preferences */}
            <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Préférences de communication
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-gray-500" />
                            <div>
                                <Label htmlFor="email-notifications" className="text-base font-medium">
                                    Notifications par email
                                </Label>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Recevez des notifications importantes par email
                                </p>
                            </div>
                        </div>
                        <Switch
                            id="email-notifications"
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                            className="transition-all duration-200"
                        />
                    </div>

                    {/* SMS Notifications - Coming Soon */}
                    <div className="relative p-4 border-dashed border-2 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg opacity-60">
                        <div className="absolute -top-2 -right-2">
                            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white animate-pulse text-xs">
                                <Clock className="h-2 w-2 mr-1" />
                                Soon
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Smartphone className="h-5 w-5 text-gray-400" />
                                <div>
                                    <Label htmlFor="sms-notifications" className="text-base font-medium text-gray-500">
                                        Notifications SMS
                                    </Label>
                                    <p className="text-sm text-gray-400">Recevez des alertes importantes par SMS</p>
                                    <div className="mt-1 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-xs">
                                        <div className="flex items-center gap-1 text-blue-700 dark:text-blue-300">
                                            <Sparkles className="h-3 w-3" />
                                            <span className="font-medium">TFE - Fonctionnalité Future</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Switch id="sms-notifications" checked={false} disabled className="cursor-not-allowed" />
                        </div>
                    </div>

                    {/* Push Notifications - Coming Soon */}
                    <div className="relative p-4 border-dashed border-2 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg opacity-60">
                        <div className="absolute -top-2 -right-2">
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse text-xs">
                                <Clock className="h-2 w-2 mr-1" />
                                Soon
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <MessageSquare className="h-5 w-5 text-gray-400" />
                                <div>
                                    <Label htmlFor="push-notifications" className="text-base font-medium text-gray-500">
                                        Notifications push
                                    </Label>
                                    <p className="text-sm text-gray-400">Recevez des notifications sur votre navigateur</p>
                                    <div className="mt-1 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-xs">
                                        <div className="flex items-center gap-1 text-green-700 dark:text-green-300">
                                            <Sparkles className="h-3 w-3" />
                                            <span className="font-medium">TFE - Développement Post-Soutenance</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Switch id="push-notifications" checked={false} disabled className="cursor-not-allowed" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Content Preferences */}
            <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                    <CardTitle>Préférences de contenu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="order-updates" className="text-base font-medium">
                                Mises à jour des commandes
                            </Label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Notifications sur le statut de vos envois et livraisons
                            </p>
                        </div>
                        <Switch
                            id="order-updates"
                            checked={orderUpdates}
                            onCheckedChange={setOrderUpdates}
                            className="transition-all duration-200"
                        />
                    </div>

                    {/* Promotions - Coming Soon */}
                    <div className="relative p-4 border-dashed border-2 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg opacity-60">
                        <div className="absolute -top-2 -right-2">
                            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse text-xs">
                                <Clock className="h-2 w-2 mr-1" />
                                Soon
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="promotions" className="text-base font-medium text-gray-500">
                                    Offres promotionnelles
                                </Label>
                                <p className="text-sm text-gray-400">Recevez des offres spéciales et des réductions</p>
                                <div className="mt-1 p-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded text-xs">
                                    <div className="flex items-center gap-1 text-purple-700 dark:text-purple-300">
                                        <Sparkles className="h-3 w-3" />
                                        <span className="font-medium">TFE - Module Marketing Futur</span>
                                    </div>
                                </div>
                            </div>
                            <Switch id="promotions" checked={false} disabled className="cursor-not-allowed" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="newsletter" className="text-base font-medium">
                                Newsletter
                            </Label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Actualités et conseils sur nos services</p>
                        </div>
                        <Switch
                            id="newsletter"
                            checked={newsletter}
                            onCheckedChange={setNewsletter}
                            className="transition-all duration-200"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
