import Link from "next/link";
import type { ReactNode } from "react";

type CardProps = {
    title: string;
    children: ReactNode;
    href: string;
};

export default function Card({
    title,
    children,
    href,
}: CardProps) {
    return (
        <Link className="card" href={href}>
            <h2>{title}</h2>
            <div className="card-content">{children}</div>

        </Link>
    );
}