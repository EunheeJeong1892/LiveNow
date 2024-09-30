

export interface ReadCardProps {
    id : number;
    questionId : number;
    message : string;
    regDate : string;
    onClick: () => void;
    isSelected: boolean;
    wordsWithImages: Array<any>;
}


type TitleType = "writeNow" | "liveNow" | "readNow";
export interface HeaderProps {
    title: TitleType;
}

export type WordProps = {
    word:string;
    description:string;
    link:string;
    registDate:string;
}

export interface UnderlinedWord {
    word: string;
    position: number;
    imageSrc: string;
}


