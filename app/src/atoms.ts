import { atom } from 'recoil';
import {WordProps} from "./types/types";

export const answersAtom = atom<any[]>({
    key: 'answersAtom', // 고유한 키
    default: [], // 기본값
});

export const wordsAtom = atom<WordProps[]>({
    key: 'wordsAtom',
    default: []
});


export const progressBarVisibleAtom = atom({
    key: 'progressBarVisible',
    default: false,
});