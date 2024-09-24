import React, {ReactNode, useRef, useState} from 'react';
import styles from "../css/common.module.css";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {progressBarVisibleAtom, wordsAtom} from "../atoms";
import {WordProps} from "../types/types";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddWordModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const wordDiv = useRef<HTMLInputElement>(null);
    const descDiv = useRef<HTMLTextAreaElement>(null);
    const fileDiv = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // 선택된 파일 상태
    const [uploading, setUploading] = useState(false); // 업로드 상태
    const setWordsAtom = useSetRecoilState(wordsAtom);
    const setProgressBarVisible = useSetRecoilState(progressBarVisibleAtom);

    if (!isOpen) return null; // 모달이 열려있지 않으면 아무것도 렌더링하지 않음

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file); // 이미지 파일만 허용
        } else {
            alert("이미지 파일만 첨부할 수 있습니다.");
        }
    };

    const handleSave = async () => {
        const word = wordDiv.current?.value;
        const desc = descDiv.current?.value;

        if (word && desc && selectedFile) {
            setUploading(true);

            try {
                setProgressBarVisible(true);
                // 1. S3 업로드 URL 가져오기 (Lambda에서 presigned URL 생성)
                const presignedUrlResponse = await fetch(
                    'https://gpzyo7nv2d.execute-api.ap-northeast-2.amazonaws.com/SaveToS3', // API Gateway URL
                    {
                        method: 'POST',
                        body: JSON.stringify({
                            fileName: selectedFile.name,
                            fileType: selectedFile.type,
                        }),
                    }
                );
                const { presignedUrl, fileUrl } = await presignedUrlResponse.json();

                console.log(presignedUrl)

                // 2. S3로 파일 업로드
                await fetch(presignedUrl, {
                    method: 'PUT',
                    body: selectedFile,
                    headers: {
                        'Content-Type': selectedFile.type,
                    },
                });

                // 3. DynamoDB에 파일명, 단어, 설명 업로드
                await fetch('https://gpzyo7nv2d.execute-api.ap-northeast-2.amazonaws.com/InsertWord', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        word,
                        description: desc,
                        link: selectedFile.name,
                    }),
                });

                const newWord:WordProps = {
                    word:word,
                    description:desc,
                    link:selectedFile.name,
                    registDate:''
                }
                setWordsAtom((prevState: WordProps[]) => [
                    ...prevState,
                    newWord
                ]);

                alert("저장되었습니다!");
                setUploading(false);
                // 저장 완료 후 필드 초기화
                wordDiv.current.value = '';   // wordDiv 초기화
                descDiv.current.value = '';   // descDiv 초기화
                setSelectedFile(null);        // 파일 초기화
                onClose();
            } catch (error) {
                console.error("저장 중 오류 발생:", error);
                setUploading(false);
            } finally {
                setProgressBarVisible(false); // Progress Bar 숨기기
            }
        } else {
            alert("모든 필드를 입력하고 이미지를 첨부해주세요.");
        }
    };

    const handleClick = () => {
        if (fileDiv.current) {
            fileDiv.current.click(); // input 요소의 click() 이벤트를 트리거
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.addWordModal}>
                    <div className={styles.addWordModalHeader}>
                        <div className={styles.addWordModalHeaderTitle}>라이브러리</div>
                        <div onClick={handleSave} className={styles.addWordModalHeaderSave}>저장</div>
                    </div>
                    <div className={styles.addWordModalBody}>
                        <div className={styles.addWordModalInputWrapper}>
                            <input type={`text`} placeholder={`단어`} ref={wordDiv} className={styles.addWordModalInput}/>
                        </div>
                        <div className={styles.addWordModalInputWrapper}>
                            <textarea placeholder={`설명`} ref={descDiv} rows={3}
                                      className={styles.addWordModalTextArea}></textarea>
                        </div>
                    </div>
                    <div>
                        <div className={styles.addWordModalFileUploadHidden}>
                            <input
                                type="file"
                                accept="image/*" // 이미지 파일만 허용
                                onChange={handleFileChange}
                                ref={fileDiv}
                            />
                        </div>
                        {selectedFile ? (
                            <div>첨부된 파일: {selectedFile.name}</div>
                        ) : (
                            <div onClick={handleClick} className={styles.addWordModalFileUpload}>
                                <img src={`ic_fileupload.svg`} alt={`upload`} width={31}/>
                                (첨부 가능한 파일 유형/ 용량 안내)
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddWordModal;