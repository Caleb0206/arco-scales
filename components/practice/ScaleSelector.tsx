"use client";
import { useState } from "react";
import styles from "../../app/practice/page.module.css";
import { scales } from "@/data/scales";

type ScaleSelectorProps = {
    selectedScaleName: string;
    onScaleChange: (scaleName: string) => void;
}

export default function ScaleSelector({
    selectedScaleName,
    onScaleChange,
}: ScaleSelectorProps) {

    const [selectedOctaves, setSelectedOctaves] = useState(2);

    return (
        <section className={styles.practiceSelector} aria-labelledby="current-scale-heading">
            <div className={styles.selectorControls}>
                <label className={styles.selectorField} htmlFor="scale">
                    Scale
                    <select
                        id="scale" value={selectedScaleName}
                        onChange={(event) => onScaleChange(event.target.value)}
                    >
                        {scales.map((scale) => (
                            <option key={scale.name} value={scale.name}>
                                {scale.name}
                            </option>
                        ))}
                    </select>
                </label>
                <label className={styles.selectorField} htmlFor="octaves">
                    Octaves
                    <select
                        id="octaves"
                        value={selectedOctaves}
                        onChange={(event) =>
                            setSelectedOctaves(Number(event.target.value))
                        }
                    >
                        <option value={1}>1 octave</option>
                        <option value={2}>2 octave</option>

                    </select>
                </label>
            </div>
        </section >
    );
}