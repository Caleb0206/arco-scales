import styles from "../../app/practice/page.module.css";

type CompleteButtonProps = {
    isComplete: boolean;
    onComplete: () => void;
};

export default function CompleteButton({
    isComplete,
    onComplete,
}: CompleteButtonProps) {
    return (
        <button
            type="button"
            className={styles.completeButton}
            onClick={onComplete}
            disabled={isComplete}
        >
            {isComplete ? "√ Completed" : "Mark Complete"}
        </button>
    );
}