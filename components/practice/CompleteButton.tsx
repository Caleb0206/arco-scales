import styles from "../../app/practice/page.module.css";

type CompleteButtonProps = {
    isComplete: boolean;
    isSaving: boolean;
    onComplete: () => void;
};

export default function CompleteButton({
    isComplete,
    isSaving,
    onComplete,
}: CompleteButtonProps) {
    return (
        <button
            type="button"
            className={styles.completeButton}
            onClick={onComplete}
            disabled={isSaving}
        >
            {isSaving
                ? "Saving..."
                : isComplete
                    ? "Unmark Complete"
                    : "Mark Complete"}
        </button>
    );
}