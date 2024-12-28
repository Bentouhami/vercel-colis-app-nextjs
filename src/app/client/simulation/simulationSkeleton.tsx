// path: src/app/client/simulation/simulationSkeleton.tsx
'use client';


import React from 'react';
import {motion} from 'framer-motion';
import {Box, MapPin, Truck} from 'lucide-react';

const SimulationSkeleton = () => {
    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            className="container mx-auto p-8 mt-10 bg-gray-50 rounded-lg shadow-lg space-y-8"
        >
            <style>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(to right, #f6f7f8 4%, #edeef1 25%, #f6f7f8 36%);
          background-size: 1000px 100%;
        }
      `}</style>

            <motion.h2
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.1}}
                className="text-center text-3xl font-bold text-blue-600"
            >
            </motion.h2>

            <div className="max-w-4xl mx-auto p-6 space-y-6 mb-52 bg-gray-50 rounded-lg shadow-lg">
                {/* Departure Information */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.2}}
                    className="p-6 bg-white rounded-md shadow-md"
                >
                    <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                        <MapPin className="text-blue-500"/> Informations de Départ
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 w-24 rounded animate-shimmer"/>
                                <div className="h-10 w-full rounded animate-shimmer"/>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Destination Information */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.3}}
                    className="p-6 bg-white rounded-md shadow-md"
                >
                    <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                        <Truck className="text-blue-500"/> Informations de Destination
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 w-24 rounded animate-shimmer"/>
                                <div className="h-10 w-full rounded animate-shimmer"/>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Parcel Information */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.4}}
                    className="p-6 bg-white rounded-md shadow-md"
                >
                    <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                        <Box className="text-blue-500"/> Informations des Colis
                    </h3>
                    <div className="mb-4">
                        <div className="h-4 w-32 rounded animate-shimmer mb-2"/>
                        <div className="h-10 w-full rounded animate-shimmer"/>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 w-24 rounded animate-shimmer"/>
                                <div className="h-10 w-full rounded animate-shimmer"/>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center gap-2 mt-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-8 w-8 rounded animate-shimmer"/>
                        ))}
                    </div>
                </motion.div>

                <div className="text-center">
                    <div className="h-12 w-48 mx-auto rounded animate-shimmer"/>
                </div>
            </div>
        </motion.div>
    );
};

export default SimulationSkeleton;