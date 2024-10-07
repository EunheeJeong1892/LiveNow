import React, {ReactNode, useRef, useState} from 'react';
import styles from "../css/common.module.css";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {progressBarVisibleAtom, wordsAtom} from "../atoms";
import {WordProps} from "../types/types";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const IntroModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    if (!isOpen) return null; // 모달이 열려있지 않으면 아무것도 렌더링하지 않음

    const goToNextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const goToPreviousSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const slides = [
        <div className={styles.introModalBox}>
            <div>나의 문장이 그의 시각으로<br />새로 쓰이는 순간 |</div>
            <div>내가 쓴 글이 다른 사람에게는 어떻게 보일까? 우리가 지금 같은 이야기를 하고 있을까? writeNow는 위의 질문에 대한 답을 찾아가는 과정입니다. 메인에 주어지는 질문에 답하는 글을 써보세요. 다른 사용자가 이미지와 함께 등록한 단어가 사용되면 화면 내에 해당 이미지가 떠오릅니다. 글을 완성했다면 우측 하단의 버튼을 눌러주세요. 타인의 시선-사진이 배경이 되어 내가 작성한 글을 감상하는 슬라이드 애니메이션이 재생됩니다. 애니메이션이 종료된 후 나의 글은 readNow에 저장되며 화면에는 새로운 질문이 주어집니다.</div>
        </div>,
        <div className={styles.introModalBox}>
            <img src={"img_intro_slide2.png"}/>
            <div>한 단어에 여러가지 이미지가 등록되어 있다면 위와 같이 겹쳐진 카드 모양으로 보여집니다. 클릭하여 여러 사람들의 이미지를 감상하고 가장 마음에 와닿았던 이미지를 찾아보세요. 글을 완성하는 순간, 카드 꾸러미의 가장 위에 올라온 이미지가 최종 선택됩니다.</div>
        </div>,
        <div className={styles.introModalBox}>
            <div><span className={styles.underline}>문장</span>과 <span className={styles.underline}>단어</span>로 연결되는 <span className={styles.underline}>우리</span><br/>모두의 <span className={styles.underline}>기록</span>
            </div>
            <div>readNow에서는 writeNow에서 쓰였던 글을 모두 모아볼 수 있습니다. 글을 쓰는 동안 이미지를 불러왔던 단어는 readNow에서는 하이퍼 텍스트가 됩니다. 단어를 클릭하면 같은 단어로 쓰인 다른 글로 랜덤하게 이동하며 마우스를 단어 위로 가져가면 단어에 저장된 이미지를 볼 수 있습니다. 글이 쓰인 후 등록된 이미지와 단어는 이전에 쓰인 기록에 반영되지 않습니다. 지금 여기를 거쳐간 사람들은 어떤 기록을 남겼는지. 나와 같은 단어를 사용한 사람은 어떤 글을 썼는지 읽어보세요!</div>
        </div>,
        <div className={styles.introModalBox}>
            <div>내가 그를 궁금해 하는만큼,<br/>그도 내가 궁금할테니.</div>
            <div>라이브러리는 다른 사용자가 등록한 단어-이미지를 둘러볼 수 있는 공간입니다. 다른 사용자가 등록한 이미지 전체를 톺아보는 것도, 검색어를 입력해 특정 단어에 등록된 이미지만 찾아보는 것도 가능합니다. 등록된 이미지 카드를 클릭하여 이미지에 등록된 단어와 그에 대한 설명을 읽어볼 수 있습니다. 사전적 의미가 아닌 다른 이의 일상 속에서 새롭게 정의되는 단어의 뜻을 읽어보세요. 나누고 싶은 단어가 있다면 우측 하단의 + 버튼을 눌러 나의 단어와 이미지도 함께 추가해보세요. 내가 그를 궁금해 하는만큼, 그도 내가 궁금할테니까요.</div>
        </div>,
    ];

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()} className={styles.introModal}>
               <div>
                {slides[currentSlide]} {/* Only render the current slide */}
               </div>
                {currentSlide > 0 && (
                    <img width={340} src={"ic_arrow_left.svg"} onClick={goToPreviousSlide} className={styles.introModalArrowLeft}/>
                )}
                {currentSlide < slides.length - 1 && (
                    <img src={"ic_arrow_right.svg"} onClick={goToNextSlide} className={styles.introModalArrowRight}/>
                )}
                {currentSlide === slides.length - 1 && (
                    <img src={"ic_arrow_exit.svg"} onClick={onClose} className={styles.introModalArrowRight}/>
                )}
                <img src={"ic_modal_close.svg"} onClick={onClose} className={styles.introModalCloseBtn} alt={"닫기"}/>
            </div>
        </div>
    );
};

export default IntroModal;