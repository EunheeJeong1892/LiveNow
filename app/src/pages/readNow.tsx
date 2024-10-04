import React, {useEffect, useRef, useState} from 'react';
import Header from "../components/header";
import styles from "../css/common.module.css";
import {WordsWithImagesProps} from "../types/types";
import ReadCard from "../components/readCard";
import {Helmet} from "react-helmet-async";
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

    const [selectedWord, setSelectedWord] = useState<string | null>(null); // 클릭된 단어 상태

    // 특정 단어 클릭 시 호출되는 함수
    const handleWordClick = (event: React.MouseEvent, clickedWord: string) => {
        event.stopPropagation();
        setSelectedWord(clickedWord); // 선택된 단어 저장
        let matchedIdxes = new Array()
        // 현재 클릭된 카드 이외의 다른 카드들 중 해당 단어가 포함된 카드를 찾기
        cards.forEach((card,idx) => {
            if(card.wordsWithImages?.some(
                (wordWithImage: WordsWithImagesProps) => wordWithImage.word === clickedWord // 동일한 단어가 있는지 확인
            )){
                matchedIdxes.push(idx)
            }
        })
        if (matchedIdxes.length > 0) {
            const randomNum = Math.floor(Math.random() * matchedIdxes.length)
            handleCardClick(matchedIdxes[randomNum])
        }
    };


    return (
        <div>
            <Header title={"readNow"} />
            <Helmet>
                <title>Read Now</title>
            </Helmet>
            <div ref={listContainerRef} className={styles.readCardList}>
                {cards.map((card, idx) => {
                    return (<ReadCard
                            key={idx}
                            id={idx}
                            questionId={card.questionID}
                            message={card.message}
                            regDate={card.registDate}
                            wordsWithImages={card.wordsWithImages}
                            onClick={() => handleCardClick(idx)} // 카드 클릭 시 호출
                            isSelected={selectedCardId === idx} // 선택된 카드인지 여부 전달
                            onWordClick={handleWordClick} // 단어 클릭 핸들러 전달
                            selectedWord={selectedWord} // 현재 선택된 단어 전달
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default ReadNow;
