"use client";

import Link from "next/link";
import styles from "../../app/plans/page.module.css";
import type { Plan } from "@/types/plan";

type PlanDetailsProps = {
    plan: Plan;
    completedCount: number;
    totalScales: number;
    progressPercent: number;
    actionError: string | null;
    isRestarting: boolean;
    isDeleting: boolean;
    onRestart: () => Promise<void>;
    onEdit: () => void;
    onDelete: () => Promise<void>;
};

export function PlanDetails({
    plan,
    completedCount,
    totalScales,
    progressPercent,
    actionError,
    isRestarting,
    isDeleting,
    onRestart,
    onEdit,
    onDelete,
}: PlanDetailsProps) {
    return (
        <div>
            {actionError && (
                <p role="alert">
                    {actionError}
                </p>
            )}
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
                    href={`/practice?plan=${plan.id}`}
                >
                    Practice this plan
                </Link>

                <button
                    className={styles.restartPlanButton}
                    type="button"
                    disabled={isRestarting}
                    onClick={onRestart}
                >
                    {isRestarting
                        ? "Restarting..."
                        : "Restart progress"}
                </button>

                <button
                    className={styles.restartPlanButton}
                    type="button"
                    onClick={() => onEdit()}
                >
                    Edit plan
                </button>

                <button
                    className={styles.restartPlanButton}
                    type="button"
                    disabled={isDeleting}
                    onClick={() => void onDelete()}
                >
                    {isDeleting ? "Deleting..." : "Delete plan"}
                </button>
            </div>

            <section className={styles.planContent}>
                <h2 id="plan-title">{plan.name}</h2>
                <p>{plan.description}</p>
                <h3> Scales in this plan</h3>
                <ul>
                    {plan.scales.map((scale) => (
                        <li key={scale}>{scale}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
}