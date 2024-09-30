import React, {useEffect, useRef, useState} from 'react';
import styles from "../css/common.module.css";
import { useNavigate } from 'react-router-dom';
import {UnderlinedWord, WordProps} from "../types/types";

interface OutcomeProps {
    message: string,
    images: UnderlinedWord[];  // 이미지 URL 배열
}


const musicTracks = [
    "Allégro - Emmit Fenn.mp3",
    "Bittersweet Waltz - Sir Cubworth.mp3",
    "Bucolic Acrylic - Dan Bodan.mp3",
    "Ceremonial Library - Asher Fulero.mp3"
];

const Outcome: React.FC<OutcomeProps> = ({ message, images }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [sliderEnded, setSliderEnded] = useState(false); // 슬라이더 종료 상태를 추적
    const [showBlackScreen, setShowBlackScreen] = useState(false); // 검정 화면 표시 상태
    const audioRef = useRef(new Audio()); // Audio 객체를 useRef로 관리
    const [currentBgmTitle, setCurrentBgmTitle] = useState<string>("");

    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅
    useEffect(() => {
        playRandomMusic()
        if (images.length === 0) {
            setShowBlackScreen(true)
            // 이미지가 없을 때 3초 후 검정 화면 숨기기
            const timeout = setTimeout(() => {
                navigate(0);
            }, 3000); // 3초 후

            return () => clearTimeout(timeout); // 컴포넌트 언마운트 시 타이머 클리어
        }
        if (sliderEnded) {
            navigate(0); // 슬라이더가 끝난 후 이동
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
        }, 3000); // 3초마다 이미지 변경

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 클리어
    }, [images, navigate, sliderEnded]); // images, navigate, sliderEnded에 의존

    const getCurrentPosition = () => {
        if(images.length === 0) return 0
        if(images.length === 1) return message.length
        if(currentImageIndex === images.length -1){
            let image = images[currentImageIndex]
            return image.position + image.word.length
        }
        else{
            return images[currentImageIndex+1].position
        }
    }

    const renderMessageWithColor = () => {
        const position = getCurrentPosition()
        const coloredText = message.slice(0, position).replace(/./g, (char) => `<span style="color: #C5FFB0;text-decoration: underline;text-decoration-color:#C5FFB0;">${char}</span>`);
        const remainingText = message.slice(position); // 나머지 텍스트

        // 색칠된 텍스트와 나머지 텍스트를 합쳐서 반환
        return (
            <span dangerouslySetInnerHTML={{ __html: coloredText + remainingText }} />
        );
    };

    const playRandomMusic = () => {
        const randomIndex = Math.floor(Math.random() * musicTracks.length);
        const selectedTrack = `https://daqsct7lk85c0.cloudfront.net/public/bgm/${musicTracks[randomIndex]}`;
        setCurrentBgmTitle(musicTracks[randomIndex]);
        console.log(currentBgmTitle)
        // Pause the current audio and reset its src
        audioRef.current.pause();
        audioRef.current.src = selectedTrack;
        audioRef.current.play();
    };



    return (
        <div className={styles.outcome}>
            {showBlackScreen ? ( // 검정 화면 표시 여부에 따라 분기
                <div style={{
                    backgroundColor: 'black',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div className={styles.subtitle}>
                        {message}
                    </div>
                </div>
            ) : (
                <div className={styles.fullscreenContainer}>
                    {images.length > 0 && (
                        <img
                            src={images[currentImageIndex].imageSrc}
                            alt="Slideshow"
                            className={styles.fullscreenImage}
                        />
                    )}
                    <div className={styles.subtitle}>
                        {renderMessageWithColor()} {/* 색상이 변경된 메시지 표시 */}
                    </div>
                </div>
            )}
            <div className={styles.musicWrapper}>
                <img src={"ic_music_play.svg"} onClick={playRandomMusic} alt="Play"/>
                <img src={"ic_music_skip.svg"} onClick={playRandomMusic} alt="Skip"/>
            </div>
        </div>
    );
};


export default Outcome;