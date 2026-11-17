import Link from "next/link";
import styles from "../../app/plans/page.module.css";
import type { Plan } from "@/types/plan";

type PlanActionsProps = {
    planId: Plan["id"];
    isRestarting: boolean;
    isDeleting: boolean;
    onRestart: () => Promise<void>;
    onEdit: () => void;
    onDelete: () => Promise<void>;
};
export function PlanActions({
    planId,
    isRestarting,
    isDeleting,
    onRestart,
    onEdit,
    onDelete,
}: PlanActionsProps) {
    return (
        <div className={styles.planActions}>
            <Link
                className={styles.practicePlanLink}
                href={`/practice?plan=${planId}`}
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
    )
}
