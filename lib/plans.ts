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

const plans: Plan[] = [];

// gets the paln for user with userId
export function getPlansForUser(userId: string) {
    return plans.filter((plan) => plan.userId === userId);
}

// get the plan from the plan's id
export function getPlanById(planId: string) {
    return plans.find((plan) => plan.id === planId);
}

// POST Create plan
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
        currentRunStartedAt: null,
    }
    plans.push(newPlan);

    return newPlan;
};

// PATCH Update plan
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

    if (updates.scales !== undefined) {
        plan.scales = updates.scales;
    }
    plan.updatedAt = new Date().toISOString();

    return plan;
}

// Start/Restart a Plan
export function startPlanRun(
    planId: string,
    userId: string,
) {
    const plan = plans.find(
        (currentPlan) =>
            currentPlan.id === planId &&
            currentPlan.userId === userId
    );

    if (!plan) {
        return null;
    }

    const now = new Date().toISOString();

    plan.currentRunStartedAt = now;
    plan.updatedAt = now;

    return plan;
}

// DELETE plan
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
