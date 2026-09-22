import styles from "../../app/practice/page.module.css";

const placeholderImage = "https://placehold.co/600x700";

export default function FingeringDiagram() {
    return (
        <section className={styles.fingeringDiagram}>
            <h2 id="fingering-diagram-heading">Fingering Diagram</h2>

            <img
                src={placeholderImage}
                alt="placeholder for viola fingering diagram"
            />
        </section>
    )
}