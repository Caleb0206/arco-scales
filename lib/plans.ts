export type Plan = {
    id: string;
    userId: string;
    name: string;
    description: string;
    scales: string[];
    createdAt: string;
    updatedAt: string;
};

export type PlanDraft = {
    name: string;
    description: string;
    scales: string[];
};

const plans: Plan[] = [];

export function getPlansForUser(userId: string) {
    return plans.filter((plan) => plan.userId === userId);
}

export function getPlanById(planId: string) {
    return plans.find((plan) => plan.id === planId);
}

export function createPlan(userId: string, draft: PlanDraft) {
    const now = new Date().toISOString();

    const newPlan: Plan = {
        id: crypto.randomUUID(),
        userId,
        name: draft.name,
        description: draft.description,
        scales: draft.scales,
        createdAt: now,
        updatedAt: now,
    }
    plans.push(newPlan);

    return newPlan;
};

// PUT Update


export function updatePlan(
    planId: string,
    userId: string,
    updates: Partial<Pick<Plan, "name" | "description" | "scales">>
) {
    const plan = plans.find(
        (currentPlan) =>
            currentPlan.id === planId &&
        currentPlan.userId === userId
    );

    if (!plan) {
        return null;
    }

    if (updates.name !== undefined) {
        plan.name = updates.name;
    }

    if (updates.description !== undefined) {
        plan.description = updates.description;
    }

    if (updates.scales !== undefined)
    {
        plan.scales = updates.scales;
    }
    plan.updatedAt = new Date().toISOString();
    
    return plan;
}

export function deletePlan(planId: string, userId: string) {
    const planIndex = plans.findIndex(
        (plan) => plan.id === planId && plan.userId === userId
    );

    if (planIndex === -1) {
        return false;
    }

    plans.splice(planIndex, 1);

    return true;
}
