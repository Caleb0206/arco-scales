"use client";
import { useState } from "react";
import styles from "./page.module.css";

import Link from "next/link";

import { scales } from "@/data/scales";
import ScaleSelector from "@/components/practice/ScaleSelector";
import KeySignatureInfo from "@/components/practice/KeySignatureInfo";
import Metronome from "@/components/practice/Metronome";
import FingeringDiagram from "@/components/practice/FingeringDiagram";
import CompleteButton from "@/components/practice/CompleteButton";
import { useSearchParams } from "next/navigation";
import { usePlans } from "@/context/PlansContext";

export default function Practice() {
    // URL values determine if user arrived from ScaleLibrary or practice plan
    const searchParams = useSearchParams();
    const requestedScaleName = searchParams.get("scale");
    const planId = searchParams.get("plan");

    // Find requested scale if there is one
    const requestedScale = scales.find(
        (scale) => scale.name === requestedScaleName
    );

    // PlansContext shared plan and states
    const {
        plans,
        completedScaleNames,
        toggleScaleComplete
    } = usePlans();

    // Current plan exists only when URL includes a valid plan ID.
    const activePlan = plans.find((plan) => plan.id === planId);

    // In plan mode, begin with first scale that isn't complete.
    // else, use first scale
    const planStartingScaleName =
        activePlan?.scales.find(
            (scaleName) => !completedScaleNames.includes(scaleName)

        ) ??
        activePlan?.scales[0];

    /*
    Decide the initial scale:
    - Plan mode: plan's starting scale
    - Free practice: scale from Scale Library
    - Fallback: first scale in the database
    */
    const startingScaleName = activePlan
        ? planStartingScaleName ?? scales[0].name
        : requestedScale?.name ?? scales[0].name;

    // Local practice-page state: which scale is currently displayed.
    const [selectedScaleName, setSelectedSCaleName] = useState(startingScaleName);

    // Find complete scale data object for current scale name
    const selectedScale = scales.find((scale) => scale.name === selectedScaleName) ?? scales[0];

    // Plan mode limits selector scales. Free practice allows everything
    const availableScales = activePlan
        ? scales.filter((scale) => activePlan.scales.includes(scale.name))
        : scales;

    // Local UI state for the mobile fingering-diagram overlay
    const [isDiagramOpen, setIsDiagramOpen] = useState(false);

    // Derived plan progress values for header and progress display
    const totalScales = activePlan?.scales.length ?? 0;

    const completedCount = activePlan
        ? activePlan.scales.filter((scaleName) =>
            completedScaleNames.includes(scaleName)
        ).length
        : 0;

    // Whether currently displayed scale is marked complete
    const isCurrentScaleComplete = completedScaleNames.includes(selectedScale.name);

    // Mark or unmark the selected scale
    function handleComplete() {
        toggleScaleComplete(selectedScale.name);
    }

    return (
        <div>
            <main className={styles.practiceWorkspace}>
                <header className={styles.practiceHeader}>
                    <div className={styles.practiceHeaderText}>
                        <h1>Practice</h1>

                        <p className={styles.planContext}>
                            {activePlan
                                ? `Plan: ${activePlan.name} ${completedCount} of ${totalScales} completed`
                                : "Free practice - choose any available scale"}
                        </p>
                    </div>


                    <button
                        className={styles.diagramOpenButton}
                        type="button"
                        aria-expanded={isDiagramOpen}
                        aria-controls="fingering-diagram"
                        onClick={() => setIsDiagramOpen(true)}
                    >
                        View Fingering Diagram
                    </button>
                </header>

                <div className={styles.practiceTools}>
                    <ScaleSelector
                        scales={availableScales}
                        selectedScaleName={selectedScaleName}
                        onScaleChange={setSelectedSCaleName}
                    />
                    <KeySignatureInfo scale={selectedScale} />

                    <div className={styles.metronomeCompleteRow}>
                        <Metronome />

                        <div className={styles.mobileCompleteButton}>
                            <CompleteButton
                                isComplete={isCurrentScaleComplete}
                                onComplete={handleComplete}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.practiceRightPanel}>
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

                    <div className={styles.desktopCompleteButton}>
                        <CompleteButton
                            isComplete={isCurrentScaleComplete}
                            onComplete={handleComplete}
                        />
                    </div>

                </div>

            </main>
        </div>
    );
}
