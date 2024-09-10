import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";

import TypeNow from "./pages/typeNow";
import LiveNow from "./pages/liveNow";
import ReadNow from "./pages/readNow";
import {HelmetProvider} from "react-helmet-async";
import Intro from "./pages/intro";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {answersAtom, progressBarVisibleAtom, wordsAtom} from "./atoms";
import FullScreenProgressBar from "./components/FullScreenProgressBar";

function App() {

    const setAnswerList = useSetRecoilState(answersAtom);
    const setWordList = useSetRecoilState(wordsAtom)
    const isVisible = useRecoilValue(progressBarVisibleAtom);

    useEffect(() => {
        const fetchAnnwers = async () => {
            try {
                const response = await fetch('https://tqx65zlmb5.execute-api.ap-northeast-2.amazonaws.com/Answers');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                // Recoil Atom에 데이터 저장
                setAnswerList(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchWords = async () => {
            try {
                const response = await fetch('https://gpzyo7nv2d.execute-api.ap-northeast-2.amazonaws.com/ReadNow');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setWordList(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchAnnwers();
        fetchWords();
    }, [setAnswerList,setWordList]);

  return (
          <HelmetProvider>
              <FullScreenProgressBar isVisible={isVisible} />
          <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/intro" />} />
                <Route path="/intro" element={<Intro />} />
                <Route path="/typeNow" element={<TypeNow />} />
                <Route path="/liveNow" element={<LiveNow />} />
                <Route path="/readNow" element={<ReadNow />} />
            </Routes>
          </BrowserRouter>
          </HelmetProvider>
  );
}

export default App;
