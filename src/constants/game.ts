export const GAME_CONSTANTS: {
    playerCounts: number[],
    maxSpyPupCount: Record<number, number>,
    maxConfusedKittenCount: Record<number, number>,
} = {
    playerCounts: [4, 5, 6, 7, 8,9,10,11,12],
    maxSpyPupCount: {
        4: 0,
        5: 1,
        6: 1,
        7: 1,
        8: 1,
        9: 2,
        10: 2,
        11: 2,
        12: 2,
    },
    maxConfusedKittenCount: {
        4: 1,
        5: 2,
        6: 2,
        7: 2,
        8: 2,
        9: 3,
        10: 3,
        11: 3,
        12: 3,
    }
}