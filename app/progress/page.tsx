"use client";

import Card from "@/components/Card";
import { usePracticeSessions } from "@/hooks/usePracticeSessions";

export default function Progress() {
    const {
        practiceSessions,
        isSessionsLoading,
        sessionsError,
        loadPracticeSessions
    } = usePracticeSessions();

    // Sunday is the first day of the week
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(
        startOfWeek.getDate() - startOfWeek.getDay()
    );
    const sessionsThisWeek = practiceSessions.filter((session) => {
        const practicedAt = new Date(session.practicedAt);

        return practicedAt >= startOfWeek;
    }).length;

    return (
        <div className="background">
            <main>
                <h1>Progress</h1>
                <div>

                    <section
                        className="profile-summary"
                        aria-labelledby="profile-heading"
                    >
                        <h2 id="profile-heading">Welcome back!</h2>
                    </section>

                    <section aria-labelledby="summary-heading">
                        <h2 id="summary-heading">Summary</h2>
                        <div className="progress-cards">
                            <Card title="Sessions this week" >
                                {isSessionsLoading && (
                                    <p>Loading...</p>
                                )}
                                {sessionsError && (
                                    <>
                                        <p>Could not load sessions.</p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                void loadPracticeSessions()
                                            }
                                        >
                                            Try again
                                        </button>
                                    </>
                                )}

                                {!isSessionsLoading && !sessionsError && (
                                    <p>{sessionsThisWeek}</p>
                                )}
                            </Card>
                            <Card title="Most practiced">
                                <p>....</p>
                            </Card>
                            <Card title="Fastest Tempo">
                                <p>...</p>
                            </Card>
                        </div>
                    </section>

                </div>
            </main >
        </div >
    );
}
