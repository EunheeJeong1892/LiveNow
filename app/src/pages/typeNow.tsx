import React, {useEffect, useState} from 'react';
import Header from "../components/header";
import styles from "../css/common.module.css";
import {Helmet} from "react-helmet-async";
import {QUESTIONS} from "../constants/constants";
function TypeNow() {
    const placeholders = QUESTIONS.map(o => o.message)

    const [placeholder, setPlaceholder] = useState('');

    useEffect(() => {
        // 5개의 문장 중 하나를 랜덤으로 선택
        const randomPlaceholder =
            placeholders[Math.floor(Math.random() * placeholders.length)];
        setPlaceholder(randomPlaceholder);
    }, []);

    return (
        <>
        <Helmet>
            <title>Type Now</title>
        </Helmet>
        <Header title={"typeNow"}></Header>
        <div className={styles.typeNowContainer}>
            <input className={styles.input} placeholder={placeholder}/>
        </div>
        </>
    );
}

export default TypeNow;
