import React, {useEffect, useState} from 'react';
import styles from "../css/common.module.css";
import {useLocation} from "react-router-dom";
import {HeaderProps} from "../types/types";

const Header: React.FC<HeaderProps> = ({ title }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMenu, setCurrentMenu] = useState('typeNow');
    const menus = [
        { id: 'typeNow', src: 'logo_typeNow.svg' },
        { id: 'liveNow', src: 'logo_liveNow.svg' },
        { id: 'readNow', src: 'logo_readNow.svg' },
    ];
    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const location = useLocation();

    useEffect(() => {
        // URL 경로에서 currentMenu 값을 추출
        const path = location.pathname.substring(1); // 첫 번째 '/'를 제거하고 경로를 가져옴
        setCurrentMenu(path);
    }, [location]);

    return (
        <header className={styles.header}>
            <div
                className={`${styles.menuWrapper} ${isOpen ? styles.open : ''}`}
                onClick={handleClick}
            >
                <div className={styles.menuIcon}></div>
            </div>
            {isOpen && (
                <div>
                    {menus
                        .filter(menu => menu.id !== currentMenu)
                        .map(menu => (
                            <img key={menu.id} src={menu.src} alt={menu.id} />
                        ))}
                </div>
            )}
            {!isOpen && (
                <div>
                    {menus
                        .filter(menu => menu.id === currentMenu)
                        .map(menu => (
                            <img key={menu.id} src={menu.src} alt={menu.id} />
                        ))}
                </div>
            )}
</header>
)
    ;
};

export default Header;
