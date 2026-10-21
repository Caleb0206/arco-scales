import styles from "./signout.module.css";

export default function SignOutButton() {
    return (
        <form action="/api/auth/logout" method="post">
            <button className={styles.signOutButton} type="submit">
                Log out
            </button>
        </form>
    );
}