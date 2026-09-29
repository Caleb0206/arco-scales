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
    completeScale: (planId: string, scaleName: string) => void;
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

    function completeScale(planId: string, scaleName: string) {
        setPlans((currentPlans) =>
            currentPlans.map((plan) => {
                if (plan.id !== planId) {
                    return plan;
                }

                if (plan.completedScales.includes(scaleName)) {
                    return plan;
                }

                return {
                    ...plan,
                    completedScales: [...plan.completedScales, scaleName],
                };
            }));
    }
    function restartPlan(planId: string) {
        setPlans((currentPlans) =>
            currentPlans.map((plan) =>
                plan.id === planId
                    ? { ...plan, completedScales: [] }
                    : plan
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
        <PlansContext.Provider value={{ plans, completeScale, restartPlan, addPlan }}>
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