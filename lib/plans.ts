import { supabase } from "@/lib/supabase";

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

type PlanRow = {
    id: string;
    user_id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    current_run_started_at: string | null;
}

type PlanScaleRow = {
    plan_id: string;
    scale_id: string;
    sort_order: number;
}

/* Convert database names to camelCase Plan shape */
function toPlan(
    row: PlanRow,
    planScaleRows: PlanScaleRow[]
): Plan {
    const scales = planScaleRows
        .filter((planScale) => planScale.plan_id === row.id)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((planScale) => planScale.scale_id);
    return {
        id: row.id,
        userId: row.user_id,
        name: row.name,
        description: row.description,
        scales,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        currentRunStartedAt: row.current_run_started_at,
    };
}

/* get plan's scales from frontend */
async function getPlanScales(planIds: string[]) {
    if (planIds.length === 0) {
        return [];
    }

    const { data, error } = await supabase
        .from("plan_scales")
        .select("plan_id, scale_id, sort_order")
        .in("plan_id", planIds);
    if (error) {
        throw new Error(`Could not load plan scales: ${error.message}`);
    }

    return data as PlanScaleRow[];
}

// GET /api/plans (for user with userId)
export async function getPlansForUser(userId: string) {
    const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("user_id", userId)
        .order("created_at");
    if (error) {
        throw new Error(`Could not load plans: ${error.message}`);
    }

    const planRows = data as PlanRow[];

    const planScaleRows = await getPlanScales(
        planRows.map((plan) => plan.id)
    );

    return planRows.map((plan) => toPlan(plan, planScaleRows));
}

// GET /api/plans/:planId get the plan from the plan's id
export async function getPlanById(
    planId: string,
    userId: string
) {
    const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("id", planId)
        .eq("user_id", userId)
        .maybeSingle();

    if (error) {
        throw new Error(`Could not load plan: ${error.message}`);
    }

    if (!data) {
        return null;
    }

    const planRow = data as PlanRow;
    const planScaleRows = await getPlanScales([planId]);


    return toPlan(planRow, planScaleRows);
}

// POST /api/plans Create plan
export async function createPlan(
    userId: string,
    draft: PlanDraft
) {
    const now = new Date().toISOString();

    const { data, error } = await supabase
        .from("plans")
        .insert({
            user_id: userId,
            name: draft.name,
            description: draft.description,
        })
        .select("*")
        .single();

    if (error) {
        throw new Error(`Could not create plan: ${error.message}`);
    }


    const planRow = data as PlanRow;

    const { error: scalesError } = await supabase
        .from("plan_scales")
        .insert(
            draft.scales.map((scaleName, index) => ({
                plan_id: planRow.id,
                scale_id: scaleName,
                sort_order: index,
                target_tempo_bpm: null,
            }))
        );
    if (scalesError) {
        throw new Error(`Could not add scales to plan: ${scalesError.message}`);
    }

    const createdPlan = await getPlanById(planRow.id, userId);

    if (!createdPlan) {
        throw new Error("Plan was created but could not be loaded.");
    }

    return createdPlan;
};

// PATCH /api/plans/:planId Update plan
export async function updatePlan(
    planId: string,
    userId: string,
    updates: Partial<Pick<Plan, "name" | "description" | "scales">>
) {
    const planUpdates: {
        name?: string;
        description?: string;
        updated_at: string;
    } = {
        updated_at: new Date().toISOString(),
    };

    if (updates.name !== undefined) {
        planUpdates.name = updates.name;
    }
    if (updates.description !== undefined) {
        planUpdates.description = updates.description;
    }

    const { data, error } = await supabase
        .from("plans")
        .update(planUpdates)
        .eq("id", planId)
        .eq("user_id", userId)
        .select("*")
        .maybeSingle();

    if (error) {
        throw new Error(`Could not update plan: ${error.message}`);
    }

    if (!data) {
        return null;
    }
    // Only replace plan_scales when the PATCH request included scales.
    if (updates.scales !== undefined) {
        const { error: deleteError } = await supabase
            .from("plan_scales")
            .delete()
            .eq("plan_id", planId);

        if (deleteError) {
            throw new Error(`Could not remove old plan scales: ${deleteError.message}`);
        }


        const { error: insertError } = await supabase
            .from("plan_scales")
            .insert(
                updates.scales.map((scaleName, index) => ({
                    plan_id: planId,
                    scale_id: scaleName,
                    sort_order: index,
                    target_tempo_bpm: null,
                }))
            );

        if (insertError) {
            throw new Error(
                `Could not update plan scales: ${insertError.message}`
            );
        }
    }

    return getPlanById(planId, userId);
}

// PATCH /api/plans/:planId {"action": "start" | "restart" } 
// Start/Restart a Plan
export async function startPlanRun(
    planId: string,
    userId: string,
) {
    const now = new Date().toISOString();

    const { data, error } = await supabase
        .from("plans")
        .update({
            current_run_started_at: now,
            updated_at: now,
        })
        .eq("id", planId)
        .eq("user_id", userId)
        .select("id")
        .maybeSingle();

    if (error) {
        throw new Error(`Could not start plan run: ${error.message}`);
    }
    if (!data) {
        return null;
    }

    return getPlanById(planId, userId);
}

// DELETE /api/plans/:planId
export async function deletePlan(
    planId: string, 
    userId: string
) {
    const { data, error } = await supabase
        .from("plans")
        .delete()
        .eq("id", planId)
        .eq("user_id", userId)
        .select("id")
        .maybeSingle();
    if (error) {
        throw new Error(`Could not delete plan: ${error.message}`);
    }
    
    // removes matching plan_scales automatically because ON DELETE CASCADE
    return data !== null;
}
