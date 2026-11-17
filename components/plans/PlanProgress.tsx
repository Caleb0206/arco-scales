
import styles from "../../app/plans/page.module.css";

type PlanProgressProps = {
    completedCount: number;
    totalScales: number;
    progressPercent: number;
};

export function PlanProgress({
    completedCount,
    totalScales,
    progressPercent,
}: PlanProgressProps) {
    return (
        <section
            className={styles.planProgress}
            aria-labelledby="plan-progress-heading"
        >
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
        </section>
    )
}