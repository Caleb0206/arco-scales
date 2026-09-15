import Link from "next/link";

export default function Navigation() {
    return (
        <header className="site-header">
            <nav className="site-nav" aria-label="Main navigation">
                <Link className="nav-item" href="/">Arco Scales </Link>
                <Link className="nav-item" href="/practice">Practice</Link>
                <Link className="nav-item" href="/scales">Scale Library</Link>
                <Link className="nav-item" href="/plans">Plans</Link>
                <Link className="nav-item" href="/progress">Progress</Link>
            </nav>
        </header>
    )
}
