"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { scales } from "@/data/scales";
import { usePracticeSessions } from "@/hooks/usePracticeSessions";

export default function Home() {
  const { practiceSessions } = usePracticeSessions();

  const practicedScaleNames = new Set(
    practiceSessions.map((session) => session.scaleName)
  );

  const practicedScales = scales.filter((scale) =>
    practicedScaleNames.has(scale.name)
  );

  const [randomScaleHref, setRandomScaleHref] = useState("/scales");

  useEffect(() => {
    if (practicedScales.length === 0) {
      setRandomScaleHref("/scales");
      return;
    }
    const randomIndex = Math.floor(Math.random() * practicedScales.length);
    const randomScale = practicedScales[randomIndex];

    setRandomScaleHref(
      `/practice?scale=${encodeURIComponent(randomScale.name)}`
    );
  }, [practiceSessions]);


  return (
    <div className="background">
      <main>
        <div>
          <h1>Welcome back!</h1>

        </div>
        <div className="card-row" aria-label="Practice options">
          <Card
            title="Resume Practice"
            href="/practice"
          >
            {/* <p>D Major</p>
            <p>Last tempo: ## BPM</p> */}
            <p>Continue</p>
          </Card>
          <Card
            title="Lesson Plans"
            href="/plans"
          >
            <p>Follow a guided scale-practice.</p>
          </Card>
          <Card
            title="Random Scale"
            href={randomScaleHref}
          >

            <p>Review a randomly selected scale you have practiced before.</p>


          </Card>
          <Card
            title="Practice Summary"
            href="/progress"
          >
            <p># Sessions this week</p>
          </Card>

        </div>

      </main>
    </div>
  );
}
