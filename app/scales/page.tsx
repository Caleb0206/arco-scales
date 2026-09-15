"use client";

import { useState } from "react";

type ScaleType = "major" | "minor";

type Scale = {
    name: String;
    type: ScaleType;
    hasPracticed: boolean;
}


const scales: Scale[] = [
    { name: "A Major", type: "major", hasPracticed: true },
    { name: "B Major", type: "major", hasPracticed: false },
    { name: "C Major", type: "major", hasPracticed: false },
    { name: "D Major", type: "major", hasPracticed: false },
    { name: "E Major", type: "major", hasPracticed: false },
    { name: "F Major", type: "major", hasPracticed: false },
    { name: "G Major", type: "major", hasPracticed: false },
    { name: "A Minor", type: "minor", hasPracticed: false },
    { name: "B Minor", type: "minor", hasPracticed: false },
    { name: "C Minor", type: "minor", hasPracticed: false },
    { name: "D Minor", type: "minor", hasPracticed: true },
    { name: "E Minor", type: "minor", hasPracticed: false },
    { name: "F Minor", type: "minor", hasPracticed: false },
    { name: "G Minor", type: "minor", hasPracticed: false },
]

export default function Scales() {
    const [scaleFilter, setScaleFilter] = useState<"all" | ScaleType>("all");

    const visibleScales =
        scaleFilter === "all" ? scales : scales.filter((scale) => scale.type === scaleFilter);

    return (
        <div className="background">
            <main>
                <div>
                    <h1>Scale Library</h1>
                    <p>Browse available scales!</p>

                    <div className="library-toolbar">
                        <label className="scale-filter" htmlFor="scale-type">
                            Scale Type

                            <select
                                id="scale-type"
                                value={scaleFilter}
                                onChange={(event) => setScaleFilter(event.target.value as "all" | ScaleType)}>
                                <option value="all">All</option>
                                <option value="major">Major</option>
                                <option value="minor">Minor</option>
                            </select>
                        </label>
                    </div>

                    <ul className="scale-library-list">
                        {visibleScales.map((scale) => (
                            <li className="scale-library-row" key={scale.name}>
                                <span className="scale-name">{scale.name}</span>

                                <span
                                    className={
                                        scale.hasPracticed ? "practice-status is-practiced" : "practice-status"
                                    }
                                >
                                    {scale.hasPracticed ? "Practiced" : "Not practiced"}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}
