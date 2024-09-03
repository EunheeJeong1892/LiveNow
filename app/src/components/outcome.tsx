import React, {useEffect, useState} from 'react';
import styles from "../css/common.module.css";
import { useNavigate } from 'react-router-dom';

interface OutcomeProps {
    message: string,
    images: string[];  // 이미지 URL 배열
}

const Outcome: React.FC<OutcomeProps> = ({ message, images }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [sliderEnded, setSliderEnded] = useState(false); // 슬라이더 종료 상태를 추적
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅
    useEffect(() => {
        if (images.length === 0) return; // 이미지가 없으면 아무 것도 하지 않음
        if (sliderEnded) {
            navigate('/readNow'); // 슬라이더가 끝난 후 이동
            return;
        }

        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % images.length;
                if (nextIndex === 0) {
                    setSliderEnded(true); // 배열의 마지막 이미지에 도달하면 슬라이더 종료 상태로 설정
                }
                return nextIndex;
            });
        }, 30000); // 3초마다 이미지 변경

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 클리어
    }, [images, navigate, sliderEnded]); // images, navigate, sliderEnded에 의존


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