import Image from "next/image";
import Card from "@/components/Card";

export default function Home() {
  return (
    <div className="background">
      <main>
        <div>
          <h1>Arco Scales</h1>
          <h2>Welcome back!</h2>

        </div>
        <div className="card-row" aria-label="Practice options">
          <Card
            title="Resume Practice"
            href="/practice"
          >
            <p>D Major</p>
            <p>Last tempo: ## BPM</p>
          </Card>
          <Card
            title="Lesson Plans"
            href="/"
          >
            <p>Follow a guided scale-practice.</p>
          </Card>
          <Card
            title="Random Scale"
            href="/"
          >
            <p>Let Arco Scales select your next scale to practice.</p>
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
