import React, {useEffect, useState} from 'react';
import Header from "../components/header";
import styles from "../css/common.module.css";
function TypeNow() {
    const placeholders = [
            '오늘의 날씨는 어떤가요?',
            '가장 최근에 심장이 빠르게 뛰었던 일을 알려주세요.',
            '이번 계절에 기대하고 있는 일이 있나요?',
            '좋아하는 노래 가사나 문장을 알려주세요.',
            '오늘 어떤 일을 했나요? 혹은 할 건가요?'
    ];

    const [placeholder, setPlaceholder] = useState('');

    useEffect(() => {
        // 5개의 문장 중 하나를 랜덤으로 선택
        const randomPlaceholder =
            placeholders[Math.floor(Math.random() * placeholders.length)];
        setPlaceholder(randomPlaceholder);
    }, []);

    return (
        <>
        <Header title={"TypeNow"}></Header>
        <div className={styles.typeNowContainer}>
            <input className={styles.input} placeholder={placeholder}/>
        </div>
        </>
    );
}

export default TypeNow;
