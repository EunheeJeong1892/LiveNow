import React, {useEffect, useRef, useState} from 'react';
import Header from "../components/header";
import styles from "../css/common.module.css";
import {Helmet} from "react-helmet-async";
import {QUESTIONS} from "../constants/constants";
import Outcome from "../components/outcome";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {progressBarVisibleAtom, wordsAtom} from "../atoms";
import {UnderlinedWord, WordProps} from "../types/types";
import IntroModal from "../components/introModal";
import {useNavigate} from "react-router-dom";

interface PopupImage {
    src: string;
    style: React.CSSProperties;
}


function WriteNow() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const placeholders = QUESTIONS.map(o => o.message)
    const editableDiv = useRef<HTMLDivElement>(null);
    const [popupImages, setPopupImages] = useState<PopupImage[]>([]);
    const [displayedWords, setDisplayedWords] = useState<Set<string>>(new Set());
    const [inputText, setInputText] = useState<string>(""); // 상태로 텍스트 관리
    const [isComposing, setIsComposing] = useState(false); // 한글 조합 상태
    const [showOutcome, setShowOutcome] = useState<boolean>(false); // Outcome 표시 상태
    const [placeholder, setPlaceholder] = useState('');
    const [placeholderNum, setPlaceholderNum] = useState<number>(0);
    const wordList = useRecoilValue(wordsAtom);
    const [hasSubmitted, setHasSubmitted] = useState(false); // 방어 코드 추가
    const setProgressBarVisible = useSetRecoilState(progressBarVisibleAtom);
    const [underlinedWordsData, setUnderlinedWordsData] = useState<UnderlinedWord[]>([]); // 단어와 이미지 정보 저장

    useEffect(() => {
        setPlaceholder(placeholders[placeholderNum]);
    }, [placeholderNum]);

    useEffect(() => {
        setPlaceholderNum(Math.floor(Math.random() * placeholders.length))
        openModal()

        if (editableDiv.current) {
            editableDiv.current.focus();
        }
    }, []);


    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        if (!isComposing) {
            setInputText(e.currentTarget.innerText);
        }
    };

    const handleEnterBtn = () => {
        postAnswer(placeholderNum + 1, inputText.trim());
    }

    const uniqueWords = (array: UnderlinedWord[]) => {
        const seen = new Set<string>(); // Set to track seen words
        return array.filter((item) => {
            const word = item.word;
            if (seen.has(word)) {
                return false; // If word is already seen, exclude it
            }
            seen.add(word); // Mark word as seen
            return true; // Keep the first occurrence
        });
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
                    wordsWithImages:uniqueWords(underlinedWordsData.sort((a, b) => a.position - b.position))
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
        const plainText = editableDiv.current?.innerText || '';
        let newUnderlinedWordsData: UnderlinedWord[] = []; // 새로운 데이터를 담을 배열

        for(const item of wordList) {
            const regex = new RegExp(`(${item.word})`, "g");
            formattedText = formattedText.replace(
                regex,
                '<span style="border-bottom: 2px solid #00D364;">$1</span>'
            );

            const wordPositions = [...plainText.matchAll(regex)].map(match => match.index);

            if (wordPositions.length > 0) {
                wordPositions.forEach(position => {
                    if (position !== undefined) {
                        newUnderlinedWordsData.push({
                            word: item.word,
                            position, // 단어가 시작하는 위치 (HTML을 제외한 실제 텍스트에서의 위치)
                            imageSrc: `https://daqsct7lk85c0.cloudfront.net/public/words/${item.link}` // 이미지 링크
                        });
                    }
                });
            }
        }

        setUnderlinedWordsData(newUnderlinedWordsData); // 새로운 데이터를 상태로 설정

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
        setCaretToEnd(editableDiv.current);
    };

    const showPopupImage = (word: string, finded: WordProps[]) => {
        const randomX =  Math.max(0,Math.random() * (window.innerWidth - 500));
        const randomY = Math.max(0, Math.random() * (window.innerHeight - 200) - 180);

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
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

    const handleOutcomeEnd = () => {
        navigate(0)
    }

    return (
        <>
            {showOutcome && <Outcome images={underlinedWordsData} message={inputText} endCallback={handleOutcomeEnd}/>} {/* Outcome 컴포넌트를 동적으로 렌더링 */}
            <Helmet>
                <title>Write Now</title>
            </Helmet>
            <Header title={"writeNow"}></Header>
            <div className={styles.typeNowContainer}>
                <div
                    className={`${styles.originalQuestion} ${inputText ? styles.originalQuestionVisible : ''}`}>{placeholder}</div>
                <div
                    id="editable"
                    className={styles.editable}
                    contentEditable="true"
                    onInput={handleInput}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={(e) => {
                        setIsComposing(false);
                        setInputText(e.currentTarget.innerText);
                        checkText();  // 조합이 끝난 후 `checkText` 호출
                    }}
                    ref={editableDiv}
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
            <div onClick={handleEnterBtn} className={styles.floatAddBtn}>
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                    <path d="M2 22.7933L13.6355 34M2 22.7933L13.6355 11.5866M2 22.7933L34 22.7933L34 4.05312e-06"
                          stroke="black" strokeWidth="2"/>
                </svg>
            </div>
            <IntroModal isOpen={isModalOpen} onClose={closeModal}></IntroModal>
        </>
    );
}

export default WriteNow;
