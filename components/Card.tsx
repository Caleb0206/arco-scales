import Link from "next/link";
import type { ReactNode } from "react";

type CardProps = {
    title: string;
    children: ReactNode;
    href?: string;
};

export default function Card({
    title,
    children,
    href,
}: CardProps) {
    const content = (
        <>
            <h2>{title}</h2>
            <div className="card-content">{children}</div>

        </>
    );

    // If card is clickable
    if (href) {
        return (
            <Link className="card card-link" href={href}>
                {content}
            </Link>
        );
    }

    // Card is not interactable
    return (
        <div className="card">{content}</div>
    );
}