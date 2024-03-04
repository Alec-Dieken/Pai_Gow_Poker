import Card from "./Card";

type Card = string;

interface Solved {
    twoCardHand: string[];
    fiveCardHand: string[];
}

interface PlayerhandProps {
    handArray: Card[];
    hoverForAnswer: boolean;
    solved: Solved;
}

const Playerhand: React.FC<PlayerhandProps> = ({ handArray, hoverForAnswer, solved }) => {
    return (
        <>
            {hoverForAnswer && <div></div>}
            <div className={`playerhand flex relative ${hoverForAnswer ? "hover-enable" : ""}`} style={{ width: `${269.28 + 96 * 6}px`, height: "376px" }}>
                {handArray.map((card, index) => {
                    const [rank, suit] = card.split(" ");

                    return <Card translate={index * 96} key={card} rank={rank} suit={suit} />;
                })}
                <div className="solution z-10 w-full bg-slate-500/80 rounded-lg text-white text-4xl text-center">
                    <p className="translate-y-32">
                        {solved["twoCardHand"] &&
                            solved["twoCardHand"].map((str, i) => {
                                return str.replace(" ", "").replace("S", "♠").replace("H", "♥").replace("D", "♦").replace("C", "♣") + " ";
                            })}
                    </p>
                    <p className="translate-y-32">
                        {solved["fiveCardHand"] &&
                            solved["fiveCardHand"].map((str, i) => {
                                return str.replace(" ", "").replace("S", "♠").replace("H", "♥").replace("D", "♦").replace("C", "♣") + " ";
                            })}
                    </p>
                </div>
            </div>
        </>
    );
};

export default Playerhand;
