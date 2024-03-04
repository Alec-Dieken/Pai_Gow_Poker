/**
 * This project started as me just messing around a bit and I
 * never intended to go anywhere near this far with the project.
 * Hence the lack of structure and classes within this code.
 * 
 * New classes and code/project strucutre are being implemented
 * to reduce repeated code, make code more readable, and increase
 * overall efficiency.
 */

const FULL_DECK = [
    "A S",
    "2 S",
    "3 S",
    "4 S",
    "5 S",
    "6 S",
    "7 S",
    "8 S",
    "9 S",
    "10 S",
    "J S",
    "Q S",
    "K S",
    "A H",
    "2 H",
    "3 H",
    "4 H",
    "5 H",
    "6 H",
    "7 H",
    "8 H",
    "9 H",
    "10 H",
    "J H",
    "Q H",
    "K H",
    "A C",
    "2 C",
    "3 C",
    "4 C",
    "5 C",
    "6 C",
    "7 C",
    "8 C",
    "9 C",
    "10 C",
    "J C",
    "Q C",
    "K C",
    "A D",
    "2 D",
    "3 D",
    "4 D",
    "5 D",
    "6 D",
    "7 D",
    "8 D",
    "9 D",
    "10 D",
    "J D",
    "Q D",
    "K D",
    "A J", //JOKER
];

// MAPPING VALUES FOR RANKS
const rankValue = {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14,
    JOKER: 15,
};

// MAPPING VALUES FOR SUITS
const suitValue = {
    S: 4,
    H: 3,
    D: 2,
    C: 1,
};

/**************************
 *
 * GENERATE HANDS
 *
 **************************/
function generateHands(hasDealerHand, dealerHandMode, dealerHandType, playerHandType, alwaysHasJoker) {
    let deck = [...FULL_DECK];

    const playerHand = [];
    const dealerHand = [];

    if (!hasDealerHand) {
        if (alwaysHasJoker) {
            playerHand.push(deck.pop());
            shuffle(deck);

            if (playerHandType === "random") {
                while (playerHand.length < 7) {
                    playerHand.push(deck.pop());
                }
            } else if (playerHandType === "flushes") {
            } else if (playerHandType === "straights") {
            } else if (playerHandType === "tricky") {
            }
        } else {
            shuffle(deck);

            if (playerHandType === "random") {
                while (playerHand.length < 7) {
                    playerHand.push(deck.pop());
                }
            } else if (playerHandType === "flushes") {
            } else if (playerHandType === "straights") {
            } else if (playerHandType === "tricky") {
            }
        }
    }

    shuffle(playerHand);

    return { playerHand, dealerHand };
}

/**************************
 *
 * SHUFFLE
 *
 **************************/
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue,
        randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/**************************
 *
 * SOLVE
 *
 **************************/
function solve(hand) {
    const sortedHand = sort(hand);
    const rankCounter = new Map();
    const suitCounter = new Map();
    let hasJoker = false;
    let hasFiveAces = false;
    let hasQuads = false;
    let hasTwoTrips = false;
    let hasTrips = false;
    let hasTripAces = false;
    let hasKingQueen = false;
    let hasThreePairs = false;
    let hasTwoPairs = false;
    let hasOnePair = false;
    let hasNoPairs = true;
    let straightValues = false;
    let flushValues = false;

    for (const card of sortedHand) {
        if (card === "A J") {
            hasJoker = true;
            rankCounter.set("A", ["J"])
        } else {
            const [rank, suit] = card.split(" ");
            if (rankCounter.get(rank)) {
                rankCounter.get(rank).push(suit);
            } else {
                rankCounter.set(rank, [suit]);
            }

            if (suitCounter.get(suit)) {
                suitCounter.get(suit).push(rank);
            } else {
                suitCounter.set(suit, [rank]);
            }
        }
    }

    for (const rank of [...rankCounter.keys()]) {
        if (rankCounter.get(rank).length === 5) {
            hasFiveAces = true;
        }

        if (rankCounter.get(rank).length === 4) {
            hasQuads = rank;
        }

        if (rankCounter.get(rank).length === 3) {
            if (hasTrips === false) {
                hasTrips = rank;
                if (rank === "A") {
                    hasTripAces = true;
                    if (rankCounter.get("K") && rankCounter.get("Q")) {
                        hasKingQueen = true;
                    }
                }
            } else {
                hasTwoTrips = [hasTrips, rank];
                hasTrips = false;
            }
        }

        if (rankCounter.get(rank).length === 2) {
            if (hasNoPairs) {
                hasOnePair = rank;
                hasNoPairs = false;
            } else if (hasOnePair) {
                hasTwoPairs = [hasOnePair, rank];
                hasOnePair = false;
            } else if (hasTwoPairs) {
                hasThreePairs = [...hasTwoPairs, rank];
                hasTwoPairs = false;
            }
        }
    }

    if (hasFiveAces) {
        return solveFiveAces(sortedHand);
    }

    if (hasQuads) {
        return solveQuads(hasQuads, hasTrips, hasOnePair, rankCounter);
    }

    if (hasTwoTrips) {
        return solveTwoTrips(sortedHand);
    }

    if (hasTrips && (hasOnePair || hasTwoPairs)) {
        return solveFullHouse(hasTrips, hasOnePair, hasTwoPairs, rankCounter);
    }

    if (hasThreePairs) {
        return solveThreePairs(hasThreePairs, rankCounter);
    }

    straightValues = hasStraight(rankCounter, hasJoker);
    flushValues = hasFlush(suitCounter, hasJoker);

    if (hasTwoPairs) {
        return solveTwoPairs(hasTwoPairs, hasJoker, straightValues, flushValues, rankCounter, suitCounter);
    }

    return { twoCardHand: ["In Progress"], fiveCardHand: ["In Progress"] };
}

