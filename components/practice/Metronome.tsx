"use client";
import { useState, useRef, useEffect } from "react";
import styles from "../../app/practice/page.module.css";
import Image from "next/image";

export default function Metronome() {
    const [selectedBPM, setSelectedBPM] = useState(80);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isBeatActive, setIsBeatActive] = useState(false);

    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        if (!isPlaying || !audioContextRef.current) {
            return;
        }

        const audioContext = audioContextRef.current;
        const millisecondsPerBeat = 60_000 / selectedBPM;
        function playBeat() {
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();

            oscillator.type = "square";
            oscillator.frequency.value = 1_000;

            gain.gain.setValueAtTime(0.12, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);

            oscillator.connect(gain);
            gain.connect(audioContext.destination);

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.05);

            setIsBeatActive(true);
            window.setTimeout(() => {
                setIsBeatActive(false);
            }, 80);
        }

        playBeat();

        const intervalId = window.setInterval(
            playBeat,
            millisecondsPerBeat
        );

        return () => {
            window.clearInterval(intervalId);
        };
    }, [isPlaying, selectedBPM]);

    async function handlePlayToggle() {
        if (isPlaying) {
            setIsPlaying(false);
            return;
        }

        if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext();
        }

        if (audioContextRef.current.state === "suspended") {
            await audioContextRef.current.resume();
        }

        setIsPlaying(true);
    }

    return (
        <section className={styles.metronome}>
            <h2>Metronome</h2>

            <div className={styles.metronomeControls}>
                <div className={styles.metronomeBeat}>
                    <button
                        className={`${styles.metronomeBeat} ${isBeatActive ? styles.isActive : ""}`}
                        type="button"
                        onClick={handlePlayToggle}
                        aria-label={isPlaying ? "Stop metronome" : "Start metronome"}
                        aria-pressed={isPlaying}
                    >
                        <Image
                            className={styles.metronomeBeatImage}
                            src={"/beats/quarter-note.svg"}
                            alt={`Quarter note`}
                            width={400}
                            height={100}
                        />
                    </button>

                    {/* ♩ */}
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