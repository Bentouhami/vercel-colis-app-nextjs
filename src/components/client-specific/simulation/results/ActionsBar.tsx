// path: src/components/client-specific/simulation/results/ActionsBar.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    isActionInProgress: boolean;
    onValidate: () => void;
    onCancel: () => void;
    onEdit: () => void;
    className?: string;
}

const ActionsBar: React.FC<Props> = ({
    isActionInProgress,
    onValidate,
    onCancel,
    onEdit,
    className,
}) => (
    <div
        className={cn(
            "flex flex-col sm:flex-row gap-4 justify-center",
            "sm:static fixed bottom-0 inset-x-0 bg-background/90 backdrop-blur p-4 shadow-[0_-2px_6px_rgba(0,0,0,0.05)]",
            className,
        )}
    >
        <Button
            disabled={isActionInProgress}
            size="lg"
            className="sm:flex-1"
            onClick={onValidate}
        >
            Valider la Simulation
        </Button>

        <Button
            disabled={isActionInProgress}
            variant="destructive"
            size="lg"
            className="sm:flex-1"
            onClick={onCancel}
        >
            Annuler
        </Button>

        <Button
            disabled={isActionInProgress}
            variant="outline"
            size="lg"
            className="sm:flex-1"
            onClick={onEdit}
        >
            Modifier ma simulation
            <ArrowRight className="h-4 w-4 ml-1 text-primary" />
        </Button>
    </div>
);

export default ActionsBar;
