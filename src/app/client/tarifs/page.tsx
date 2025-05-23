// src/app/client/tarifs/page.tsx

import TarifsComponent from "@/components/tarifs/TarifsComponent";

const TarifsPage = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2s de chargement artificiel

    return (
        <div className="min-h-screen flex items-center justify-center">
            <TarifsComponent/>
        </div>
    );
};

export default TarifsPage;
