import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";

import TypeNow from "./pages/typeNow";
import LiveNow from "./pages/liveNow";
import ReadNow from "./pages/readNow";
import {HelmetProvider} from "react-helmet-async";
import Intro from "./pages/intro";

function App() {
  return (
      <HelmetProvider>
      <BrowserRouter>
        <Routes>
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
