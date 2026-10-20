import { signOut } from "@/auth";
import styles from "./signout.module.css";

export default function SignOutButton() {
    return (
        <form
            action={async () => {
                "use server";

                await signOut({
                    redirectTo: "/login",
                });
            }}
        >
            <button className={styles.signOutButton} type="submit">
                Log out
            </button>

        </form>
    )
}