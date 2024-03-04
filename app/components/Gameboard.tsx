"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import Playerhand from "./Playerhand";
import { generateHands, solve, sort } from "../utility/utils";

export default function Gameboard() {
    const [hasDealerHand, setHasDealerHand] = useState(false);
    const [dealerHandMode, setDealerHandMode] = useState("fixed");
    const [dealerHandType, setDealerHandType] = useState("random");
    const [hoverForAnswer, setHoverForAnswer] = useState(true);
    const [playerAnswer, setPlayerAnswer] = useState(true);
    const [playerHandType, setPlayerHandType] = useState("random");
    const [alwaysHasJoker, setAlwaysHasJoker] = useState(false);
    const [currentPlayerHand, setCurrentPlayerHand] = useState<Hand>([]);
    const [currentDealerHand, setCurrentDealerHand] = useState<Hand>([]);
    const [handHistory, setHandHistory] = useState(true);
    const [solved, setSolved] = useState({});

    type Card = string;
    type Hand = Card[];

    function getHandsHandler() {
        const { playerHand, dealerHand } = generateHands(hasDealerHand, dealerHandMode, dealerHandType, playerHandType, alwaysHasJoker);
        if (playerHand.length === 7) {
            setCurrentPlayerHand(playerHand);
        }
        if (dealerHand.length === 7) {
            setCurrentDealerHand(dealerHand);
        }

        setSolved(solve(playerHand));
    }

    function addKeyEventListeners() {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowRight") {
                getHandsHandler();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }

    useEffect(() => {
        getHandsHandler();
    }, [hasDealerHand, dealerHandMode, dealerHandType, playerHandType, alwaysHasJoker]);

    useEffect(() => {
        addKeyEventListeners();
    }, []);

    return (
        <>
            <div className="gameboard w-screen h-screen flex items-center justify-center">
                <Playerhand handArray={currentPlayerHand} hoverForAnswer={true} solved={solved} />
            </div>
        </>
    );
}
