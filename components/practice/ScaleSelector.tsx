"use client";
import { useState } from "react";
import styles from "../../app/practice/page.module.css";
import { Scale, type OctaveCount } from "@/data/scales";

type ScaleSelectorProps = {
    scales: Scale[];
    selectedScaleName: string;
    selectedOctaves: OctaveCount;
    onScaleChange: (scaleName: string) => void;
    onOctavesChange: (octave: OctaveCount) => void;
    label: string;
}

export default function ScaleSelector({
    scales,
    selectedOctaves,
    selectedScaleName,
    onScaleChange,
    onOctavesChange,
    label,
}: ScaleSelectorProps) {

    return (
        <section className={styles.practiceSelector} aria-labelledby="current-scale-heading">
            <div className={styles.selectorControls}>
                <label className={styles.selectorField} htmlFor="scale">
                    {label}
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
                            onOctavesChange(
                                Number(event.target.value) as OctaveCount
                            )
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