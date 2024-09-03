import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {Helmet} from "react-helmet-async";

function Intro() {
    const videoRef = useRef<HTMLVideoElement>(null);

    const navigate = useNavigate(); // useNavigate 훅 사용

    useEffect(() => {
        const videoElement = videoRef.current;

        if (videoElement) {
            videoElement.play()
                .then(() => {
                })
                .catch(error => {
                    console.log(error);
                });

            // 동영상이 끝났을 때 /typeNow 페이지로 리디렉션
            videoElement.onended = () => {
                navigate('/typeNow')
            };
        }
    }, [navigate]);

    return (
        <>
            <Helmet>
                <title>Type Now</title>
            </Helmet>
        <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <video
                ref={videoRef}
                src="https://typenow.s3.ap-northeast-2.amazonaws.com/public/main01.mp4" // 동영상 파일 URL
                style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                playsInline
                controls
            />
        </div>
</>
    );
}

export default Intro;
