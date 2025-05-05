// path: src/app/client/page.tsx

import React from 'react'
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import Pricing from "@/components/pricing/Pricing";
import TarifsPage from "@/app/client/tarifs/page";

function Page() {
    return (
        <div className="min-h-screen bg-white dark:bg-black transition-colors">
            {/* Hero Section */}
            <HeroSection/>

            {/* Features Section */}
            <FeaturesSection/>

            {/* Pricing Section */}
            <section className="bg-gray-50 dark:bg-gray-900 py-16 mt-3 mb-3">
                <div className="container mx-auto px-4">
                    <Pricing/>
                </div>
            </section>

            {/* Tarifs Section */}
            <section className="bg-gray-50 dark:bg-gray-900 py-16">
                <div className="container mx-auto px-4">
                    <TarifsPage/>
                </div>
            </section>
        </div>
    )
}

export default Page
