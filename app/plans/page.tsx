import Card from "@/components/Card";

export default function Plans() {
    return (
        <div>
            <main>
                <h1>
                    Plans
                </h1>

                <div className="plans-list">
                    <Card
                        title="Plan 1">
                        <p>A Major, C Minor</p>
                    </Card>
                    <Card
                        title="Plan 2">
                        <p>G Major, F Minor</p>
                    </Card>
                    <Card
                        title="Plan 3">
                        <p>E Minor, A Minor</p>
                    </Card>
                </div>
            </main>
        </div>


    )
}