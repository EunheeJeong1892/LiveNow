import React from 'react';
import styles from "../css/common.module.css";

interface FullScreenProgressBarProps {
    isVisible: boolean;
}

const FullScreenProgressBar: React.FC<FullScreenProgressBarProps> = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.progressBar}></div>
        </div>
    );
};

export default FullScreenProgressBar;