"use client";
import { useState } from "react";
import styles from "../../app/practice/page.module.css";

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