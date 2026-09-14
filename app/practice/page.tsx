
import Image from "next/image";
import Card from "@/components/Card";
import ScaleSelector from "@/components/practice/ScaleSelector";
import KeySignatureInfo from "@/components/practice/KeySignatureInfo";

export default function Practice() {

    return (
        <div className="background">
            <main>
                <div>
                    <h1>Practice</h1>
                    <h2>Let's start!</h2>

                    <ScaleSelector />
                    <KeySignatureInfo />
                </div>
            </main>
        </div>
    );
}
