import React, {useEffect, useRef, useState} from 'react';
import styles from "../css/common.module.css";
import Header from "../components/header";
import {Helmet} from "react-helmet-async";
import {WordProps} from "../types/types";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {wordsAtom} from "../atoms";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import AddWordModal from "../components/addWordModal";

function LiveNow() {
    const [inputText, setInputText] = useState<string>(""); // 상태로 텍스트 관리
    const searchDiv = useRef<HTMLInputElement>(null);
    const setWordsAtom = useSetRecoilState(wordsAtom);
    const words = useRecoilValue(wordsAtom);
    const [filteredWords, setFilteredWords] = useState<WordProps[]>(words); // 필터된 이미지 상태
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);  // 입력된 값을 상태로 설정
    };

    useEffect(() => {
        checkText()
    }, [inputText]);

    // 처음 페이지가 로드될 때 words 데이터를 가져와서 Recoil 상태에 저장
    useEffect(() => {
        const fetchWords = async () => {
            try {
                const response = await fetch('https://gpzyo7nv2d.execute-api.ap-northeast-2.amazonaws.com/ReadNow');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setWordsAtom(data);  // 데이터 가져와서 Recoil 상태에 저장
                setFilteredWords(data)
            } catch (error) {
                console.error("Error loading words:", error);
            }
        };

        fetchWords();  // 데이터 가져오기
    }, [setWordsAtom]);  // `setWordsAtom`이 변경될 때만 useEffect가 실행


    const checkText = () => {
        const filtered = words.filter((word) => word.word.includes(inputText.trim()));
        setFilteredWords(filtered);
    };
    return (
        <>
            <Header title={"liveNow"}/>
            <Helmet>
                <title>Live Now</title>
            </Helmet>
            <div className={styles.typeNowContainer}>
                <input type={"text"} onChange={handleInput} placeholder={`검색어를 입력하세요.`} ref={searchDiv} className={`${styles.liveNowSearch} ${inputText ? styles.liveNowSearchActive : ''}`} />
                <div className={styles.gridWrapper} >
                    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}>
                        <Masonry gutter="38px">
                            {filteredWords.length > 0 ? (
                                filteredWords.map((word) => (
                                    <div key={word.word} className={styles.gridItem}>
                                        <img
                                            src={`https://daqsct7lk85c0.cloudfront.net/public/words/${word.link}`}
                                            alt={word.word}
                                            className={styles.gridImage}
                                        />
                                        <div className={styles.liveNowImageContent}>
                                            <div className={styles.liveNowImageWord}>{word.word}</div>
                                            <div className={styles.liveNowImageDesc}>{word.description}</div>
                                        </div>
                                    </div>
                                ))
                            ) :
                                (
                                <p>아직 등록되지 않은 단어입니다.<br/>아래의 + 버튼을 눌러 처음으로 단어를 등록해보세요!</p>
                            )}
                        </Masonry>
                    </ResponsiveMasonry>
                </div>
            </div>
            <div onClick={openModal} className={styles.floatAddBtn}>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <line y1="17" x2="36" y2="17" stroke="black" strokeWidth="2"/>
                    <line x1="19" y1="4.37114e-08" x2="19" y2="36" stroke="black" strokeWidth="2"/>
                </svg>
            </div>
            <AddWordModal isOpen={isModalOpen} onClose={closeModal}></AddWordModal>
        </>
    )
        ;
}

export default LiveNow;
