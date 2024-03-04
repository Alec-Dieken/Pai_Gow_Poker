import Image from "next/image";

export default function MainTitle() {
    return (
        <div className="title flex flex-row gap-x-4 items-center text-nowrap">
            <Image src="/suits/spades.svg" alt="Spade" width={54} height={60} />
            <Image src="/suits/hearts.svg" alt="Heart" width={60} height={60} />
            <h1 className="text-6xl text-white">Pai Gow Poker Training</h1>
            <Image src="/suits/clubs.svg" alt="Club" width={60} height={60} />
            <Image src="/suits/diamonds.svg" alt="Diamond" width={60} height={60} />
        </div>
    );
}
