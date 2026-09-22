"use client";
import { useState } from "react";
import styles from "./page.module.css";

type Plan = {
    id: string;
    name: string;
    description: string;
    scales: string[];
};
const plans: Plan[] = [
    {
        id: "major-foundations",
        name: "Major Foundations",
        description: "Practice a set of common major scales at a comfortable tempo.",
        scales: ["A Major", "D Major", "G Major"]
    },
    {
        id: "minor-focus",
        name: "Minor Focus",
        description: "Practice a set of common minor scales with focus on fingerings.",
        scales: ["A Minor", "D Minor", "E Minor"]
    },
    {
        id: "challenge-plan",
        name: "Challenge Plan",
        description: "Practice less recent scales.",
        scales: ["B Major", "F Major", "C Minor"]
    },
]
export default function Plans() {
    const [selectedPlanId, setSelectedPlanId] = useState(plans[0].id);
    const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? plans[0];

    return (
        <div>
            <main>
                <h1>
                    Plans
                </h1>

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
        </div >


    )
}