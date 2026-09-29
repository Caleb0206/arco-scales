
export type ScaleType = "major" | "minor";
export type NumAccidentals = "upTo2" | "threeOrMore";

export type Scale = {
    name: string;
    type: ScaleType;
    accidentalCount: number;
    lastPracticed: string | null;
    notes: string[];
    keySignatureImage: string;
};

export const scales: Scale[] = [
    {
        name: "A Major",
        type: "major",
        accidentalCount: 3,
        lastPracticed: "2026-09-20",
        keySignatureImage: "/key-signatures/a-major.png",
        notes: ["A", "B", "C♯", "D", "E", "F♯", "G♯"],
    },
    {
        name: "B Major",
        type: "major",
        accidentalCount: 5,
        lastPracticed: "2026-09-15",
        keySignatureImage: "/key-signatures/b-major.png",
        notes: ["B", "C♯", "D♯", "E", "F♯", "G♯", "A♯"],
    },
    {
        name: "C Major",
        type: "major",
        accidentalCount: 0,
        lastPracticed: "2026-09-05",
        keySignatureImage: "/key-signatures/c-major.png",
        notes: ["C", "D", "E", "F", "G", "A", "B"],
    },
    {
        name: "D Major",
        type: "major",
        accidentalCount: 2,
        lastPracticed: null,
        keySignatureImage: "/key-signatures/d-major.png",
        notes: ["D", "E", "F♯", "G", "A", "B", "C♯"],
    },
    {
        name: "E Major",
        type: "major",
        accidentalCount: 4,
        lastPracticed: null,
        keySignatureImage: "/key-signatures/e-major.png",
        notes: ["E", "F♯", "G♯", "A", "B", "C♯", "D♯"],
    },
    {
        name: "F Major",
        type: "major",
        accidentalCount: 1,
        lastPracticed: null,
        keySignatureImage: "/key-signatures/f-major.png",
        notes: ["F", "G", "A", "B♭", "C", "D", "E"],
    },
    {
        name: "G Major",
        type: "major",
        accidentalCount: 1,
        lastPracticed: null,
        keySignatureImage: "/key-signatures/g-major.png",
        notes: ["G", "A", "B", "C", "D", "E", "F♯"],
    },

    {
        name: "A Minor",
        type: "minor",
        accidentalCount: 0,
        lastPracticed: null,
        keySignatureImage: "/key-signatures/c-major.png",
        notes: ["A", "B", "C", "D", "E", "F", "G"],
    },
    {
        name: "B Minor",
        type: "minor",
        accidentalCount: 2,
        lastPracticed: null,
        keySignatureImage: "/key-signatures/d-major.png",
        notes: ["B", "C♯", "D", "E", "F♯", "G", "A"],
    },
    {
        name: "C Minor",
        type: "minor",
        accidentalCount: 3,
        lastPracticed: null,
        keySignatureImage: "/key-signatures/c-minor.png",
        notes: ["C", "D", "E♭", "F", "G", "A♭", "B♭"],
    },
    {
        name: "D Minor",
        type: "minor",
        accidentalCount: 1,
        lastPracticed: "2026-09-21",
        keySignatureImage: "/key-signatures/f-major.png",
        notes: ["D", "E", "F", "G", "A", "B♭", "C"],
    },
    {
        name: "E Minor",
        type: "minor",
        accidentalCount: 1,
        lastPracticed: null,
        keySignatureImage: "/key-signatures/g-major.png",
        notes: ["E", "F♯", "G", "A", "B", "C", "D"],
    },
    {
        name: "F Minor",
        type: "minor",
        accidentalCount: 4,
        lastPracticed: null,
        keySignatureImage: "/key-signatures/f-minor.png",
        notes: ["F", "G", "A♭", "B♭", "C", "D♭", "E♭"],
    },
    {
        name: "G Minor",
        type: "minor",
        accidentalCount: 2,
        lastPracticed: null,
        keySignatureImage: "/key-signatures/g-minor.png",
        notes: ["G", "A", "B♭", "C", "D", "E♭", "F"],
    },
];
