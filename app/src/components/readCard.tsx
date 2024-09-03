import React, {useEffect, useState} from 'react';
import styles from "../css/common.module.css";
import {ReadCardProps} from "../types/types";
import {QUESTIONS} from "../constants/constants";


const ReadCard: React.FC<ReadCardProps> = ({ id, questionId, message, regDate, onClick, isSelected }) => {
    const questionMessage = QUESTIONS.find(q => q.id === questionId)?.message || 'No message found';

    return (
        <div
             className={`${styles.readCardContainer} ${isSelected ? styles.readCardSelected : ''}`}
             onClick={onClick}>
            <div className={styles.readCardHeader}>
                <div className={styles.readCardQuestion}>{questionMessage}</div>
                <div className={styles.readCardDate}>{regDate}</div>
            </div>
            <div className={`${styles.readCardBody} ${isSelected ? styles.readCardBodySelected : ''}`}>{message}</div>
        </div>
    );
};

export default ReadCard;
