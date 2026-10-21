
import Script from "next/script";

export default function LoginPage() {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!clientId || !appUrl) {
        throw new Error("Missing Google sign-in variables.");
    }

    return (
        <main>
            <h1>Welcome to Arco Scales</h1>
            <p>Sign in to save your practice history and plans.</p>

            {/* <form action={signInWithGoogle}>
                <button type="submit">
                    Continue with Google
                </button>
            </form> */}
            <Script
                src="https://accounts.google.com/gsi/client"
                strategy="afterInteractive"
            />
            <div
                id="g_id_onload"
                data-client_id={clientId}
                data-login_uri={`${appUrl}/api/auth/token-verification`}
                data-auto_prompt="false"
                data-ux_mode="redirect"
            />
            <div 
                className="g_id_signin"
                data-type="standard"
                data-theme="outline"
                data-size="large"
                data-text="continue_with"
                data-shape="rectangular"
            
            />
            
        </main>
    )
}