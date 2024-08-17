import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import TypeNow from "./pages/typeNow";
import LiveNow from "./pages/liveNow";
import ReadNow from "./pages/readNow";

function App() {
  return (
      <BrowserRouter>
        <Routes>
            <Route path="/typeNow" element={<TypeNow />} />
            <Route path="/liveNow" element={<LiveNow />} />
            <Route path="/readNow" element={<ReadNow />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
