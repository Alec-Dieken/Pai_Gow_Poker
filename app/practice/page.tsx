import Image from "next/image";
import Link from "next/link";
import Gameboard from "../components/Gameboard";

export default function Practice() {
    return (
        <main>
            <Link className="absolute" href="/">
                <Image className="float-left translate-y-4 translate-x-4" src="/logo/kv_logo.png" alt="Knighted Ventures Logo" width={260} height={50} />
            </Link>
            <Gameboard />
        </main>
    );
}
