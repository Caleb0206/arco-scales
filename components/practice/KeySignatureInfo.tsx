import styles from "../../app/practice/page.module.css";

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
const placeholderImage = "https://placehold.co/400x100";
export default function KeySignatureInfo() {

    return (
        <section className={styles.keySigInfo}>
            <h2>Key Signature</h2>
            <img className={styles.keySigImage} src={placeholderImage} alt="Key signature image" />

            <p>Notes: </p>
        </section>
    );
}