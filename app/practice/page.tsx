"use client";
import { useState } from "react";
import styles from "./page.module.css";

import ScaleSelector from "@/components/practice/ScaleSelector";
import KeySignatureInfo from "@/components/practice/KeySignatureInfo";
import Metronome from "@/components/practice/Metronome";
import FingeringDiagram from "@/components/practice/FingeringDiagram";
import CompleteButton from "@/components/practice/CompleteButton";

export default function Practice() {
    const [isDiagramOpen, setIsDiagramOpen] = useState(false);

    return (
        <div>
            <main className={styles.practiceWorkspace}>
                <h1>Practice</h1>
                <h2>Let's start!</h2>
                <div className={styles.practiceTools}>
                    <ScaleSelector />
                    <KeySignatureInfo />
                    <Metronome />

                    <button
                        className={styles.diagramOpenButton}
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
                    className={`${styles.diagramPanel} ${isDiagramOpen ? styles.isOpen : ""}`}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="fingering-diagram-heading"
                >
                    <button
                        className={styles.diagramCloseButton}
                        type="button"
                        value="cancel"
                        aria-label="Close diagram"
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
