import React, {useEffect, useRef, useState} from 'react';
import ContentEditable from 'react-contenteditable';
import Header from "../components/header";
import styles from "../css/common.module.css";
import {Helmet} from "react-helmet-async";
import {QUESTIONS} from "../constants/constants";
import Outcome from "../components/outcome";
import {useRecoilValue} from "recoil";
import {answersAtom, wordsAtom} from "../atoms";
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
    const [placeholder, setPlaceholder] = useState('');
    const [imagesToShow, setImagesToShow] = useState<WordProps[]>([]); // Outcome에 넘길 이미지 배열
    const [editableHtml, setEditableHtml] = useState<string>(""); // Outcome에 넘길 editable HTML
    const placeholderNum = Math.floor(Math.random() * placeholders.length)
    const wordList = useRecoilValue(wordsAtom);

    useEffect(() => {
        // 5개의 문장 중 하나를 랜덤으로 선택
        const randomPlaceholder =
            placeholders[placeholderNum];
        setPlaceholder(randomPlaceholder);
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
        if (e.key === "Enter") {
            e.preventDefault();  // 기본 Enter 동작 방지
            //postAnswer(placeholderNum+1, inputText)
            setShowOutcome(true);
        }
    };

    const postAnswer = async (questionID:number,message:string) => {
        try {
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
                setShowOutcome(true);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const checkText = () => {
        if (!editableDiv.current) return;

        let formattedText = editableDiv.current.innerText;
        console.log(formattedText)
        setIsEmpty(formattedText.trim() === ""); // 텍스트가 없으면 placeholder 표시

        for(const item of wordList){
            const regex = new RegExp(`(${item.word})`, "g");
            formattedText = formattedText.replace(
                regex,
                '<span style="    text-decoration: underline;    text-decoration-thickness: 2px;\n' +
                '    text-underline-position: under;\n' +
                '    text-decoration-color: #00D364;">$1</span>'
            );
            console.log("-")
            console.log(formattedText)
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

        console.log(newImages)
        if (newImages.length > 0) {
            setImagesToShow((prevImages) => [...prevImages, ...newImages]);
        }

        setCaretToEnd(editableDiv.current);
    };

    const showPopupImage = (word: string, finded : WordProps[]) => {
        const randomX = Math.random() * (window.innerWidth - 200);
        const randomY = Math.random() * (window.innerHeight - 200);
        console.log(finded[0])
        setPopupImages((prev) => [

            ...prev,
            {
                src: `https://daqsct7lk85c0.cloudfront.net/public/words/${finded[0].link}`,
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
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

export default TypeNow;