/**************************
 *
 * SOLVE FIVE ACES
 *
 **************************/
function solveFiveAces(hand) {
    const [ace1, ace2, ace3, ace4, ace5, card1, card2] = hand;

    const isPair = card1.charAt(0) === card2.charAt(0);
    const twoCardHand = isPair ? [card1, card2] : [ace1, card1];
    const fiveCardHand = isPair ? [ace1, ace2, ace3, ace4, ace5] : [ace2, ace3, ace4, ace5, card2];

    return { twoCardHand, fiveCardHand };
}

/**************************
 *
 * SOLVE QUADS
 *
 **************************/
function solveQuads(hasQuads, hasTrips, hasOnePair, rankCounter) {
    const twoCardHand = [];
    const fiveCardHand = [];

    if (hasTrips) {
        twoCardHand.push(`${hasQuads} ${rankCounter.get(hasQuads)[0]}`, `${hasQuads} ${rankCounter.get(hasQuads)[1]}`);
        fiveCardHand.push(
            `${hasTrips} ${rankCounter.get(hasTrips)[0]}`,
            `${hasTrips} ${rankCounter.get(hasTrips)[1]}`,
            `${hasTrips} ${rankCounter.get(hasTrips)[2]}`,
            `${hasQuads} ${rankCounter.get(hasQuads)[2]}`,
            `${hasQuads} ${rankCounter.get(hasQuads)[3]}`
        );
    } else if (hasOnePair) {
        twoCardHand.push(`${hasOnePair} ${rankCounter.get(hasOnePair)[0]}`, `${hasOnePair} ${rankCounter.get(hasOnePair)[1]}`);
        fiveCardHand.push(
            `${hasQuads} ${rankCounter.get(hasQuads)[0]}`,
            `${hasQuads} ${rankCounter.get(hasQuads)[1]}`,
            `${hasQuads} ${rankCounter.get(hasQuads)[2]}`,
            `${hasQuads} ${rankCounter.get(hasQuads)[3]}`
        );

        for (const [rank, value] of rankCounter) {
            if (rank !== hasOnePair && rank !== hasQuads) {
                fiveCardHand.push(`${rank} ${rankCounter.get(rank)[0]}`);
            }
        }
    } else if (rankValue[hasQuads] > 7) {
        twoCardHand.push(`${hasQuads} ${rankCounter.get(hasQuads)[0]}`, `${hasQuads} ${rankCounter.get(hasQuads)[1]}`);
        fiveCardHand.push(`${hasQuads} ${rankCounter.get(hasQuads)[2]}`, `${hasQuads} ${rankCounter.get(hasQuads)[3]}`);

        for (const [rank, value] of rankCounter) {
            if (rank !== hasQuads) {
                fiveCardHand.push(`${rank} ${rankCounter.get(rank)[0]}`);
            }
        }
    } else if (rankValue[hasQuads] <= 7) {
        fiveCardHand.push(
            `${hasQuads} ${rankCounter.get(hasQuads)[0]}`,
            `${hasQuads} ${rankCounter.get(hasQuads)[1]}`,
            `${hasQuads} ${rankCounter.get(hasQuads)[2]}`,
            `${hasQuads} ${rankCounter.get(hasQuads)[3]}`
        );

        for (const [rank, value] of rankCounter) {
            if (rank !== hasQuads) {
                if (twoCardHand.length < 2) {
                    twoCardHand.push(`${rank} ${rankCounter.get(rank)[0]}`);
                } else {
                    fiveCardHand.push(`${rank} ${rankCounter.get(rank)[0]}`);
                }
            }
        }
    }

    return { twoCardHand, fiveCardHand };
}

