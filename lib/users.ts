import { supabase } from "@/lib/supabase";

type FindOrCreateUserInput = {
    authUserId: string;
    email: string;
};

export async function findOrCreateUser({
    authUserId,
    email,
}: FindOrCreateUserInput) {
    const { data, error } = await supabase
        .from("users")
        .upsert(
            {
                auth_user_id: authUserId,
                email,
            },
            {
                onConflict: "auth_user_id",
            }
        )
        .select("id, auth_user_id, email, created_at")
        .single();

    if (error) {
        throw new Error(
            `Could not create or find user: ${error.message}`
        );
    }

    return data;
}