"use client";
import styles from "./modal.module.css";
import { useEffect, useState } from "react";
import type { PlanDraft } from "@/types/plan";

type CreatePlanModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (draft: PlanDraft) => Promise<void>;
    mode: "create" | "edit";
    plan?: PlanDraft;
};

const scaleOptions = [
    "A Major",
    "B Major",
    "C Major",
    "D Major",
    "E Major",
    "F Major",
    "G Major",
    "A Minor",
    "B Minor",
    "C Minor",
    "D Minor",
    "E Minor",
    "F Minor",
    "G Minor",
];

export function CreatePlanModal({
    isOpen,
    onClose,
    onSave,
    mode,
    plan
}: CreatePlanModalProps) {
    const [submitError, setSubmitError] = useState("");
    const [title, setTitle] = useState(() => plan?.name ?? "");
    const [description, setDescription] = useState(() => plan?.description ?? "");
    const [selectedScales, setSelectedScales] = useState<string[]>([]);

    const [isSaving, setIsSaving] = useState(false);


    const header = mode === "create" ? "Create Plan" : "Edit Plan";

    useEffect(() => {
        if (!isOpen) return;

        // Escape Key logic
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) return;

        setTitle(plan?.name ?? "");
        setDescription(plan?.description ?? "");
        setSelectedScales(plan?.scales ?? []);
        setSubmitError("");
    }, [isOpen, mode, plan]);


    if (!isOpen) return null;

    function handleScaleChange(scale: string, checked: boolean) {
        setSelectedScales((currentScales) => {
            if (checked) {
                return [...currentScales, scale];
            }

            return currentScales.filter(
                (selectedScale) => selectedScale !== scale
            );
        });
    }

    async function handleSubmit() {


        if (!title.trim()) {
            setSubmitError("Please enter a plan title.");
            return;
        }

        if (selectedScales.length === 0) {
            setSubmitError("Please choose at least one scale.");
            return;
        }
        setSubmitError("");

        setIsSaving(true);
        try {
            await onSave({
                name: title.trim(),
                description: description.trim(),
                scales: selectedScales,
            });
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Could not save plan."
            );
        } finally {
            setIsSaving(false);
        }

    }

    return (
        <div
            className={styles.modalOverlay}
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            aria-labelledby="edit-recipe-title"
            id="edit-recipe-dialog"
        >

            <div
                className={styles.modalContent}
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-recipe-title"
            >
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleSubmit();
                    }}
                >
                    <header className={styles.modalHeader}>
                        <h2 id="edit-recipe-title">{header}</h2>
                        <button
                            type="button"
                            value="cancel"
                            aria-label="Close"
                            onClick={onClose}
                        >
                            ✕
                        </button>
                    </header>
                    {submitError && (
                        <p className={styles.formError} role="alert">
                            {submitError}
                        </p>
                    )}
                    <div className={styles.formField}>
                        <label htmlFor="plan-title">Plan title</label>
                        <input
                            id="plan-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formField}>
                        <label htmlFor="plan-description">Description</label>
                        <textarea
                            id="plan-description"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <fieldset className={styles.scaleChoices}>
                        <legend>Choose scales</legend>

                        {scaleOptions.map((scale) => (
                            <label className={styles.scaleChoice} key={scale}>
                                <input
                                    type="checkbox"
                                    checked={selectedScales.includes(scale)}
                                    onChange={(event) =>
                                        handleScaleChange(scale, event.target.checked)
                                    }
                                />
                                {scale}
                            </label>
                        ))}
                    </fieldset>
                    <footer className={styles.modalActions}>
                        <button type="button" value="cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            value="confirm"
                            className="primary"
                            disabled={isSaving}
                        >
                            {isSaving ? "Saving..." : "Save"}
                        </button>
                    </footer>

                </form>

            </div>
        </div>
    )
}