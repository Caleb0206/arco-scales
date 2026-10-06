import styles from "../../app/practice/page.module.css";
import Image from "next/image";

import type { OctaveCount, Scale } from "@/data/scales";

const placeholderImage = "https://placehold.co/600x700";

type FingeringDiagramProps = {
    scale: Scale;
    selectedOctaves: OctaveCount
}
export default function FingeringDiagram({
    scale,
    selectedOctaves,
}: FingeringDiagramProps) {
    const imagePath = scale.fingeringDiagramImages?.[selectedOctaves];

    return (
        <section className={styles.fingeringDiagram}>
            <h2 id="fingering-diagram-heading">Fingering Diagram</h2>

            {imagePath ? (
                <Image
                    className={styles.fingeringDiagram}
                    src={imagePath}
                    alt={`Fingering diagram for ${scale.name}`}
                    width={600}
                    height={700}
                />
            ) : (
                // <img
                //     src={placeholderImage}
                //     alt="placeholder for viola fingering diagram"
                // />
                <p>not yet available</p>
            )

            }

        </section>
    )
}