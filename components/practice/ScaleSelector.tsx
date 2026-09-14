"use client";
import { useState } from "react";

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
export default function ScaleSelector() {


    const [selectedScale, setSelectedScale] = useState("A Major");
    const [selectedOctaves, setSelectedOctaves] = useState(2);

    return (
        <section className="practice-selector" aria-labelledby="current-scale-heading">

            <div className="current-scale-display">
                <p id="current-scale-heading" className="current-scale-label">
                    Current Scale
                </p>
                <p className="current-scale-value">
                    {selectedScale} - {selectedOctaves}{" "}
                    {selectedOctaves === 1 ? "octave" : "octaves"}
                </p>

            </div>
            <div className="selector-controls">
                <label className="selector-field" htmlFor="scale">
                    Scale
                    <select id="scale" value={selectedScale} onChange={(event) => setSelectedScale(event.target.value)}>
                        {scaleOptions.map((scale) => (
                            <option key={scale} value={scale}>
                                {scale}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="selector-field" htmlFor="octaves">
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
        </section>
    );
}