/**************************
 *
 * SOLVE TWO TRIPS
 *
 **************************/
function solveTwoTrips(hand) {
    const [card1, card2, card3, card4, card5, card6, card7] = hand;
    const twoCardHand = [];
    const fiveCardHand = [];

    if (card1.charAt(0) !== card2.charAt(0)) {
        twoCardHand.push(card2, card3);
        fiveCardHand.push(card5, card6, card7, card1, card4);
    } else if (card4.charAt(0) !== card5.charAt(0)) {
        twoCardHand.push(card1, card2);
        fiveCardHand.push(card5, card6, card7, card3, card4);
    } else {
        twoCardHand.push(card1, card2);
        fiveCardHand.push(card4, card5, card6, card3, card7);
    }

    return { twoCardHand, fiveCardHand };
}

/**************************
 *
 * SOLVE FULL HOUSE
 *
 **************************/
function solveFullHouse(hasTrips, hasOnePair, hasTwoPairs, rankCounter) {
    const twoCardHand = [];
    const fiveCardHand = [];

    if (hasTwoPairs) {
        twoCardHand.push(`${hasTwoPairs[0]} ${rankCounter.get(hasTwoPairs[0])[0]}`, `${hasTwoPairs[0]} ${rankCounter.get(hasTwoPairs[0])[1]}`);
        fiveCardHand.push(
            `${hasTrips} ${rankCounter.get(hasTrips)[0]}`,
            `${hasTrips} ${rankCounter.get(hasTrips)[1]}`,
            `${hasTrips} ${rankCounter.get(hasTrips)[2]}`,
            `${hasTwoPairs[1]} ${rankCounter.get(hasTwoPairs[1])[0]}`,
            `${hasTwoPairs[1]} ${rankCounter.get(hasTwoPairs[1])[1]}`
        );
    } else if (hasOnePair) {
        twoCardHand.push(`${hasOnePair} ${rankCounter.get(hasOnePair)[0]}`, `${hasOnePair} ${rankCounter.get(hasOnePair)[1]}`);
        fiveCardHand.push(`${hasTrips} ${rankCounter.get(hasTrips)[0]}`, `${hasTrips} ${rankCounter.get(hasTrips)[1]}`, `${hasTrips} ${rankCounter.get(hasTrips)[2]}`);

        for (const [rank, value] of rankCounter) {
            if (rank !== hasTrips && rank !== hasOnePair) {
                fiveCardHand.push(`${rank} ${rankCounter.get(rank)[0]}`);
            }
        }
    }

    return { twoCardHand, fiveCardHand };
}

/**************************
 *
 * SOLVE THREE PAIRS
 *
 **************************/
function solveThreePairs(hasThreePairs, rankCounter) {
    const twoCardHand = [];
    const fiveCardHand = [];

    twoCardHand.push(`${hasThreePairs[0]} ${rankCounter.get(hasThreePairs[0])[0]}`, `${hasThreePairs[0]} ${rankCounter.get(hasThreePairs[0])[1]}`);
    fiveCardHand.push(
        `${hasThreePairs[1]} ${rankCounter.get(hasThreePairs[1])[0]}`,
        `${hasThreePairs[1]} ${rankCounter.get(hasThreePairs[1])[1]}`,
        `${hasThreePairs[2]} ${rankCounter.get(hasThreePairs[2])[0]}`,
        `${hasThreePairs[2]} ${rankCounter.get(hasThreePairs[2])[1]}`
    );

    for (const [rank, value] of rankCounter) {
        if (rankCounter.get(rank).length === 1) fiveCardHand.push(`${rank} ${rankCounter.get(rank)[0]}`);
    }

    return { twoCardHand, fiveCardHand };
}

