// src/components/ui/GlobalLoadingOverlay.tsx
'use client';

import { useLoading } from '@/contexts/LoadingContext';
import { Loader2 } from 'lucide-react';

const GlobalLoadingOverlay = () => {
    const { isLoading } = useLoading();

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <Loader2 className="w-10 h-10 animate-spin text-white" />
        </div>
    );
};

export default GlobalLoadingOverlay;
