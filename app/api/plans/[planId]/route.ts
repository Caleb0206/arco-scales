import { getCurrentUser } from "@/lib/session";
import {
    deletePlan,
    getPlanById,
    updatePlan,
} from "@/lib/plans";

type RouteContext = {
    params: Promise<{
        planId: string;
    }>;
};


export async function GET(
    _request: Request,
    { params }: RouteContext
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return Response.json(
            { error: "Please sign in." },
            { status: 401 }
        );
    }
    const { planId } = await params;
    const plan = getPlanById(planId);

    if (!plan || plan.userId !== currentUser.userId) {
        return Response.json(
            { error: "Plan not found." },
            { status: 404 }
        );
    }

    return Response.json(plan);
}

export async function PATCH(
    request: Request,
    { params }: RouteContext
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return Response.json(
            { error: "Please sign in." },
            { status: 401 }
        );
    }

    const body = await request.json();

    const name =
        typeof body.name === "string"
            ? body.name.trim()
            : undefined;

    const description =
        typeof body.description === "string"
            ? body.description.trim()
            : undefined;
    const scales = Array.isArray(body.scales)
        ? body.scales
        : undefined;

    const hasInvalidScales =
        scales !== undefined &&
        !scales.every((scale: unknown) => typeof scale === "string");

    if (hasInvalidScales) {
        return Response.json(
            { error: "scales must be an array of scale names." },
            { status: 400 }
        )
    }

    if (name === "") {
        return Response.json(
            { error: "Plan name cannot be empty." },
            { status: 400 }
        )
    }

    if (scales?.length === 0) {
        return Response.json(
            { error: "A plan needs at least one scale." },
            { status: 400 }
        )
    }

    if (
        typeof name === undefined &&
        typeof description === undefined &&
        scales === undefined) {
        return Response.json(
            { error: "Provide a name, description, or scales to update." },
            { status: 400 }
        );
    }

    const { planId } = await params;
    const updatedPlan = updatePlan(planId, currentUser.userId, {
        name,
        description,
        scales,
    });

    if (!updatedPlan) {
        return Response.json(
            {
                error: "Plan not found."
            },
            { status: 404 }
        )
    }

    return Response.json(updatedPlan);
}

// DELETE 
export async function DELETE(
    _request: Request,
    { params }: RouteContext
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return Response.json(
            { error: "Please sign in." },
            { status: 401 }
        );
    }

    const { planId } = await params;


    const deletedPlan = deletePlan(planId, currentUser.userId);

    if (!deletedPlan) {
        return Response.json(
            { error: "Plan not found." },
            { status: 404 }
        );
    }

    return new Response(null, { status: 204 });
}