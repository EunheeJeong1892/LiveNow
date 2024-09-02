import React, {useEffect, useRef, useState} from 'react';
import ContentEditable from 'react-contenteditable';
import Header from "../components/header";
import styles from "../css/common.module.css";
import {Helmet} from "react-helmet-async";
import {QUESTIONS} from "../constants/constants";
import Outcome from "../components/outcome";

interface PopupImage {
    src: string;
    style: React.CSSProperties;
}

function TypeNow() {
    const placeholders = QUESTIONS.map(o => o.message)
    const editableDiv = useRef<HTMLDivElement>(null);
    const [popupImages, setPopupImages] = useState<PopupImage[]>([]);
    const [displayedWords, setDisplayedWords] = useState<Set<string>>(new Set());
    const [inputText, setInputText] = useState<string>(""); // 상태로 텍스트 관리
    const [isComposing, setIsComposing] = useState(false); // 한글 조합 상태
    const [isEmpty, setIsEmpty] = useState<boolean>(true); // placeholder 표시 여부
    const [showOutcome, setShowOutcome] = useState<boolean>(false); // Outcome 표시 상태
    const [placeholder, setPlaceholder] = useState('');
    const [imagesToShow, setImagesToShow] = useState<string[]>([]); // Outcome에 넘길 이미지 배열

    const [editableHtml, setEditableHtml] = useState<string>(""); // Outcome에 넘길 editable HTML

    useEffect(() => {
        // 5개의 문장 중 하나를 랜덤으로 선택
        const randomPlaceholder =
            placeholders[Math.floor(Math.random() * placeholders.length)];
        setPlaceholder(randomPlaceholder);
    }, []);


    const wordsToImages: { [key: string]: string } = {
        '해': "https://mblogthumb-phinf.pstatic.net/MjAyMDAxMDRfMTE3/MDAxNTc4MTM5MDczOTM5.CcqB70VCSvHm6hXdH7guH65KFtEeC8BQ93W_8i1YQqsg.tm1l70cIbIkIjsWoEabtsIKvno4IJKtrAlakZszKab8g.JPEG.nimbus89/_DSC1140.JPG?type=w800",
        '노래': "https://mmagimg.speedgabia.com/mag/2023/06/knowhow_mic/_music-technology-guitar-microphone-studio-amplifier-846852-pxhere.com.jpg",
        '햇빛': "https://img.khan.co.kr/news/2016/02/03/khan_YkQLTc.jpg",
        '하루': "https://image.musinsa.com/mfile_s01/2017/06/19/193e212e57b58a571be84a838716ff44144200.jpg",
        '푸른': "https://cdn.eroun.net/news/photo/202009/20046_40083_3546.jpg",
        '예쁘다': "path/to/pretty.jpg",
        '심사': "https://cdn.monews.co.kr/news/photo/201908/204245_55073_4314.jpg",
        '심장': "https://www.korea.kr/newsWeb/resources/temp/images/000055/%EC%8B%AC%EC%9E%A5%EB%A7%88%EB%B9%84_%EB%B3%B8%EB%AC%B8.jpg",
        '발표': "https://t2.daumcdn.net/thumb/R720x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/2FUE/image/Wanki2t437f-tCXrbJOKsb13Uws.jpg",
        '화이팅': "https://images.chosun.com/resizer/SRsj79kODbd4cfbNoa1IdC4aZ0k=/616x0/filters:focal(290x112:300x122)/cloudfront-ap-northeast-1.images.arcpublishing.com/chosun/7YVXA3CMCBG3HMNWYMH4CADYEU.jpg",
    };

    useEffect(() => {
        localStorage.removeItem("last-text");
        if (editableDiv.current) {
            editableDiv.current.focus();
        }
    }, []);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        if (!isComposing) {
            setInputText(e.currentTarget.innerText);
            setEditableHtml(e.currentTarget.innerHTML); // HTML 업데이트
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();  // 기본 Enter 동작 방지
            setShowOutcome(true); // Outcome 표시 상태를 true로 설정
        }
    };

    const checkText = () => {
        if (!editableDiv.current) return;

        let formattedText = editableDiv.current.innerText;
        console.log(formattedText)
        setIsEmpty(formattedText.trim() === ""); // 텍스트가 없으면 placeholder 표시
        for (const word in wordsToImages) {
            const regex = new RegExp(`(${word})`, "g");
            formattedText = formattedText.replace(
                regex,
                '<span class="highlight">$1</span>'
            );
            console.log("-")
            console.log(formattedText)
        }

        let originText = editableDiv.current.innerText;
        const words = originText.split(/\s+/);
        words.forEach((word) => {
            console.log(wordsToImages[word])
            if (wordsToImages[word] && !displayedWords.has(word)) {
                showPopupImage(word);
                setDisplayedWords((prev) => new Set(prev).add(word));
            }
        });

        editableDiv.current.innerHTML = formattedText;

        const newImages = words
            .filter((word) => wordsToImages[word] && !displayedWords.has(word))
            .map((word) => wordsToImages[word]);

        if (newImages.length > 0) {
            setImagesToShow((prevImages) => [...prevImages, ...newImages]);
        }
        setCaretToEnd(editableDiv.current);
    };

    const showPopupImage = (word: string) => {
        const randomX = Math.random() * (window.innerWidth - 200);
        const randomY = Math.random() * (window.innerHeight - 200);
        setPopupImages((prev) => [
            ...prev,
            {
                src: wordsToImages[word],
                style: {
                    left: `${randomX}px`,
                    top: `${randomY}px`,
                    display: "block",
                },
            },
        ]);
    };

    const setCaretToEnd = (el: HTMLElement) => {
        const range = document.createRange();
        const sel = window.getSelection();
        if (sel) {
            range.selectNodeContents(el);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
            el.focus();
        }
    };


    return (
        <>
            {showOutcome && <Outcome images={imagesToShow} message={editableHtml} />} {/* Outcome 컴포넌트를 동적으로 렌더링 */}
        <Helmet>
            <title>Type Now</title>
        </Helmet>
        <Header title={"typeNow"}></Header>
            <div className={styles.typeNowContainer}>

                <div
                    id="editable"
                    className={styles.editable}
                    contentEditable="true"
                    onInput={handleInput}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={(e) => {
                        setIsComposing(false);
                        setInputText(e.currentTarget.innerText);
                        setEditableHtml(e.currentTarget.innerHTML); // HTML 업데이트
                        checkText();  // 조합이 끝난 후 `checkText` 호출
                    }}
                    ref={editableDiv}
                    onKeyDown={handleKeyDown}
                    data-placeholder={placeholder}
                ></div>
                <div className="popup" id="popup">
                    {popupImages.map((image, index) => (
                        <img
                            key={index}
                            src={image.src}
                            style={image.style}
                            className={styles.popupImage}
                            alt=""
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

export default TypeNow;
