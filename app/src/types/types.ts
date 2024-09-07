
export interface ReadCardProps {
    id : number;
    questionId : number;
    message : string;
    regDate : string;
    onClick: () => void;
    isSelected: boolean;
}


type TitleType = "typeNow" | "liveNow" | "readNow";
export interface HeaderProps {
    title: TitleType;
}

export type WordProps = {
    word:string;
    description:string;
    link:string;
    registDate:string;
}

