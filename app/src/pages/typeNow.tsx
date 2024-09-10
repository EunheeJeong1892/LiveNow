import React, {useEffect, useRef, useState} from 'react';
import ContentEditable from 'react-contenteditable';
import Header from "../components/header";
import styles from "../css/common.module.css";
import {Helmet} from "react-helmet-async";
import {QUESTIONS} from "../constants/constants";
import Outcome from "../components/outcome";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {answersAtom, progressBarVisibleAtom, wordsAtom} from "../atoms";
import {WordProps} from "../types/types";

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
    const [imagesToShow, setImagesToShow] = useState<WordProps[]>([]); // Outcome에 넘길 이미지 배열
    const [editableHtml, setEditableHtml] = useState<string>(""); // Outcome에 넘길 editable HTML
    const [placeholder, setPlaceholder] = useState('');
    const [placeholderNum, setPlaceholderNum] = useState<number>(0);
    const wordList = useRecoilValue(wordsAtom);
    const [hasSubmitted, setHasSubmitted] = useState(false); // 방어 코드 추가
    const setProgressBarVisible = useSetRecoilState(progressBarVisibleAtom);

    useEffect(() => {
        setPlaceholderNum(Math.floor(Math.random() * placeholders.length))
    }, []); // 빈 배열을 의존성으로 전달하면 처음 한 번만 실행됨

    useEffect(() => {
        setPlaceholder(placeholders[placeholderNum]);
    }, [placeholderNum]);

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
        if (!isComposing && e.key === "Enter") {
            e.preventDefault();  // 기본 Enter 동작 방지
            e.stopPropagation(); // 이벤트 전파 방지
            postAnswer(placeholderNum + 1, inputText);
        }
    };

    const postAnswer = async (questionID:number,message:string) => {
        try {
            if (hasSubmitted) return;
            setProgressBarVisible(true);
            const response = await fetch('https://tqx65zlmb5.execute-api.ap-northeast-2.amazonaws.com/Answers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    questionID,
                    message,
                }),
            });

            if (response.ok) {
                setHasSubmitted(true);
                setShowOutcome(true);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setProgressBarVisible(false); // Progress Bar 숨기기
        }
    };

    const checkText = () => {
        if (!editableDiv.current) return;

        let formattedText = editableDiv.current.innerText;
        setIsEmpty(formattedText.trim() === ""); // 텍스트가 없으면 placeholder 표시

        for(const item of wordList){
            const regex = new RegExp(`(${item.word})`, "g");
            formattedText = formattedText.replace(
                regex,
                '<span style="    text-decoration: underline;    text-decoration-thickness: 2px;\n' +
                '    text-underline-position: under;\n' +
                '    text-decoration-color: #00D364;">$1</span>'
            );
        }

        let originText = editableDiv.current.innerText;
        const words = originText.split(/\s+/);
        words.forEach((word) => {
            const finded:WordProps[] | [] = wordList.filter(o => o.word === word) || []
            if (finded.length > 0 && !displayedWords.has(word)) {
                showPopupImage(word, finded);
                setDisplayedWords((prev) => new Set(prev).add(word));
            }
        });

        editableDiv.current.innerHTML = formattedText;

        const newImages: WordProps[] = words
            .filter((word) => wordList.find(o => o.word === word) && !displayedWords.has(word))
            .map((word) => wordList.find(o => o.word === word)!)
            .filter((item): item is WordProps => item !== undefined); // 타입 보장

        if (newImages.length > 0) {
            setImagesToShow((prevImages) => [...prevImages, ...newImages]);
        }

        setCaretToEnd(editableDiv.current);
    };

    const showPopupImage = (word: string, finded: WordProps[]) => {
        const randomX = Math.random() * (window.innerWidth - 200);
        const randomY = Math.random() * (window.innerHeight - 200);

        setPopupImages((prev) => {
            const baseLeft = randomX;
            const baseTop = randomY;

            const newImages = finded.map((image, index) => ({
                src: `https://daqsct7lk85c0.cloudfront.net/public/words/${image.link}`,
                style: {
                    left: `${baseLeft}px`,  // 이미지가 5px씩 오른쪽으로
                    top: `${baseTop}px`,   // 이미지가 5px씩 아래로
                    transform: index === 0 ? '' : `rotate(5.922deg)`,
                    zIndex: index,                    // 순서대로 z-index 부여
                    display: "block",
                },
            }));

            return [...prev, ...newImages];
        });
    };

    const handleImageClick = (index: number) => {
        setPopupImages((prev) => {
            const clickedImage = prev[index];
            const restImages = prev.filter((_, i) => i !== index);

            return [...restImages, { ...clickedImage, style: { ...clickedImage.style, zIndex: prev.length } }];
        });
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
            {showOutcome && <Outcome images={imagesToShow} message={inputText} />} {/* Outcome 컴포넌트를 동적으로 렌더링 */}
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
                    data-placeholder={`${placeholder}`}
                ></div>
                <div className="popup" id="popup">
                    {popupImages.map((image, index) => (
                        <img
                            key={index}
                            src={image.src}
                            style={image.style}
                            className={styles.popupImage}
                            alt=""
                            onClick={() => handleImageClick(index)}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

export default TypeNow;
