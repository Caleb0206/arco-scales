export async function getErrorMessage(response: Response, fallback: string) {
    const body = await response
        .json()
        .catch(() => null) as { error?: string } | null;

    return body?.error ?? fallback;
}