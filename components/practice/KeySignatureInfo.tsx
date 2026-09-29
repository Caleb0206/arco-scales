import styles from "../../app/practice/page.module.css";
import Image from "next/image";
import type { Scale } from "@/data/scales";

type KeySignatureInfoProps = {
    scale: Scale;
}
export default function KeySignatureInfo({
    scale,
}: KeySignatureInfoProps) {

    return (
        <section className={styles.keySigInfo}>
            <h2>Key Signature</h2>
            <Image
                className={styles.keySigImage}
                src={scale.keySignatureImage}
                alt={`Key signature for ${scale.name}`}
                width={400}
                height={100}
            />
            <p>Notes: {scale.notes.join(", ")} </p>
        </section>
    );
}