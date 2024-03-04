import Link from "next/link";

interface ButtonLinkProps {
    to: string;
    text: string;
}

const ButtonLink: React.FC<ButtonLinkProps> = ({ to, text }) => {
    return <Link className="button-link block" href={to}>{text}</Link>;
};

export default ButtonLink;
