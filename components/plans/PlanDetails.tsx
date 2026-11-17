"use client";

import type { ReactNode } from "react";
import styles from "../../app/plans/page.module.css";
import type { Plan } from "@/types/plan";

type PlanDetailsProps = {
    plan: Plan;
    progressSlot: ReactNode;
    actionsSlot: ReactNode;
    errorSlot?: ReactNode;
};
// TODO: cut this down into Layout components
export function PlanDetails({
    plan,
    progressSlot,
    actionsSlot,
    errorSlot,
}: PlanDetailsProps) {
    return (
        <div>
            {errorSlot}

            {progressSlot}

            {actionsSlot}

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