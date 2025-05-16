export const getFeatures = (tokens: number) => [
    `${tokens} hours raw recording`,
    `${Math.floor(tokens / 1.25 * 10) / 10} hours with Gladia transcription`,
    `${Math.floor(tokens / 1.1 * 10) / 10} hours with streaming input or output`,
    `${Math.floor(tokens / 1.2 * 10) / 10} hours with streaming input and output`,
]

export const getActivePrice = (prices: any[]) =>
    prices.find((p) => p.active) || prices[0]
