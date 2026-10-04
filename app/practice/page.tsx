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
    const searchParams = useSearchParams();

    const { plans, completedScaleNames, toggleScaleComplete } = usePlans();
    const planId = searchParams.get("plan");
    const activePlan = plans.find((plan) => plan.id === planId);

    const startingScaleName =
        activePlan?.scales.find(
            (scaleName) => !completedScaleNames.includes(scaleName)
        ) ??
        activePlan?.scales[0] ??
        scales[0].name;

    const [selectedScaleName, setSelectedSCaleName] = useState(startingScaleName);

    const selectedScale = scales.find((scale) => scale.name === selectedScaleName) ?? scales[0];

    // Available scales : in the current plan or just every scale available
    const availableScales = activePlan
        ? scales.filter((scale) => activePlan.scales.includes(scale.name))
        : scales;

    const [isDiagramOpen, setIsDiagramOpen] = useState(false);

    const totalScales = activePlan?.scales.length ?? 0;

    const isCurrentScaleComplete = completedScaleNames.includes(selectedScale.name);

    const completedCount = activePlan
        ? activePlan.scales.filter((scaleName) =>
            completedScaleNames.includes(scaleName)
        ).length
        : 0;


    function handleComplete() {
        toggleScaleComplete(selectedScale.name);
    }

    return (
        <div>
            <main className={styles.practiceWorkspace}>
                <div className={styles.practiceHeader}>
                    <h1>Practice</h1>
                    {activePlan && <Link href="/scales">Leave plan, browse all scales</Link>}
                    <p className={styles.planContext}>
                        {activePlan
                            ? `Plan: ${activePlan.name} ${completedCount} of ${totalScales} completed`
                            : "Free practice - choose any available scale"}
                    </p>
                    <button
                        className={styles.diagramOpenButton}
                        type="button"
                        aria-expanded={isDiagramOpen}
                        aria-controls="fingering-diagram"
                        onClick={() => setIsDiagramOpen(true)}
                    >
                        View Fingering Diagram
                    </button>
                </div>

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
