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