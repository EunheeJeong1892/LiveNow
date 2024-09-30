import React, {useEffect, useState} from 'react';
import styles from "../css/common.module.css";
import {ReadCardProps} from "../types/types";
import {QUESTIONS} from "../constants/constants";


const ReadCard: React.FC<ReadCardProps> = ({ id, questionId, message, regDate, onClick, isSelected, wordsWithImages }) => {
    const [hoveredImage, setHoveredImage] = useState<string | null>(null);  // 툴팁으로 띄울 이미지의 상태

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
                <span
                    className={styles.readCardUnderline}
                    onMouseEnter={() => setHoveredImage(imageSrc)} // 이미지 툴팁 표시
                    onMouseLeave={() => setHoveredImage(null)} // 이미지 툴팁 숨김
                    data-tooltip={imageSrc} // 이미지의 src를 툴팁으로 표시
                >
                    {word}
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

    return (
        <div
             className={`${styles.readCardContainer} ${isSelected ? styles.readCardSelected : ''}`}
             onClick={onClick}>
            <div className={styles.readCardHeader}>
                <div className={styles.readCardQuestion}>{questionMessage}</div>
                <div className={styles.readCardDate}>{regDate}</div>
            </div>
            <div className={`${styles.readCardBody} ${isSelected ? styles.readCardBodySelected : ''}`}>{ renderMessageWithImages()}</div>
            {hoveredImage && (
                <div className={styles.readCardImageTooltip}>
                    <img src={`path_to_images/${hoveredImage}`} alt="Image Tooltip" />
                </div>
            )}
        </div>
    );
};

export default ReadCard;
