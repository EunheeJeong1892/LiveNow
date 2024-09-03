import React from 'react';
import styles from "../css/common.module.css";
import Header from "../components/header";
import {Helmet} from "react-helmet-async";

function LiveNow() {
    return (
        <>
        <Header title={"liveNow"} />
        <Helmet>
            <title>Live Now</title>
        </Helmet>
        <h3>LiveNow는 준비중...</h3>

</>
)
    ;
}

export default LiveNow;
