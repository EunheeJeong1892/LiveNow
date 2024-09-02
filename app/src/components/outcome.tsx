import React, {useEffect, useState} from 'react';
import styles from "../css/common.module.css";

interface OutcomeProps {
    message: string,
    images: string[];  // 이미지 URL 배열
}

const Outcome: React.FC<OutcomeProps> = ({ message, images }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (images.length === 0) return; // 이미지가 없으면 아무 것도 하지 않음

        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // 3초마다 이미지 변경

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 클리어
    }, [images]);

    return (
        <div className={styles.outcome}>
            <div className={styles.fullscreenContainer}>
                {images.length > 0 && (
                    <img
                        src={images[currentImageIndex]}
                        alt="Slideshow"
                        className={styles.fullscreenImage}
                    />
                )}
                <div className={styles.subtitle} dangerouslySetInnerHTML={{__html: message}}/>
            </div>
        </div>
    );
};


export default Outcome;