import Link from "next/link";
import SignOutButton from "./SignOutButton/SignOutButton";

export default function Navigation() {
    return (
        <nav className="site-nav" aria-label="Main navigation">

            <Link className="site-brand" href="/">
                Arco Scales
            </Link>
            <div className="nav-links">
                <Link className="nav-item" href="/practice">Practice</Link>
                <Link className="nav-item" href="/scales">Scale Library</Link>
                <Link className="nav-item" href="/plans">Plans</Link>
                <Link className="nav-item" href="/progress">Progress</Link>
            </div>

            <SignOutButton />

        </nav>
    )
}
