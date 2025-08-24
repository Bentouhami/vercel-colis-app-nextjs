// path: src/app/client/services/page.tsx
import Pricing from "@/components/pricing/Pricing";

export default function ServicesPage() {
    return (
        <div>
            {/* Active le mode "Coming Soon" ici */}
            <Pricing comingSoon />
        </div>
    );
}
