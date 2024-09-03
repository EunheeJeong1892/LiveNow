import React, {useEffect, useRef, useState} from 'react';
import Header from "../components/header";
import styles from "../css/common.module.css";
import {ReadCardProps} from "../types/types";
import ReadCard from "../components/readCard";
import {Helmet} from "react-helmet-async";
import {QUESTIONS} from "../constants/constants";
function ReadNow() {
    const [cards, setCards] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // 로딩 상태 추가
    const listContainerRef = useRef<HTMLDivElement>(null); // 스크롤을 조정할 컨테이너 참조

    const [selectedCardId, setSelectedCardId] = useState<number | null>(null); // 추가된 상태

    const fetchData = async () => {
        setLoading(true); // 데이터 로딩 시작
        try {
            const response = await fetch('https://tqx65zlmb5.execute-api.ap-northeast-2.amazonaws.com/Answers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                // registDate를 기준으로 내림차순 정렬
                const sortedCards = result.sort((a: any, b: any) => new Date(b.registDate).getTime() - new Date(a.registDate).getTime());
                setCards(sortedCards);
            } else {
                console.error('Error fetching data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false); // 데이터 로딩 완료
        }
    };

    // 카드 클릭 핸들러
    const handleCardClick = (id: number) => {
        setSelectedCardId(id); // 클릭된 카드의 ID를 상태로 설정
    };

    useEffect(() => {
        fetchData()
    }, [],);

    useEffect(() => {
        if (!loading && listContainerRef.current) {
            // 데이터가 로드되고 로딩이 끝난 후, 스크롤을 최하단으로 이동
            listContainerRef.current.scrollTop = listContainerRef.current.scrollHeight;
        }
    }, [loading, cards]);

    return (
        <>
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
        </>
    );
}

export default ReadNow;
