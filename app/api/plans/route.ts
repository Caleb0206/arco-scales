import { getCurrentUser } from "@/lib/session";
import {
    createPlan,
    getPlansForUser,
    Plan,
    type PlanDraft,
} from "@/lib/plans";

export async function GET() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return Response.json(
            { error: "Please sign in." },
            { status: 401 }
        );
    }

    const plans = getPlansForUser(currentUser.userId);
    return Response.json(plans);
}

export async function POST(request: Request) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return Response.json(
            { error: "Please sign in." },
            { status: 401 }
        );
    }

    const body = await request.json();

    const name = body.name;
    const description = body.description;
    const scales = body.scales;

    if (
        typeof name !== "string" ||
        typeof description !== "string" ||
        !Array.isArray(scales) ||
        !scales.every((scale) => typeof scale === "string")
    ) {
        return Response.json(
            { error: "Invalid plans data. name, description, and scales are required." },
            { status: 400 }
        );
    }

    const draft: PlanDraft = {
        name: name.trim(),
        description: description.trim(),
        scales,
    }

    if (!draft.name || draft.scales.length === 0) {
        return Response.json(
            {
                error: "A plan needs a name and at least one scale."
            },
            { status: 400 }
        )
    }
    const newPlan = createPlan(currentUser.userId, draft);

    return Response.json(newPlan, { status: 201 });
}