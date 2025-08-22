"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield, Key, Smartphone, Eye, EyeOff, Clock, Sparkles } from "lucide-react"

export default function SecuritySettings() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    return (
        <div className="space-y-6">
            {/* Password Change */}
            <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5 text-blue-600" />
                        Changer le mot de passe
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                        <div className="relative">
                            <Input
                                id="currentPassword"
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="Entrez votre mot de passe actuel"
                                className="transition-all duration-200 focus:scale-[1.02] focus:shadow-md"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Entrez votre nouveau mot de passe"
                                className="transition-all duration-200 focus:scale-[1.02] focus:shadow-md"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirmez votre nouveau mot de passe"
                                className="transition-all duration-200 focus:scale-[1.02] focus:shadow-md"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    <Button className="w-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                        Mettre à jour le mot de passe
                    </Button>
                </CardContent>
            </Card>

            {/* Two-Factor Authentication - Coming Soon */}
            <Card className="relative transition-all duration-300 hover:shadow-lg border-dashed border-2 border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50">
                {/* Coming Soon Badge */}
                <div className="absolute -top-3 -right-3 z-10">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-xs font-semibold shadow-lg animate-pulse">
                        <Clock className="w-3 h-3 mr-1" />
                        Coming Soon
                    </Badge>
                </div>

                <CardHeader className="relative">
                    <CardTitle className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Smartphone className="h-5 w-5" />
                        Authentification à deux facteurs
                        <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                        >
                            Recommandé
                        </Badge>
                    </CardTitle>

                    {/* TFE Notice */}
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                                <p className="font-medium text-blue-800 dark:text-blue-300">Fonctionnalité Future - TFE</p>
                                <p className="text-blue-600 dark:text-blue-400 mt-1">
                                    Cette fonctionnalité sera implémentée dans les versions futures de l&apos;application. Elle fait partie du
                                    roadmap de développement post-TFE.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="opacity-60">
                    <div className="flex items-center justify-between p-4 border rounded-lg border-dashed">
                        <div>
                            <h4 className="font-medium text-gray-600 dark:text-gray-400">Authentification par SMS</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-500">Recevez un code de vérification par SMS</p>
                        </div>
                        <Badge variant="outline" className="text-gray-500 border-gray-300">
                            Non disponible
                        </Badge>
                    </div>
                    <Button variant="outline" className="w-full mt-4 bg-transparent cursor-not-allowed opacity-50" disabled>
                        <Clock className="w-4 h-4 mr-2" />
                        Fonctionnalité en développement
                    </Button>
                </CardContent>
            </Card>

            {/* Account Security - Coming Soon */}
            <Card className="relative transition-all duration-300 hover:shadow-lg border-dashed border-2 border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50">
                {/* Coming Soon Badge */}
                <div className="absolute -top-3 -right-3 z-10">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 text-xs font-semibold shadow-lg animate-pulse">
                        <Clock className="w-3 h-3 mr-1" />
                        Coming Soon
                    </Badge>
                </div>

                <CardHeader className="relative">
                    <CardTitle className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Shield className="h-5 w-5" />
                        Sécurité du compte
                    </CardTitle>

                    {/* TFE Notice */}
                    <div className="mt-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                        <div className="flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                                <p className="font-medium text-orange-800 dark:text-orange-300">Fonctionnalité Future - TFE</p>
                                <p className="text-orange-600 dark:text-orange-400 mt-1">
                                    La gestion avancée des sessions et la surveillance de sécurité seront disponibles dans les prochaines
                                    versions de l&apos;application.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4 opacity-60">
                    <div className="flex items-center justify-between p-4 border rounded-lg border-dashed">
                        <div>
                            <h4 className="font-medium text-gray-600 dark:text-gray-400">Dernière connexion</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-500">Informations de connexion détaillées</p>
                        </div>
                        <Badge variant="outline" className="text-gray-500 border-gray-300">
                            Non disponible
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg border-dashed">
                        <div>
                            <h4 className="font-medium text-gray-600 dark:text-gray-400">Sessions actives</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-500">Gestion des appareils connectés</p>
                        </div>
                        <Button variant="outline" size="sm" disabled className="cursor-not-allowed opacity-50 bg-transparent">
                            Non disponible
                        </Button>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full cursor-not-allowed opacity-50 border-dashed bg-transparent"
                        disabled
                    >
                        <Clock className="w-4 h-4 mr-2" />
                        Fonctionnalité en développement
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
