'use client';

import { ProgressProvider } from '@bprogress/next/app';
import React from "react";
import { useThemeColor } from '@/hooks/useThemeColor';

const ProgressWrapper = ({ children }: { children: React.ReactNode }) => {
    const progressColor = useThemeColor();

    return (
        <ProgressProvider
            height="4px"
            color={progressColor}
            options={{ showSpinner: false }}
            shallowRouting
            delay={100}
            disableSameURL
            startPosition={0.1}
            stopDelay={200}
        >
            {children}
        </ProgressProvider>
    );
};

export default ProgressWrapper;