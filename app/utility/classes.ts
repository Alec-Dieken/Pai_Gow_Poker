type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
type Suit = 'S' | 'H' | 'D' | 'C' | 'J';
type SuitSymbol = 'S' | 'H' | 'D' | 'C';

const rankValue: { [key in Rank]: number } = {
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
};

const suitValue: { [key in Suit]: number } = {
    'J': 5,
    'S': 4,
    'H': 3,
    'D': 2,
    'C': 1,
};

const cardSymbol: { [key in SuitSymbol]: string} = {
    'S': '♠',
    'H': '♥',
    'D': '♦',
    'C': '♣',
}

class Card {
    readonly rank: Rank;
    readonly suit: Suit;
    readonly symbol?: string;
    readonly isJoker: boolean;
    readonly rankValue: number;
    readonly suitValue: number;

    constructor(rank: Rank, suit: Suit) {
        this.rank = rank;
        this.suit = suit;
        this.symbol = cardSymbol[suit as SuitSymbol];
        this.isJoker = rank === 'A' && suit === 'J' ? true : false;
        this.rankValue = rankValue[rank];
        this.suitValue = suitValue[suit];
    }

    toString(useSymbols: boolean = false): string {
        if(this.isJoker) return "JO";
        return useSymbols && this.symbol ? `${this.rank}${this.symbol}` : `${this.rank}${this.suit}`;
    }

    getSvgPath() {
        return `/cards/${this.rank}${this.suit}.svg`;
    }
}

class Deck {
    // COMING SOON
}

class Hand {
    // COMING SOON
}