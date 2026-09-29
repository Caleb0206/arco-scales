export type Plan = {
    id: string;
    name: string;
    description: string;
    scales: string[];
    completedScales: string[];
};

export const initialPlans: Plan[] = [
    {
        id: "major-foundations",
        name: "Major Foundations",
        description: "Practice a set of common major scales at a comfortable tempo.",
        scales: ["A Major", "D Major", "G Major"],
        completedScales: ["A Major"],
    },
    {
        id: "minor-focus",
        name: "Minor Focus",
        description: "Practice a set of common minor scales with focus on fingerings.",
        scales: ["A Minor", "D Minor", "E Minor"],
        completedScales: [],
    },
    {
        id: "challenge-plan",
        name: "Challenge Plan",
        description: "Practice less recent scales.",
        scales: ["B Major", "F Major", "C Minor"],
        completedScales: ["B Major"],
    },
];