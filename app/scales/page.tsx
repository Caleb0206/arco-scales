"use client";

import { useState } from "react";
import Link from "next/link";
import ScaleFilters, {
    type ScaleType,
} from "@/components/scales/ScaleFilters";


type Scale = {
    name: string;
    type: ScaleType;
    lastPracticed: string | null;
}


const scales: Scale[] = [
    { name: "A Major", type: "major", lastPracticed: "2026-09-20" },
    { name: "B Major", type: "major", lastPracticed: "2026-09-15" },
    { name: "C Major", type: "major", lastPracticed: "2026-09-05" },
    { name: "D Major", type: "major", lastPracticed: null },
    { name: "E Major", type: "major", lastPracticed: null },
    { name: "F Major", type: "major", lastPracticed: null },
    { name: "G Major", type: "major", lastPracticed: null },
    { name: "A Minor", type: "minor", lastPracticed: null },
    { name: "B Minor", type: "minor", lastPracticed: null },
    { name: "C Minor", type: "minor", lastPracticed: null },
    { name: "D Minor", type: "minor", lastPracticed: "2026-09-21" },
    { name: "E Minor", type: "minor", lastPracticed: null },
    { name: "F Minor", type: "minor", lastPracticed: null },
    { name: "G Minor", type: "minor", lastPracticed: null },
]

export default function Scales() {
    const [selectedTypes, setSelectedTypes] = useState<Record<ScaleType, boolean>>({
        major: true,
        minor: true,
    });

    const visibleScales = scales.filter((scale) => selectedTypes[scale.type]);

    function handleTypeChange(type: ScaleType, checked: boolean) {
        setSelectedTypes((currentTypes) => ({
            ...currentTypes,
            [type]: checked,
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

    function getPracticeStatus(lastPracticed: string | null) {
        if (!lastPracticed) {
            return {
                className: "is-overdue",
                label: "Not practiced yet",
            }
        }
        const daysSince = getDaysSince(lastPracticed);

        if (daysSince <= 5) {
            return {
                className: "is-recent",
                label: `Practiced ${daysSince} days ago`
            };
        }
        if (daysSince <= 9) {
            return {
                className: "is-due-soon",
                label: `Practiced ${daysSince} days ago`
            };
        }

        return {
            className: "is-overdue",
            label: `Practiced ${daysSince} days ago`
        }
    }

    return (
        <div className="background">
            <main>
                <div>
                    <h1>Scale Library</h1>
                    <p>Browse available scales!</p>

                    <ScaleFilters
                        selectedTypes={selectedTypes}
                        onTypeChange={handleTypeChange}
                        onSelectAll={handleSelectAll}
                    />

                    <ul className="scale-library-list">
                        {visibleScales.map((scale) => {
                            const practiceStatus = getPracticeStatus(scale.lastPracticed);

                            return (
                                <li key={scale.name}>
                                    <Link
                                        className="scale-library-row"
                                        href={`/practice`}
                                    >
                                        <span className="scale-name">{scale.name}</span>

                                        <span
                                            className={`practice-status ${practiceStatus.className}`
                                            }
                                        >
                                            {practiceStatus.label}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </main>
        </div>
    );
}
