import Card from "@/components/Card";

export default function Progress() {
    return (
        <div className="background">
            <main>
                <h1>Progress</h1>
                <div>

                    <section
                        className="profile-summary"
                        aria-labelledby="profile-heading"
                    >
                        <h2 id="profile-heading">Welcome Bob!</h2>
                        <p>  Email: bob@example.com </p>
                    </section>

                    <section aria-labelledby="summary-heading">
                        <h2 id="summary-heading">Summary</h2>
                        <div className="progress-cards">
                            <Card title="Sessions this week" >
                                <p>5</p>
                            </Card>
                            <Card title="Most practiced">
                                <p>A Major</p>
                            </Card>
                            <Card title="Fastest Tempo">
                                <p>96 bpm</p>
                            </Card>
                        </div>
                    </section>

                </div>
            </main >
        </div >
    );
}
