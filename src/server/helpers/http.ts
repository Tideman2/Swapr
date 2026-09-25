export function generateRandomDelay(
    min = 200,
    max = 1500,
): number {
    return Math.floor(
        Math.random() * (max - min + 1) + min,
    );
}

export function delay(
    milliseconds: number,
): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

export async function simulateNetworkDelay(): Promise<void> {
    const milliseconds = generateRandomDelay();

    await delay(milliseconds);
}