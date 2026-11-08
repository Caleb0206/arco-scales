"use client";

import { useState } from "react";
import Link from "next/link";
import ScaleFilters, {
    type ScaleType,
    type NumAccidentals,
} from "@/components/scales/ScaleFilters";
import { scales } from "@/data/scales";
import { usePracticeSessions } from "@/hooks/usePracticeSessions";
import styles from "./page.module.css";



export default function Scales() {
    const {lastPracticedByScale} = usePlans();

    const [selectedTypes, setSelectedTypes] = useState<Record<ScaleType, boolean>>({
        major: true,
        minor: true,
    });
    const [selectedAccidentals, setSelectedAccidentals] =
        useState<Record<NumAccidentals, boolean>>({
            upTo2: true,
            threeOrMore: true,
        });

    const visibleScales = scales.filter((scale) => {
        const difficulty = getDifficulty(scale.accidentalCount);

        return (
            selectedTypes[scale.type] &&
            selectedAccidentals[difficulty]
        );
    });

    function handleTypeChange(type: ScaleType, checked: boolean) {
        setSelectedTypes((currentTypes) => ({
            ...currentTypes,
            [type]: checked,
        }));
    }

    function handleAccidentalChange(
        accidentals: NumAccidentals,
        checked: boolean
    ) {
        setSelectedAccidentals((currentAccidentals) => ({
            ...currentAccidentals,
            [accidentals]: checked,
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

        return Math.floor((todayStart - practicedDay) / 86_400_000);
    }

    function getDifficulty(accidentalCount: number): NumAccidentals {
        return accidentalCount <= 2 ? "upTo2" : "threeOrMore";
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
                        selectedAccidentals={selectedAccidentals}
                        onTypeChange={handleTypeChange}
                        onAccidentalChange={handleAccidentalChange}
                        onSelectAll={handleSelectAll}
                    />

                    <ul className={styles.scaleLibraryList}>
                        {visibleScales.map((scale) => {
                            const lastPracticed = lastPracticedByScale[scale.name] ?? scale.lastPracticed;

                            const practiceStatus = getPracticeStatus(lastPracticed);

                            return (
                                <li key={scale.name}>
                                    <Link
                                        className={styles.scaleLibraryRow}
                                        href={`/practice?scale=${encodeURIComponent(scale.name)}`}
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
