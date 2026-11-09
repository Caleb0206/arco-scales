
export type Plan = {
    id: string;
    userId: string;
    name: string;
    description: string;
    scales: string[];
    createdAt: string;
    updatedAt: string;
    currentRunStartedAt: string | null;
};

export type PlanDraft = {
    name: string;
    description: string;
    scales: string[];
};