/**************************
 *
 * SOLVE TWO PAIRS
 *
 **************************/
function solveTwoPairs(hasTwoPairs, hasJoker, hasStraight, hasFlush, rankCounter, suitCounter) {
    const twoCardHand = [];
    const fiveCardHand = [];

    if (hasJoker && hasTwoPairs[0] === "A" && (hasFlush || hasStraight)) {
        if (hasFlush) {
            if (suitCounter.get(hasFlush).length === 5 || (suitCounter.get(hasFlush).length === 4 && !suitCounter.get(hasFlush).includes(hasTwoPairs[1]))) {
                twoCardHand.push(`${hasTwoPairs[1]} ${rankCounter.get(hasTwoPairs[1])[0]}`, `${hasTwoPairs[1]} ${rankCounter.get(hasTwoPairs[1])[1]}`);

                //Royal Flush
                if (Array.isArray(hasStraight) && hasStraight.includes(10)) {
                    fiveCardHand.push(`A ${rankCounter.get("A")[1]}`);

                    if (rankCounter.get("K") && hasTwoPairs[1] !== "K") {
                        fiveCardHand.push(`K ${rankCounter.get("K")[0]}`);
                    } else {
                        fiveCardHand.push("A J");
                    }

                    if (rankCounter.get("Q") && hasTwoPairs[1] !== "Q") {
                        fiveCardHand.push(`Q ${rankCounter.get("Q")[0]}`);
                    } else {
                        fiveCardHand.push("A J");
                    }

                    if (rankCounter.get("J") && hasTwoPairs[1] !== "J") {
                        fiveCardHand.push(`J ${rankCounter.get("J")[0]}`);
                    } else {
                        fiveCardHand.push("A J");
                    }

                    if (rankCounter.get("10") && hasTwoPairs[1] !== "10") {
                        fiveCardHand.push(`10 ${rankCounter.get("10")[0]}`);
                    } else {
                        fiveCardHand.push("A J");
                    }
                    // A - 5 Straight Flush
                } else if (Array.isArray(hasStraight) && hasStraight.includes(1)) {
                    if (rankCounter.get("5") && hasTwoPairs[1] !== "5") {
                        fiveCardHand.push(`5 ${rankCounter.get("5")[0]}`);
                    } else {
                        fiveCardHand.push("A J");
                    }

                    if (rankCounter.get("4") && hasTwoPairs[1] !== "4") {
                        fiveCardHand.push(`4 ${rankCounter.get("4")[0]}`);
                    } else {
                        fiveCardHand.push("A J");
                    }

                    if (rankCounter.get("3") && hasTwoPairs[1] !== "3") {
                        fiveCardHand.push(`3 ${rankCounter.get("3")[0]}`);
                    } else {
                        fiveCardHand.push("A J");
                    }

                    if (rankCounter.get("2") && hasTwoPairs[1] !== "2") {
                        fiveCardHand.push(`2 ${rankCounter.get("2")[0]}`);
                    } else {
                        fiveCardHand.push("A J");
                    }

                    fiveCardHand.push(`A ${rankCounter.get("A")[1]}`);
                    // Regular flush, pair on top
                } else {
                    fiveCardHand.push(`A ${rankCounter.get("A")[1]}`);
                    let prev = rankValue["A"];
                    let ranks = suitCounter.get(hasFlush);
                    let jokerNeedsPlacing = true;
                    for (let i = 1; i < ranks.length; i++) {
                        if (jokerNeedsPlacing && prev - rankValue[ranks[i]] > 1) {
                            jokerNeedsPlacing = false;
                            fiveCardHand.push("A J");
                        }
                        fiveCardHand.push(`${ranks[i]} ${hasFlush}`);
                    }
                }
            }
        } else if ((Array.isArray(hasStraight) && hasStraight.includes(10) && rankValue[hasTwoPairs[1]] < 10) || (Array.isArray(hasStraight) && hasStraight.includes(1) && rankValue[hasTwoPairs[1]] > 5)) {
            twoCardHand.push(`${hasTwoPairs[1]} ${rankCounter.get(hasTwoPairs[1])[0]}`, `${hasTwoPairs[1]} ${rankCounter.get(hasTwoPairs[1])[1]}`);

            if (Array.isArray(hasStraight) && hasStraight.includes(10)) {
                fiveCardHand.push(`A ${rankCounter.get("A")[1]}`);

                if (rankCounter.get("K") && hasTwoPairs[1] !== "K") {
                    fiveCardHand.push(`K ${rankCounter.get("K")[0]}`);
                } else {
                    fiveCardHand.push("A J");
                }

                if (rankCounter.get("Q") && hasTwoPairs[1] !== "Q") {
                    fiveCardHand.push(`Q ${rankCounter.get("Q")[0]}`);
                } else {
                    fiveCardHand.push("A J");
                }

                if (rankCounter.get("J") && hasTwoPairs[1] !== "J") {
                    fiveCardHand.push(`J ${rankCounter.get("J")[0]}`);
                } else {
                    fiveCardHand.push("A J");
                }

                if (rankCounter.get("10") && hasTwoPairs[1] !== "10") {
                    fiveCardHand.push(`10 ${rankCounter.get("10")[0]}`);
                } else {
                    fiveCardHand.push("A J");
                }
            } else if (Array.isArray(hasStraight) && hasStraight.includes(1)) {
                if (rankCounter.get("5") && hasTwoPairs[1] !== "5") {
                    fiveCardHand.push(`5 ${rankCounter.get("5")[0]}`);
                } else {
                    fiveCardHand.push("A J");
                }

                if (rankCounter.get("4") && hasTwoPairs[1] !== "4") {
                    fiveCardHand.push(`4 ${rankCounter.get("4")[0]}`);
                } else {
                    fiveCardHand.push("A J");
                }

                if (rankCounter.get("3") && hasTwoPairs[1] !== "3") {
                    fiveCardHand.push(`3 ${rankCounter.get("3")[0]}`);
                } else {
                    fiveCardHand.push("A J");
                }

                if (rankCounter.get("2") && hasTwoPairs[1] !== "2") {
                    fiveCardHand.push(`2 ${rankCounter.get("2")[0]}`);
                } else {
                    fiveCardHand.push("A J");
                }

                fiveCardHand.push(`A ${rankCounter.get("A")[1]}`);
            }
        } else {
            twoCardHand.push(`${hasTwoPairs[1]} ${rankCounter.get(hasTwoPairs[1])[0]}`, `${hasTwoPairs[1]} ${rankCounter.get(hasTwoPairs[1])[1]}`);
            fiveCardHand.push("A J", `${hasTwoPairs[0]} ${rankCounter.get(hasTwoPairs[0])[1]}`);
            for (const [rank, value] of rankCounter) {
                if (rank !== "A" || rank !== hasTwoPairs[1]) {
                    fiveCardHand.push(`${rank} ${rankCounter.get(rank)[0]}`);
                }
            }
        }
    } else if ((rankValue[hasTwoPairs[0]] > 7 && rankValue[hasTwoPairs[1]] > 7) || (hasTwoPairs[0] == "A" && rankValue[hasTwoPairs[1]] <= 7)) {
        twoCardHand.push(`${hasTwoPairs[1]} ${rankCounter.get(hasTwoPairs[1])[0]}`, `${hasTwoPairs[1]} ${rankCounter.get(hasTwoPairs[1])[1]}`);
        fiveCardHand.push(`${hasTwoPairs[0]} ${rankCounter.get(hasTwoPairs[0])[0]}`, `${hasTwoPairs[0]} ${rankCounter.get(hasTwoPairs[0])[1]}`);

        for (const [rank, value] of rankCounter) {
            if (rankCounter.get(rank).length === 1) fiveCardHand.push(`${rank} ${rankCounter.get(rank)[0]}`);
        }
    } else if (rankValue[hasTwoPairs[0]] > 7 && rankValue[hasTwoPairs[1]] <= 7) {
        const keys = [...rankCounter.keys()];
        if (
            keys.includes("A") &&
            ((keys.includes("K") && hasTwoPairs[0] != "K") || (keys.includes("Q") && hasTwoPairs[0] != "Q") || (keys.includes("J") && hasTwoPairs[0] != "J"))
        ) {
            twoCardHand.push(`A ${rankCounter.get("A")[0]}`);
            let usedRank;
            for (const rank of keys) {
                if (rank != "A" && rank != hasTwoPairs[0] && rankValue[rank] > 10 && twoCardHand.length < 2) {
                    twoCardHand.push(`${rank} ${rankCounter.get(rank)[0]}`);
                    usedRank = rank;
                    break;
                }
            }
            fiveCardHand.push(
                `${hasTwoPairs[0]} ${rankCounter.get(hasTwoPairs[0])[0]}`,
                `${hasTwoPairs[0]} ${rankCounter.get(hasTwoPairs[0])[1]}`,
                `${hasTwoPairs[1]} ${rankCounter.get(hasTwoPairs[1])[0]}`,
                `${hasTwoPairs[1]} ${rankCounter.get(hasTwoPairs[1])[1]}`
            );
            for (const rank of keys) {
                if (rank != "A" && rank != usedRank && rank != hasTwoPairs[0] && rank != hasTwoPairs[1]) {
                    fiveCardHand.push(`${rank} ${rankCounter.get(rank)[0]}`);
                }
            }
        } else {
            twoCardHand.push(`${hasTwoPairs[1]} ${rankCounter.get(hasTwoPairs[1])[0]}`, `${hasTwoPairs[1]} ${rankCounter.get(hasTwoPairs[1])[1]}`);
            fiveCardHand.push(`${hasTwoPairs[0]} ${rankCounter.get(hasTwoPairs[0])[0]}`, `${hasTwoPairs[0]} ${rankCounter.get(hasTwoPairs[0])[1]}`);

            for (const [rank, value] of rankCounter) {
                if (rankCounter.get(rank).length === 1) fiveCardHand.push(`${rank} ${rankCounter.get(rank)[0]}`);
            }
        }
    }
    return { twoCardHand, fiveCardHand };
}

