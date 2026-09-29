"use client";
import { useState } from "react";
import styles from "../../app/practice/page.module.css";
import Image from "next/image";

export default function Metronome() {
    const [selectedBPM, setSelectedBPM] = useState(80);

    return (
        <section className={styles.metronome}>
            <h2>Metronome</h2>
            {/* <img
                className="metronome-beat"
                src={placeholderImage}
                alt="placeholder for metronome beat"
            /> */}
            <div className={styles.metronomeControls}>
                <div className={styles.metronomeBeat}>
                    <Image
                        className={styles.metronomeBeatImage}
                        src={"/beats/quarter-note.png"}
                        alt={`Quarter note`}
                        width={400}
                        height={100}
                    />
                    ♩
                </div>

                <label className={styles.selectorField} htmlFor="bpm">
                    BPM
                    <input
                        id="bpm"
                        type="number"
                        min="30"
                        max="240"
                        step="1"
                        value={selectedBPM}
                        onChange={(event) => setSelectedBPM(Number(event.target.value))}
                    />
                </label>
            </div>

        </section>
    );
}