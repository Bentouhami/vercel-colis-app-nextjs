"use client"

import { useEffect, useState } from "react"
import { MapPin } from "lucide-react"

const SimulationSkeleton = () => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div
            className={`max-w-4xl mx-auto p-4 md:p-8 mt-10 space-y-10 transition-all duration-700 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
        >
            <style>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(to right, #f6f7f8 4%, #edeef1 25%, #f6f7f8 36%);
          background-size: 1000px 100%;
        }
        .dark .animate-shimmer {
          background: linear-gradient(to right, #2d2f36 4%, #3c3f48 25%, #2d2f36 36%);
        }
      `}</style>

            {/* Titre */}
            <div
                className={`text-center transition-all duration-700 delay-100 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                    }`}
            >
                <div className="h-12 md:h-16 w-3/4 mx-auto rounded animate-shimmer" />
            </div>

            {/* Barre de progression */}
            <div className={`transition-all duration-500 delay-200 transform ${isVisible ? "opacity-100" : "opacity-0"}`}>
                <div className="h-2 w-full rounded animate-shimmer mb-4" />
                <div className="flex justify-between text-sm px-1 md:px-2">
                    {["Départ", "Destination", "Colis", "Confirmation"].map((step, i) => (
                        <div key={i} className="h-4 w-20 rounded animate-shimmer" />
                    ))}
                </div>
            </div>

            {/* Contenu principal - simule une étape */}
            <div className="relative min-h-[400px]">
                <div
                    className={`absolute inset-0 transition-all duration-500 delay-300 transform ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                        }`}
                >
                    {/* Card principale */}
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border">
                        {/* Header avec icône */}
                        <div className="flex items-center gap-2 mb-6">
                            <MapPin className="text-blue-500 h-5 w-5" />
                            <div className="h-6 w-48 rounded animate-shimmer" />
                        </div>

                        {/* Grille de champs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 w-24 rounded animate-shimmer" />
                                    <div className="h-10 w-full rounded animate-shimmer" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Boutons de navigation */}
            <div
                className={`flex justify-between mt-8 transition-all duration-500 delay-400 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
            >
                <div className="h-10 w-24 rounded animate-shimmer" />
                <div className="h-10 w-32 rounded animate-shimmer" />
            </div>
        </div>
    )
}

export default SimulationSkeleton