/**************************
 *
 * SOLVE TRIPS
 *
 **************************/
function solveTrips(hasTrips, hasTripAces, hasKingQueen, hasStraight, hasFlush, rankCounter) {
    const twoCardHand = [];
    const fiveCardHand = [];

    return { twoCardHand, fiveCardHand };
}

/**************************
 *
 * HAS STRAIGHT
 *
 **************************/
function hasStraight(rankCounter, hasJoker) {
    let ranks = [...rankCounter.keys()].map((rank) => rankValue[rank]);
    if (hasJoker && rankCounter.get("A").length === 1) ranks.shift();

    if (ranks.includes(14)) {
        ranks.push(1);
    }

    ranks.reverse();

    const straights = new Set();

    for (let i = 0; i < ranks.length - 3; i++) {
        let straightCount = 1;
        let hasSkip = hasJoker ? 1 : 0;
        let expectedNextRank = ranks[i] + 1;

        for (let j = i + 1; j < ranks.length; j++) {
            if (ranks[j] === expectedNextRank) {
                straightCount++;
                expectedNextRank++;
            } else if (hasSkip && ranks[j] === expectedNextRank + 1) {
                straightCount++;
                hasSkip = 0;
                expectedNextRank += 2;
            } else {
                break;
            }

            if (straightCount === 4 && hasJoker && hasSkip && ranks[i] !== 1) {
                straights.add(ranks[i] - 1);

                if (j === ranks.length - 1 && i === ranks.length - 4) {
                    straights.add(ranks[i]);
                }
            }

            if (straightCount === 5) {
                straights.add(ranks[i]);
                break;
            }
        }
    }

    return straights.size > 0 ? [...straights] : false;
}

/**************************
 *
 * HAS FLUSH
 *
 **************************/
function hasFlush(suitCounter, hasJoker) {
    for (const [suit, value] of suitCounter) {
        const count = suitCounter.get(suit).length;

        if (count >= 5 || (hasJoker && count === 4)) {
            return suit;
        }
    }
    return false;
}

/**************************
 *
 * SORT
 *
 **************************/
function sort(hand) {
    const handCopy = [...hand];
    return handCopy.sort((a, b) => {
        if (a === "A J") return -1; // Joker always comes first
        if (b === "A J") return 1; // Joker always comes first

        const rankA = a.split(" ")[0];
        const suitA = a.split(" ")[1];

        const rankB = b.split(" ")[0];
        const suitB = b.split(" ")[1];

        if (rankValue[rankA] !== rankValue[rankB]) {
            // Primary comparison by rank
            return rankValue[rankB] - rankValue[rankA];
        } else {
            // Secondary comparison by suit if ranks are equal
            return suitValue[suitB] - suitValue[suitA];
        }
    });
}

export { shuffle, generateHands, FULL_DECK, solve, sort };
