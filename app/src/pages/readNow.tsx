import React, {useEffect, useState} from 'react';
import Header from "../components/header";
import styles from "../css/common.module.css";
import {ReadCardProps} from "../types/types";
import ReadCard from "../components/readCard";
import {Helmet} from "react-helmet-async";
import {QUESTIONS} from "../constants/constants";
function ReadNow() {
    const cards: ReadCardProps[] = [
        {
            id: 1,
            questionId: 1,
            message: '날씨가 맑아서 비가 안 올거라고 생각했는데 갑자기 비가 쏟아졌다. ',
            regDate: '22-04-04'
        },
        {
            id: 2,
            questionId: 2,
            message: '날씨가 맑아서 비가 안 올거라고 생각했는데 갑자기 비가 쏟아졌다. ',
            regDate: '22-04-05'
        },
        {
            id: 3,
            questionId: 3,
            message: '날씨가 맑아서 비가 안 올거라고 생각했는데 갑자기 비가 쏟아졌다. ',
            regDate: '22-04-06'
        }
    ];

    return (
        <>
            <Header title={"readNow"} />
            <Helmet>
                <title>Read Now</title>
            </Helmet>
            <div className={styles.readCardList}>
                {cards.map((card) => {
                    return (<ReadCard
                            key={card.id}
                            id={card.id}
                            questionId={card.questionId}
                            message={card.message}
                            regDate={card.regDate}
                        />
                    );
                })}
            </div>
        </>
    );
}

export default ReadNow;
