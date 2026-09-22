"use client";

import { useState } from "react";
import Link from "next/link";
import ScaleFilters, {
    type ScaleType,
    type Difficulty,
} from "@/components/scales/ScaleFilters";
import styles from "./page.module.css";


type Scale = {
    name: string;
    type: ScaleType;
    accidentalCount: number;
    lastPracticed: string | null;
}


const scales: Scale[] = [
    { name: "A Major", type: "major", accidentalCount: 3, lastPracticed: "2026-09-20" },
    { name: "B Major", type: "major", accidentalCount: 5, lastPracticed: "2026-09-15" },
    { name: "C Major", type: "major", accidentalCount: 0, lastPracticed: "2026-09-05" },
    { name: "D Major", type: "major", accidentalCount: 2, lastPracticed: null },
    { name: "E Major", type: "major", accidentalCount: 4, lastPracticed: null },
    { name: "F Major", type: "major", accidentalCount: 1, lastPracticed: null },
    { name: "G Major", type: "major", accidentalCount: 1, lastPracticed: null },

    { name: "A Minor", type: "minor", accidentalCount: 0, lastPracticed: null },
    { name: "B Minor", type: "minor", accidentalCount: 2, lastPracticed: null },
    { name: "C Minor", type: "minor", accidentalCount: 3, lastPracticed: null },
    { name: "D Minor", type: "minor", accidentalCount: 1, lastPracticed: "2026-09-21" },
    { name: "E Minor", type: "minor", accidentalCount: 1, lastPracticed: null },
    { name: "F Minor", type: "minor", accidentalCount: 4, lastPracticed: null },
    { name: "G Minor", type: "minor", accidentalCount: 2, lastPracticed: null },
];

export default function Scales() {
    const [selectedTypes, setSelectedTypes] = useState<Record<ScaleType, boolean>>({
        major: true,
        minor: true,
    });
    const [selectedDifficulties, setSelectedDifficulties] =
        useState<Record<Difficulty, boolean>>({
            easy: true,
            hard: true,
        });

    const visibleScales = scales.filter((scale) => {
        const difficulty = getDifficulty(scale.accidentalCount);

        return (
            selectedTypes[scale.type] &&
            selectedDifficulties[difficulty]
        );
    });

    function handleTypeChange(type: ScaleType, checked: boolean) {
        setSelectedTypes((currentTypes) => ({
            ...currentTypes,
            [type]: checked,
        }));
    }

    function handleDifficultyChange(
        difficulty: Difficulty,
        checked: boolean
    ) {
        setSelectedDifficulties((currentDifficulties) => ({
            ...currentDifficulties,
            [difficulty]: checked,
        }));
    }

    function handleSelectAll(checked: boolean) {
        setSelectedTypes({
            major: checked,
            minor: checked,
        });
    }

    function getDaysSince(date: string) {
        const [year, month, day] = date.split("-").map(Number);
        const practicedDay = Date.UTC(year, month - 1, day);
        const today = new Date();
        const todayStart = Date.UTC(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        // return ????
        return Math.floor((todayStart - practicedDay) / 86_400_000);
    }

    function getDifficulty(accidentalCount: number) {
        return accidentalCount <= 2 ? "easy" : "hard";
    }

    function getPracticeStatus(lastPracticed: string | null) {
        if (!lastPracticed) {
            return {
                statusClass: "isOverdue",
                label: "Not practiced yet",
            }
        }
        const daysSince = getDaysSince(lastPracticed);

        if (daysSince <= 5) {
            return {
                statusClass: "isRecent",
                label: `Practiced ${daysSince} days ago`
            };
        }
        if (daysSince <= 9) {
            return {
                statusClass: "isDueSoon",
                label: `Practiced ${daysSince} days ago`
            };
        }

        return {
            statusClass: "isOverdue",
            label: `Practiced ${daysSince} days ago`
        }
    }

    return (
        <div>
            <main>
                <div>
                    <h1>Scale Library</h1>
                    <p>Browse available scales!</p>

                    <ScaleFilters
                        selectedTypes={selectedTypes}
                        selectedDifficulties={selectedDifficulties}
                        onTypeChange={handleTypeChange}
                        onDifficultyChange={handleDifficultyChange}
                        onSelectAll={handleSelectAll}
                    />

                    <ul className={styles.scaleLibraryList}>
                        {visibleScales.map((scale) => {
                            const practiceStatus = getPracticeStatus(scale.lastPracticed);

                            return (
                                <li key={scale.name}>
                                    <Link
                                        className={styles.scaleLibraryRow}
                                        href={`/practice`}
                                    >
                                        <span className={styles.scaleName}>
                                            {scale.name}
                                        </span>

                                        <span
                                            className={`${styles.practiceStatus} 
                                            ${styles[practiceStatus.statusClass]}`}

                                        >
                                            {practiceStatus.label}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </main >
        </div >
    );
}
