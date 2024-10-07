import React, {useEffect, useRef, useState} from 'react';
import styles from "../css/common.module.css";
import {ReadCardProps, WordsWithImagesProps} from "../types/types";
import {QUESTIONS} from "../constants/constants";
import Outcome from "./outcome";

interface ReadCardWithWordClickProps extends ReadCardProps {
    onWordClick: (event: React.MouseEvent, word: string) => void;  // 단어 클릭 핸들러
    selectedWord: string | null;          // 선택된 단어
    onPlayBtnClick: (message: string, wordsWithImages: WordsWithImagesProps[]) => void; // 추가
}

const ReadCard: React.FC<ReadCardWithWordClickProps> = ({ id, questionId, message, regDate, onClick, isSelected, wordsWithImages,onWordClick,selectedWord,onPlayBtnClick }) => {
    const questionMessage = QUESTIONS.find(q => q.id === questionId)?.message || 'No message found';
    // 메시지를 wordsWithImages를 바탕으로 가공하여 단어에 underline과 tooltip을 추가하는 함수
    const renderMessageWithImages = () => {
        if (!wordsWithImages) return message;

        const result: JSX.Element[] = [];
        let lastIndex = 0;

        wordsWithImages.forEach((wordWithImage, index) => {
            const { word, position, imageSrc } = wordWithImage;

            // 단어의 시작 위치가 lastIndex보다 크면 중간 텍스트를 추가
            if (position > lastIndex) {
                const textBefore = message.slice(lastIndex, position); // 이미지가 없는 중간 텍스트
                result.push(<span key={`text-${lastIndex}`}>{textBefore}</span>);
            }

            // 언더라인 처리된 단어 추가
            result.push(
                <span key={`word-${index}`} className={styles.wordWithImage}>
                <span className={styles.readCardUnderline}
                      onClick={(event) => onWordClick(event, word)}
                >
                        {word}
                    {/* 툴팁을 마우스 오버 시 표시 */}
                    <div className={styles.readCardImageTooltip}>
                            <img src={imageSrc} alt="Image Tooltip"/>
                        </div>
                    </span>
            </span>
            );

            // 단어 이후로 lastIndex 업데이트
            lastIndex = position + word.length;
        });

        // 마지막 단어 이후의 텍스트 처리
        if (lastIndex < message.length) {
            const remainingText = message.slice(lastIndex);
            result.push(<span key={`remaining-${lastIndex}`}>{remainingText}</span>);
        }

        return result;
    };

    const handlePlayBtn = (event: React.MouseEvent) => {
        event.stopPropagation(); // 다른 클릭 이벤트가 발생하지 않도록 차단
        if(wordsWithImages){
            onPlayBtnClick(message, wordsWithImages); // 메시지와 단어 이미지 정보를 부모로 전달
        }
        else{
            onPlayBtnClick(message,[])
        }

    };

    return (
        <>
        <div
             className={`${styles.readCardContainer} ${isSelected ? styles.readCardSelected : ''}`}
             onClick={onClick}>
            <div className={styles.readCardHeader}>
                <div className={styles.readCardQuestion}>{questionMessage}</div>
                <div className={styles.readCardDate}>{regDate}</div>
                <svg onClick={handlePlayBtn} className={`${styles.readCardPlayBtn} ${styles.playButton}`} xmlns="http://www.w3.org/2000/svg"
                     width="62" height="62" viewBox="0 0 62 62" fill="none">
                    <g filter="url(#filter0_d_426_846)">
                        <circle className={styles.circle} cx="31" cy="27" r="23"/>
                        <path
                            d="M42.5187 25.9406C43.1892 26.3247 43.1892 27.2918 42.5187 27.676L27.1303 36.4922C26.4637 36.8742 25.6332 36.3928 25.6332 35.6245L25.6332 17.992C25.6332 17.2237 26.4637 16.7424 27.1303 17.1243L42.5187 25.9406Z"
                            fill="white"/>
                    </g>
                    <defs>
                        <filter id="filter0_d_426_846" x="0" y="0" width="62" height="62"
                                filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feColorMatrix in="SourceAlpha" type="matrix"
                                           values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset dy="4"/>
                            <feGaussianBlur stdDeviation="4"/>
                            <feComposite in2="hardAlpha" operator="out"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_426_846"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_426_846"
                                     result="shape"/>
                        </filter>
                    </defs>
                </svg>
            </div>
            <div
                className={`${styles.readCardBody} ${isSelected ? styles.readCardBodySelected : ''}`}>{renderMessageWithImages()}</div>
        </div>
    </>
    );
};

export default ReadCard;
