"use client";

import { createContext, useContext, useState } from "react";
import { initialPlans, type Plan } from "@/data/plans";

export type PlanDraft = {
    name: string;
    description: string;
    scales: string[];
};

type PlansContextValue = {
    plans: Plan[];
    completedScaleNames: string[];
    toggleScaleComplete: (scaleName: string) => void;
    restartPlan: (planId: string) => void;
    addPlan: (draft: PlanDraft) => string;
};

const PlansContext = createContext<PlansContextValue | null>(null);

export function PlansProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [plans, setPlans] = useState<Plan[]>(initialPlans);
    const [completedScaleNames, setCompletedScaleNames] = useState<string[]>(
        () =>
            [...new Set(
                initialPlans.flatMap((plan) => plan.completedScales)
            )]
    );


    function toggleScaleComplete(scaleName: string) {
        setCompletedScaleNames((currentScales) => {

            if (currentScales.includes(scaleName)) {
                return currentScales.filter(
                    (completedScale) => completedScale !== scaleName
                );
            }
            return [...currentScales, scaleName];

        });
    }
    function restartPlan(planId: string) {
        const planToRestart = plans.find((plan) => plan.id === planId);
        if (!planToRestart) {
            return;
        }

        setCompletedScaleNames((currentScales) =>
            currentScales.filter(
                (scaleName) =>
                    !planToRestart.scales.includes(scaleName)
            )
        );
    };

    function addPlan(draft: PlanDraft) {
        const newPlan: Plan = {
            id: crypto.randomUUID(),
            name: draft.name,
            description: draft.description,
            scales: draft.scales,
            completedScales: [],
        }

        setPlans((currentPlans) => [...currentPlans, newPlan]);

        return newPlan.id;
    }

    return (
        <PlansContext.Provider
            value={{
                plans,
                completedScaleNames,
                toggleScaleComplete,
                restartPlan,
                addPlan
            }}>
            {children}
        </PlansContext.Provider>
    )
}

export function usePlans() {
    const context = useContext(PlansContext);

    if (!context) {
        throw new Error("usePlans must be used inside PlansProvider");
    }
    return context;
}