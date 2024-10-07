import React, {useEffect, useRef, useState} from 'react';
import Header from "../components/header";
import styles from "../css/common.module.css";
import {WordsWithImagesProps} from "../types/types";
import ReadCard from "../components/readCard";
import {Helmet} from "react-helmet-async";
import {useRecoilValue} from "recoil";
import {answersAtom} from "../atoms";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Outcome from "../components/outcome";

function ReadNow() {
    const listContainerRef = useRef<HTMLDivElement>(null); // 스크롤을 조정할 컨테이너 참조
    const slider = useRef<Slider>(null);
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null); // 추가된 상태
    const cards = useRecoilValue(answersAtom);
    const cardLen = cards.length
    const [showOutcome, setShowOutcome] = useState<boolean>(false); // Outcome 표시 상태
    const [outcomeData, setOutcomeData] = useState<{ message: string; wordsWithImages: WordsWithImagesProps[] } | null>(null); // 추가

    // 카드 클릭 핸들러
    const handleCardClick = (id: number) => {
        setSelectedCardId(id); // 클릭된 카드의 ID를 상태로 설정
        if(slider.current) {
            slider.current.slickGoTo(id)
        }
    };

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

    const handlePlayBtn = (event: React.MouseEvent) => {
        event.stopPropagation(); // 다른 클릭 이벤트가 발생하지 않도록 차단
        setShowOutcome(true);
    };

    var settings = {
        dots: false,
        infinite: false,
        autoplay:false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        initialSlide: 1,
        centerMode: true,
        centerPadding: "120px",
    };

    // // 카드가 변경될 때마다 슬라이더를 업데이트
    // useEffect(() => {
    //     if (slider.current && cardLen > 0) {
    //         const initialSlide = Math.max(0, cardLen - 2); // 0보다 작지 않도록 설정
    //         slider.current.slickGoTo(initialSlide); // 슬라이더를 초기화
    //     }
    // }, [cardLen]); // cardLen이 변경될 때마다 호출

    const handlePlayBtnClick = (message: string, wordsWithImages: WordsWithImagesProps[]) => {
        setShowOutcome(true); // Outcome을 보여줌
        // 상태에 데이터 저장 (아래에서 사용할 것)
        setOutcomeData({ message, wordsWithImages });
    };

    return (
        <div>
            {showOutcome && outcomeData && <Outcome images={outcomeData.wordsWithImages} message={outcomeData.message} />} {/* Outcome 컴포넌트를 동적으로 렌더링 */}
            <Header title={"readNow"} />
            <Helmet>
                <title>Read Now</title>
            </Helmet>
            <div ref={listContainerRef} className={styles.readCardList}>
                <Slider {...settings} ref={slider}>


                    {cards.map((card, idx) => {
                        return (
                            <div key={idx} className={styles.readCard}>
                            <ReadCard
                                id={idx}
                                questionId={card.questionID}
                                message={card.message}
                                regDate={card.registDate}
                                wordsWithImages={card.wordsWithImages}
                                onClick={() => handleCardClick(idx)} // 카드 클릭 시 호출
                                isSelected={selectedCardId === idx} // 선택된 카드인지 여부 전달
                                onWordClick={handleWordClick} // 단어 클릭 핸들러 전달
                                selectedWord={selectedWord} // 현재 선택된 단어 전달
                                onPlayBtnClick={handlePlayBtnClick}
                            />
                            </div>
                        );
                    })}
                </Slider>
            </div>
        </div>
    );
}

export default ReadNow;
