import { signInWithGoogle } from "./actions";

export default function LoginPage() {
    return (
        <main>
            <h1>Welcome to Arco Scales</h1>
            <p>Sign in to save your practice history and plans.</p>

            <form action={signInWithGoogle}>
                <button type="submit">
                    Continue with Google
                </button>
            </form>
        </main>
    )
}