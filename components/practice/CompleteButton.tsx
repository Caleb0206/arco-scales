import styles from "../../app/practice/page.module.css";

type CompleteButtonProps = {
    isComplete: boolean;
    canComplete: boolean;
    onComplete: () => void;
};

export default function CompleteButton({
    isComplete,
    canComplete,
    onComplete,
}: CompleteButtonProps) {
    return (
        <button
            type="button"
            className={styles.completeButton}
            onClick={onComplete}
            disabled={isComplete}
        >
            {isComplete
                ? "√ Completed"
                : canComplete
                    ? "Mark Complete"
                    : "Not in this plan"}
        </button>
    );
}