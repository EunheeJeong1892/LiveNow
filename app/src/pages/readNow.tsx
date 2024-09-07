import React, {useEffect, useRef, useState} from 'react';
import Header from "../components/header";
import styles from "../css/common.module.css";
import {ReadCardProps} from "../types/types";
import ReadCard from "../components/readCard";
import {Helmet} from "react-helmet-async";
import {QUESTIONS} from "../constants/constants";
import {useRecoilValue} from "recoil";
import {answersAtom} from "../atoms";
function ReadNow() {
    //const [cards, setCards] = useState<any[]>([]);
    const listContainerRef = useRef<HTMLDivElement>(null); // 스크롤을 조정할 컨테이너 참조
    const [hasScrolled, setHasScrolled] = useState(false); // 첫 실행 여부 저장

    const [selectedCardId, setSelectedCardId] = useState<number | null>(null); // 추가된 상태
    const cards = useRecoilValue(answersAtom);

    // 카드 클릭 핸들러
    const handleCardClick = (id: number) => {
        setSelectedCardId(id); // 클릭된 카드의 ID를 상태로 설정
    };


    useEffect(() => {
        if (cards.length > 0 && !hasScrolled) {
            window.scrollTo({ top: document.body.scrollHeight});
            handleCardClick(cards.length - 1)
            setHasScrolled(true); // 한 번 스크롤 후 true로 변경하여 다시 실행되지 않도록
        }
    }, [cards,hasScrolled,  handleCardClick]);

    return (
        <div ref={listContainerRef}>
            <Header title={"readNow"} />
            <Helmet>
                <title>Read Now</title>
            </Helmet>
            <div className={styles.readCardList}>
                {cards.map((card, idx) => {
                    return (<ReadCard
                            key={idx}
                            id={idx}
                            questionId={card.questionID}
                            message={card.message}
                            regDate={card.registDate}
                            onClick={() => handleCardClick(idx)} // 카드 클릭 시 호출
                            isSelected={selectedCardId === idx} // 선택된 카드인지 여부 전달
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default ReadNow;
