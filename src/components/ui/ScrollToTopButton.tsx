// path: src/components/ui/ScrollToTopButton.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

export default function ScrollToTopButton({ targetId = 'features' }: { targetId?: string }) {
    const targetRef = useRef<HTMLElement | null>(null)
    const [isVisible, setIsVisible] = useState(false)
    const isInView = useInView(targetRef, {
        margin: '-20% 0px -20% 0px',
        once: false,
    })

    // Lier la référence à la vraie section (via id)
    useEffect(() => {
        const el = document.getElementById(targetId)
        if (el) targetRef.current = el as HTMLElement
    }, [targetId])

    // Mettre à jour l’état selon la visibilité
    useEffect(() => {
        setIsVisible(isInView)
    }, [isInView])

    if (!isVisible) return null

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            ⬆️
        </motion.button>
    )
}
