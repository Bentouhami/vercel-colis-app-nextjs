"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Bell, Mail, Smartphone, Package, Calendar, CreditCard, Settings, Trash2 } from "lucide-react"

// Mock data
const mockNotifications = [
    {
        id: 1,
        title: "Votre colis est en route",
        message: "Votre envoi COL-2024-001 est actuellement en transit vers Paris.",
        type: "shipment",
        date: "2024-01-20T10:30:00",
        read: false,
    },
    {
        id: 2,
        title: "Rendez-vous confirmé",
        message: "Votre rendez-vous du 25 janvier à 14h30 a été confirmé.",
        type: "appointment",
        date: "2024-01-19T15:45:00",
        read: true,
    },
    {
        id: 3,
        title: "Paiement effectué",
        message: "Votre paiement de 25,90 € a été traité avec succès.",
        type: "payment",
        date: "2024-01-18T09:15:00",
        read: true,
    },
    {
        id: 4,
        title: "Nouvelle offre disponible",
        message: "Profitez de -20% sur tous vos envois express ce mois-ci.",
        type: "promotion",
        date: "2024-01-17T12:00:00",
        read: false,
    },
]

const notificationTypes = {
    shipment: { label: "Envois", icon: Package, color: "bg-blue-100 text-blue-800" },
    appointment: { label: "Rendez-vous", icon: Calendar, color: "bg-green-100 text-green-800" },
    payment: { label: "Paiements", icon: CreditCard, color: "bg-purple-100 text-purple-800" },
    promotion: { label: "Promotions", icon: Mail, color: "bg-orange-100 text-orange-800" },
}

export default function NotificationsManagementComponent() {
    const [notifications, setNotifications] = useState(mockNotifications)
    const [preferences, setPreferences] = useState({
        email: true,
        push: true,
        sms: false,
        shipmentUpdates: true,
        appointmentReminders: true,
        paymentConfirmations: true,
        promotions: false,
    })

    const markAsRead = (id: number) => {
        setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
    }

    const deleteNotification = (id: number) => {
        setNotifications(notifications.filter((notif) => notif.id !== id))
    }

    const markAllAsRead = () => {
        setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
    }

    const unreadCount = notifications.filter((notif) => !notif.read).length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Notifications</h1>
                    <p className="text-gray-600 dark:text-gray-400">Gérez vos notifications et préférences de communication</p>
                </div>
                {unreadCount > 0 && (
                    <Button onClick={markAllAsRead} variant="outline">
                        Tout marquer comme lu ({unreadCount})
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Notifications List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications récentes</h2>
                    {notifications.length === 0 ? (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Aucune notification</h3>
                                <p className="text-gray-500 dark:text-gray-400">Vous êtes à jour !</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {notifications.map((notification) => {
                                const typeInfo = notificationTypes[notification.type as keyof typeof notificationTypes]
                                const TypeIcon = typeInfo.icon

                                return (
                                    <Card
                                        key={notification.id}
                                        className={`cursor-pointer transition-all hover:shadow-md ${!notification.read ? "border-l-4 border-l-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10" : ""
                                            }`}
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                                        <TypeIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3
                                                                className={`font-medium ${!notification.read
                                                                    ? "text-gray-900 dark:text-gray-100"
                                                                    : "text-gray-600 dark:text-gray-400"
                                                                    }`}
                                                            >
                                                                {notification.title}
                                                            </h3>
                                                            <Badge className={typeInfo.color} variant="secondary">
                                                                {typeInfo.label}
                                                            </Badge>
                                                            {!notification.read && <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>}
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{notification.message}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-500">
                                                            {new Date(notification.date).toLocaleString("fr-FR")}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        deleteNotification(notification.id)
                                                    }}
                                                    className="text-gray-400 hover:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Preferences */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                Préférences
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Communication Methods */}
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Moyens de communication</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm">Email</span>
                                        </div>
                                        <Switch
                                            checked={preferences.email}
                                            onCheckedChange={(checked) => setPreferences({ ...preferences, email: checked })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Bell className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm">Push</span>
                                        </div>
                                        <Switch
                                            checked={preferences.push}
                                            onCheckedChange={(checked) => setPreferences({ ...preferences, push: checked })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Smartphone className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm">SMS</span>
                                        </div>
                                        <Switch
                                            checked={preferences.sms}
                                            onCheckedChange={(checked) => setPreferences({ ...preferences, sms: checked })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Content Types */}
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Types de notifications</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm">Mises à jour d&apos;envois</span>
                                        </div>
                                        <Switch
                                            checked={preferences.shipmentUpdates}
                                            onCheckedChange={(checked) => setPreferences({ ...preferences, shipmentUpdates: checked })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm">Rappels de rendez-vous</span>
                                        </div>
                                        <Switch
                                            checked={preferences.appointmentReminders}
                                            onCheckedChange={(checked) => setPreferences({ ...preferences, appointmentReminders: checked })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm">Confirmations de paiement</span>
                                        </div>
                                        <Switch
                                            checked={preferences.paymentConfirmations}
                                            onCheckedChange={(checked) => setPreferences({ ...preferences, paymentConfirmations: checked })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm">Promotions</span>
                                        </div>
                                        <Switch
                                            checked={preferences.promotions}
                                            onCheckedChange={(checked) => setPreferences({ ...preferences, promotions: checked })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
