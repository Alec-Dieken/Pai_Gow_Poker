// This code is currently unused, but will eventually replace all of the
// unorganized and repetitive code in utils.js

////////////////////////////////////////////////
// TYPES FOR CONSTRUCTING CLASSES
////////////////////////////////////////////////

/** TypeScript type containing all possible values for Rank type */
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";
/** TypeScript type containing all possible values for Suit type */
type Suit = "S" | "H" | "D" | "C" | "J";
/** TypeScript type containing all possible values for SuitSymbol type */
type SuitSymbol = "S" | "H" | "D" | "C";

////////////////////////////////////////////////
// RANK AND SUIT OBJECTS USED FOR CREATING NEW DECKS
////////////////////////////////////////////////

/** An array of type Rank values. Used for creating new decks in the Deck class. */
const RANKS: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
/** An array of type Suit values. Used for creating new decks in the Deck class. */
const SUITS: Suit[] = ["S", "H", "D", "C"];

////////////////////////////////////////////////
// OBJECTS USED TO MAP SPECIFIC VALUES USED FOR SORTING AND COMPARING HANDS
////////////////////////////////////////////////

/** An object used to map corresponding numerical values based on card rank.
 * Used for sorting and comparing hands */
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

/** An object used to map corresponding numerical values based on card suit.
 * Used for sorting and comparing hands */
const suitValue: { [key in Suit]: number } = {
    J: 5,
    S: 4,
    H: 3,
    D: 2,
    C: 1,
};

////////////////////////////////////////////////
// DEFINE CARD CLASS
////////////////////////////////////////////////
class Card {
    readonly rank: Rank;
    readonly suit: Suit;
    readonly isJoker: boolean;
    readonly rankValue: number;
    readonly suitValue: number;

    // constructor
    constructor(rank: Rank, suit: Suit) {
        this.rank = rank;
        this.suit = suit;
        this.isJoker = rank === "A" && suit === "J" ? true : false;
        this.rankValue = rankValue[rank];
        this.suitValue = suitValue[suit];
    }

    /**
     * Method used to return Card rank and suit as a string.
     * All Jokers => "JO".
     * useSymbols == true => "A♠".
     * useSymbols == false => "AS".
     **/
    toString(useSymbols: boolean = false): string {
        if (this.isJoker) return "JO";
        /** An object used to map corresponding ASCII symbols based on card suit.
         * Used for Card.toString() */
        const cardSymbol: { [key in SuitSymbol]: string } = {
            S: "♠",
            H: "♥",
            D: "♦",
            C: "♣",
        };
        return useSymbols ? `${this.rank}${cardSymbol[this.suit as SuitSymbol]}` : `${this.rank}${this.suit}`;
    }

    /** Returns local path to card's svg file as a string */
    getSvgPath(): string {
        return `/cards/${this.rank}${this.suit}.svg`;
    }
}

////////////////////////////////////////////////
// DEFINE DECK CLASS
////////////////////////////////////////////////
class Deck {
    protected deck: Card[];
    protected cardsInDeck: number;

    // constructor
    constructor() {
        this.deck = [];
        // Try to add 52 regular cards + 1 Joker to deck
        try {
            //add the 52 regular cards
            for (const suit of SUITS) {
                for (const rank of RANKS) {
                    this.deck.push(new Card(rank, suit));
                }
            }
            // add the Joker card at the end
            this.deck.push(new Card("A", "J"));
            // if there aren't 53 cards in the new deck, throw an error
            if (this.deck.length !== 53) throw new Error("Problem initializing deck: ");
        } catch (err: any) {
            console.error(err.message + String(err));
        }
        // additional Deck properties
        this.cardsInDeck = this.deck.length;
    }

    /** Method for shuffling deck in place. Modifies original deck. */
    shuffle(): void {
        let currentIndex = this.cardsInDeck,
            temporaryValue,
            randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = this.deck[currentIndex];
            this.deck[currentIndex] = this.deck[randomIndex];
            this.deck[randomIndex] = temporaryValue;
        }
    }

    removeCard(index: number): void {
        try {
            // If index is out of bounds, throw errors
            if (index >= this.cardsInDeck) throw new Error("Value for 'index' is too large: ");
            if (index < 0) throw new Error("Value for 'index' must be greater than or equal to 0: ");

            this.deck.splice(index, 1);
            
            if (this.cardsInDeck - this.deck.length === 1) {
                this.cardsInDeck = this.deck.length;
            } else {
                throw new Error(
                    `There was a problem removing a card. Deck size should be equal to ${this.cardsInDeck - 1}, but it is instead ${this.deck.length}.`
                );
            }
        } catch (err: any) {
            console.error(err.message + String(err));
        }
    }
}

////////////////////////////////////////////////
// DEFINE HAND CLASS
////////////////////////////////////////////////
class Hand {
    // COMING SOON
}
