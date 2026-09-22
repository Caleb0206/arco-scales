import styles from "../../app/practice/page.module.css";

export default function CompleteButton() {
    return (
        <button
            type="button"
            className={styles.completeButton}
        >
            √ Mark completed
        </button>
    );
}