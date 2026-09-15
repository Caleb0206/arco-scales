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
const placeholderImage = "https://placehold.co/400x100";
export default function KeySignatureInfo() {

    return (
        <section className="key-sig-info">
            <h2>Key Signature</h2>
            <img className="key-sig-image" src={placeholderImage} alt="Key signature image" />

            <p>Notes: </p>
        </section>
    );
}