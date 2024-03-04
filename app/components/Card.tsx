import Image from 'next/image';
import React from 'react';

type CardProps = {
    translate: number;
    rank: string;
    suit: string;
};

const Card: React.FC<CardProps> = ({ translate, rank, suit }) => {

    const fileName = `${rank}${suit}.svg`;
    const imagePath = `/cards/${fileName}`;

    return (
        <div className={`card absolute`} style={{transform: `translateX(${translate}px)`, filter: 'drop-shadow(-5px 5px 5px rgba(1, 35, 22, 0.25))'}}>
            <Image 
                src={imagePath} 
                alt={`${rank} of ${suit}`} 
                width={374 * 0.72}
                height={374}
            />
        </div>
    );
};

export default Card;
