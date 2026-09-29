"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { CreatePlanModal } from "@/components/plans/CreatePlanModal";
import Link from "next/link";
import { usePlans, type PlanDraft } from "@/context/PlansContext";


export default function Plans() {
    const { plans, restartPlan, addPlan } = usePlans();
    const [selectedPlanId, setSelectedPlanId] = useState(
        () => plans[0].id
    );


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
        restartPlan(selectedPlan.id);
    };

    function handleCreatePlan(draft: PlanDraft) {
        const newPlanId = addPlan(draft);

        setSelectedPlanId(newPlanId);
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