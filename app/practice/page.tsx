"use client";
import { useState } from "react";


import ScaleSelector from "@/components/practice/ScaleSelector";
import KeySignatureInfo from "@/components/practice/KeySignatureInfo";
import Metronome from "@/components/practice/Metronome";
import FingeringDiagram from "@/components/practice/FingeringDiagram";
import CompleteButton from "@/components/practice/CompleteButton";

export default function Practice() {
    const [isDiagramOpen, setIsDiagramOpen] = useState(false);

    return (
        <div>
            <main className="practice-workspace">
                <h1>Practice</h1>
                <h2>Let's start!</h2>
                <div className="practice-tools">
                    <ScaleSelector />
                    <KeySignatureInfo />
                    <Metronome />

                    <button
                        className="diagram-open-button"
                        type="button"
                        aria-expanded={isDiagramOpen}
                        aria-controls="fingering-diagram"
                        onClick={() => setIsDiagramOpen(true)}
                    >
                        View Fingering Diagram
                    </button>
                    <CompleteButton />
                </div>

                <div
                    id="fingering-diagram"
                    className={`diagram-panel ${isDiagramOpen ? "is-open" : ""}`}
                >
                    <button className="diagram-close-button"
                        type="button"
                        value="cancel"
                        aria-label="Close"
                        onClick={() => setIsDiagramOpen(false)}
                    >
                        ✕
                    </button>
                    <FingeringDiagram />
                </div>
            </main>
        </div>
    );
}
