"use client";
import { useState } from "react";
import styles from "./page.module.css";

import { scales } from "@/data/scales";
import ScaleSelector from "@/components/practice/ScaleSelector";
import KeySignatureInfo from "@/components/practice/KeySignatureInfo";
import Metronome from "@/components/practice/Metronome";
import FingeringDiagram from "@/components/practice/FingeringDiagram";
import CompleteButton from "@/components/practice/CompleteButton";
import { useSearchParams } from "next/navigation";
import { usePlans } from "@/context/PlansContext";

export default function Practice() {
    const [selectedScaleName, setSelectedSCaleName] = useState(scales[0].name);
    const selectedScale = scales.find((scale) => scale.name === selectedScaleName) ?? scales[0];
    const [isDiagramOpen, setIsDiagramOpen] = useState(false);

    // const [completeScaleNames, setCompleteScaleNames] = useState<string[]>([]);

    // const isCurrentScaleComplete = completeScaleNames.includes(
    //     selectedScale.name
    // );

    // function handleComplete() {
    //     setCompleteScaleNames((currentScales) => {
    //         if (currentScales.includes(selectedScale.name)) {
    //             return currentScales;
    //         }
    //         return [...currentScales, selectedScale.name];
    //     });
    // }
    const searchParams = useSearchParams();
    const { plans, completeScale } = usePlans();
    const planId = searchParams.get("plan");
    const activePlan = plans.find((plan) => plan.id === planId);
    const totalScales = activePlan?.scales.length ?? 0;

    const isCurrentScaleInPlan =
        activePlan?.scales.includes(selectedScale.name) ?? false;

    const isCurrentScaleComplete =
        activePlan?.completedScales.includes(selectedScale.name) ?? false;

    const completedCount = activePlan
        ? activePlan.scales.filter((scaleName) =>
            activePlan.completedScales.includes(scaleName)
        ).length
        : 0;


    function handleComplete() {
        if (!activePlan || !isCurrentScaleInPlan) {
            return;
        }

        completeScale(activePlan.id, selectedScale.name);
    }

    return (
        <div>
            <main className={styles.practiceWorkspace}>
                <div className={styles.practiceHeader}>
                    <h1>Practice</h1>
                    <p className={styles.planContext}>
                        {activePlan
                            ? `Plan: ${activePlan.name} ${completedCount} of ${totalScales}`
                            : "Free practice"}
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
                        selectedScaleName={selectedScaleName}
                        onScaleChange={setSelectedSCaleName}
                    />
                    <KeySignatureInfo scale={selectedScale} />

                    <div className={styles.metronomeCompleteRow}>
                        <Metronome />

                        <div className={styles.mobileCompleteButton}>
                            <CompleteButton
                                isComplete={isCurrentScaleComplete}
                                canComplete={isCurrentScaleInPlan}
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
                            canComplete={isCurrentScaleInPlan}
                            onComplete={handleComplete}
                        />
                    </div>

                </div>

            </main>
        </div>
    );
}
