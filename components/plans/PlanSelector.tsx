"use client";

import styles from "../../app/plans/page.module.css";
import type { Plan } from "@/types/plan";

type PlanSelectorProps = {
    plans: Plan[],
    selectedPlanId: string;
    onPlanChange: (planId: string) => void;
};

export function PlanSelector({
    plans,
    selectedPlanId,
    onPlanChange,
}: PlanSelectorProps) {
    return (
        <>
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
                        onClick={() => onPlanChange(plan.id)}
                    >
                        {plan.name}
                    </button>
                ))}
            </nav>

            <label className={styles.planSelector} htmlFor="plan">
                <h2>Choose a plan</h2>
                <select
                    id="plan"
                    value={selectedPlanId ?? ""}
                    onChange={(event) => onPlanChange(event.target.value)}
                >
                    {plans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                            {plan.name}
                        </option>
                    ))}
                </select>
            </label>
        </>
    )
}