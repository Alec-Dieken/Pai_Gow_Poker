import Image from "next/image";
import MainTitle from "./components/MainTitle";
import ButtonLink from "./components/ButtonLink";

export default function Home() {
    return (
        <main>
            <div className="flex flex-col justify-center items-center gap-y-12 w-screen h-screen">
                <div className="flex flex-col justify-center items-center gap-y-2">
                    <Image className="-translate-x-9" src="/logo/kv_logo.png" alt="Knighted Ventures Logo" width={346} height={65} />
                    <MainTitle />
                </div>
                <div className="flex flex-col gap-y-4">
                    <ButtonLink to="/rules" text="Rules" />
                    <ButtonLink to="/practice" text="Practice" />
                    <ButtonLink to="/csa" text="CSA" />
                </div>
            </div>
        </main>
    );
}
