export function formatLastUpdated(
    timestamp: string,
    now: number,
): string {
    const elapsed = Math.max(
        0,
        Math.floor((now - new Date(timestamp).getTime()) / 1000),
    );

    if (elapsed < 1) {
        return "just now";
    }

    return `${elapsed} second${elapsed === 1 ? "" : "s"} ago`;
}