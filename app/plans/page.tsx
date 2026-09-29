"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { CreatePlanModal } from "@/components/plans/CreatePlanModal";
import Link from "next/link";

type Plan = {
    id: string;
    name: string;
    description: string;
    scales: string[];
    completedScales: string[];
};

type PlanDraft = {
    name: string;
    description: string;
    scales: string[];
};

const initialPlans: Plan[] = [
    {
        id: "major-foundations",
        name: "Major Foundations",
        description: "Practice a set of common major scales at a comfortable tempo.",
        scales: ["A Major", "D Major", "G Major"],
        completedScales: ["A Major"],
    },
    {
        id: "minor-focus",
        name: "Minor Focus",
        description: "Practice a set of common minor scales with focus on fingerings.",
        scales: ["A Minor", "D Minor", "E Minor"],
        completedScales: [],
    },
    {
        id: "challenge-plan",
        name: "Challenge Plan",
        description: "Practice less recent scales.",
        scales: ["B Major", "F Major", "C Minor"],
        completedScales: ["B Major"],
    },
];


export default function Plans() {
    const [plans, setPlans] = useState<Plan[]>(initialPlans);
    const [selectedPlanId, setSelectedPlanId] = useState(initialPlans[0].id);


    const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? plans[0];
    const completedScales = selectedPlan.completedScales;


    const completedCount = selectedPlan.scales.filter((scale) =>
        completedScales.includes(scale)
    ).length;

    const totalScales = selectedPlan.scales.length;

    const progressPercent =
        totalScales === 0
            ? 0
            : Math.round((completedCount / totalScales) * 100);

    function handleRestartPlan() {
        setPlans((currentPlans) =>
            currentPlans.map((plan) =>
                plan.id === selectedPlan.id
                    ? { ...plan, completedScales: [] }
                    : plan
            )
        );
    };

    function handleCreatePlan(draft: PlanDraft) {
        const newPlan: Plan = {
            id: crypto.randomUUID(),
            name: draft.name,
            description: draft.description,
            scales: draft.scales,
            completedScales: [],
        }

        setPlans((currentPlans) => [...currentPlans, newPlan]);
        setSelectedPlanId(newPlan.id);
        setShowCreatePlanModal(false);
    }

    const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);

    return (
        <div>
            <main>
                <header className={styles.planHeader}>
                    <h1>
                        Plans
                    </h1>
                    <button
                        className={styles.createPlanButton}
                        type="button"
                        onClick={() => setShowCreatePlanModal(true)}
                    >
                        Create new plan
                    </button>
                </header>


                <div className={styles.planWorkspace}>
                    <nav className={styles.planList}>


                        {plans.map((plan) => (
                            <button
                                className={
                                    plan.id === selectedPlanId
                                        ? `${styles.planListItem} ${styles.isSelected}`
                                        : styles.planListItem
                                }
                                type="button"
                                key={plan.id}
                                aria-pressed={plan.id === selectedPlanId}
                                onClick={() => setSelectedPlanId(plan.id)}
                            >
                                {plan.name}
                            </button>
                        ))}
                    </nav>

                    <div>
                        <label className={styles.planSelector} htmlFor="plan">
                            <h2>Choose a plan</h2>
                            <select
                                id="plan"
                                value={selectedPlanId}
                                onChange={(event) => setSelectedPlanId(event.target.value)}
                            >
                                {plans.map((plan) => (
                                    <option key={plan.id} value={plan.id}>
                                        {plan.name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <div className={styles.planProgress} aria-labelledby="plan-progress-heading">
                            <h3 id="plan-progress-heading">Plan progress</h3>

                            <progress
                                className={styles.progressBar}
                                value={completedCount}
                                max={totalScales}
                            >
                                {progressPercent}%
                            </progress>

                            <p>
                                {completedCount} of {totalScales} scales completed ({progressPercent}%)
                            </p>
                        </div>

                        <div className={styles.planActions}>
                            <Link
                                className={styles.practicePlanLink}
                                href={`/practice?plan=${selectedPlan.id}`}>
                                Practice this plan
                            </Link>
                            <button
                                className={styles.restartPlanButton}
                                type="button"
                                onClick={handleRestartPlan}
                            >
                                Restart progress
                            </button>
                        </div>

                        <section className={styles.planContent}>
                            <h2 id="plan-title">{selectedPlan.name}</h2>
                            <p>{selectedPlan.description}</p>
                            <h3> Scales in this plan</h3>
                            <ul>
                                {selectedPlan.scales.map((scale) => (
                                    <li key={scale}>{scale}</li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </div>
            </main >

            <CreatePlanModal
                isOpen={showCreatePlanModal}
                mode="create"
                onClose={() => setShowCreatePlanModal(false)}
                onSave={handleCreatePlan}
            />
        </div >


    )
}