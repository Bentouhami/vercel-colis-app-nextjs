import { useEffect, useState } from 'react';

export const useThemeColor = () => {
    const [color, setColor] = useState('#3B82F6'); // fallback color

    useEffect(() => {
        const getThemeColor = () => {
            // Try to get the current theme from localStorage
            const currentTheme = localStorage.getItem('color-theme') || 'default';

            // Map themes to their primary colors
            const themeColors: Record<string, string> = {
                'default': '#3B82F6',
                'gray': '#6b7280',
                'violet': '#7c3aed',
                'green': '#22c55e',
                'yellow': '#eab308',
                'orange': '#f97316',
            };

            return themeColors[currentTheme] || '#3B82F6';
        };

        const updateColor = () => {
            setColor(getThemeColor());
        };

        // Initial update
        updateColor();

        // Listen for storage changes (theme changes)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'color-theme') {
                updateColor();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Also listen for theme-style link changes
        const observer = new MutationObserver(() => {
            setTimeout(updateColor, 100);
        });

        observer.observe(document.head, {
            childList: true,
            subtree: true
        });

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            observer.disconnect();
        };
    }, []);

    return color;
};