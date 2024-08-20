
export interface ReadCardProps {
    id : number;
    questionId : number;
    message : string;
    regDate : string;
}


type TitleType = "typeNow" | "liveNow" | "readNow";
export interface HeaderProps {
    title: TitleType;
}

