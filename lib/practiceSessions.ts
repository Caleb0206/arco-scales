import { supabase } from "@/lib/supabase";

export type PracticeSession = {
    id: string;
    userId: string;
    scaleName: string;
    octaves: number;
    tempoBpm: number;
    success: boolean;
    practicedAt: string;
}

export type CreatePracticeSessionInput = {
    scaleName: string;
    octaves: 1 | 2 | 3;
    tempoBpm: number;
    success: boolean;
}

export type UpdatePracticeSessionInput = {
    tempoBpm: number;
    octaves: 1 | 2 | 3;
    success: boolean;
};

type PracticeSessionRow = {
    id: string;
    user_id: string;
    scale_name: string;
    octaves: number;
    tempo_bpm: number;
    success: boolean;
    practiced_at: string;
};

/* Convert database names to camelCase Plan shape */
function toPracticeSession(row: PracticeSessionRow): PracticeSession {

    return {
        id: row.id,
        userId: row.user_id,
        scaleName: row.scale_name,
        octaves: row.octaves,
        tempoBpm: row.tempo_bpm,
        success: row.success,
        practicedAt: row.practiced_at
    };
}

export async function getPracticeSessions(userId: string) {
    const { data, error } = await supabase
        .from("practice_session")
        .select("*")
        .eq("user_id", userId)
        .order("practiced_at", { ascending: false });

    if (error) {
        throw new Error(`Could not load practice sessions: ${error.message}`);
    }

    return (data as PracticeSessionRow[]).map(toPracticeSession);

}

// GET one practice session: 
export async function getPracticeSession(sessionId: string, userId: string) {
    const { data, error } = await supabase
        .from("practice_session")
        .select("*")
        .eq("id", sessionId)
        .eq("user_id", userId)
        .maybeSingle();

    if (error) {
        throw new Error(`Could not load practice session: ${error.message}`);
    }

    return data
        ? toPracticeSession(data as PracticeSessionRow)
        : null;
}

// POST: supabase create practice session, generates an id and practiced_at
export async function createPracticeSession(
    userId: string,
    input: CreatePracticeSessionInput
) {
    const { data, error } = await supabase
        .from("practice_session")
        .insert({
            user_id: userId,
            scale_name: input.scaleName,
            octaves: input.octaves,
            tempo_bpm: input.tempoBpm,
            success: input.success,
        })
        .select("*")
        .single();

    if (error) {
        throw new Error(`Could not create practice session: ${error.message}`);
    }

    return toPracticeSession(data as PracticeSessionRow);
};

// PUT: Update only this user's matching data
export async function updatePracticeSession(
    sessionId: string,
    userId: string,
    input: UpdatePracticeSessionInput
) {
    const { data, error } = await supabase
        .from("practice_session")
        .update({
            tempo_bpm: input.tempoBpm,
            octaves: input.octaves,
            success: input.success,
            // re-mark a scale's records to a new practice time
            ...(input.success
                ? { practiced_at: new Date().toISOString() }
                : {}),
            
        })
        .eq("id", sessionId)
        .eq("user_id", userId)
        .select("*")
        .maybeSingle();

    if (error) {
        throw new Error(`Could not update practice session: ${error.message}`);
    }

    return data
        ? toPracticeSession(data as PracticeSessionRow)
        : null;
}

// DELETE: return the deleted session, null if didn't belong to the user
export async function deletePracticeSession(
    sessionId: string,
    userId: string,
) {
    const { data, error } = await supabase
        .from("practice_session")
        .delete()
        .eq("id", sessionId)
        .eq("user_id", userId)
        .select("*")
        .maybeSingle();

    if (error) {
        throw new Error(`Could not delete practice session: ${error.message}`);
    }

    return data
        ? toPracticeSession(data as PracticeSessionRow)
        : null;
}
