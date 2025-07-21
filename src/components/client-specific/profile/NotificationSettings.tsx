"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, Mail, Smartphone, MessageSquare } from "lucide-react"

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
            <Card>
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
                        <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Smartphone className="h-5 w-5 text-gray-500" />
                            <div>
                                <Label htmlFor="sms-notifications" className="text-base font-medium">
                                    Notifications SMS
                                </Label>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Recevez des alertes importantes par SMS</p>
                            </div>
                        </div>
                        <Switch id="sms-notifications" checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <MessageSquare className="h-5 w-5 text-gray-500" />
                            <div>
                                <Label htmlFor="push-notifications" className="text-base font-medium">
                                    Notifications push
                                </Label>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Recevez des notifications sur votre navigateur
                                </p>
                            </div>
                        </div>
                        <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
                    </div>
                </CardContent>
            </Card>

            {/* Content Preferences */}
            <Card>
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
                        <Switch id="order-updates" checked={orderUpdates} onCheckedChange={setOrderUpdates} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="promotions" className="text-base font-medium">
                                Offres promotionnelles
                            </Label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Recevez des offres spéciales et des réductions</p>
                        </div>
                        <Switch id="promotions" checked={promotions} onCheckedChange={setPromotions} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="newsletter" className="text-base font-medium">
                                Newsletter
                            </Label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Actualités et conseils sur nos services</p>
                        </div>
                        <Switch id="newsletter" checked={newsletter} onCheckedChange={setNewsletter} />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
