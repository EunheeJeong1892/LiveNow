import React, {useEffect, useState} from 'react';
import styles from "../css/common.module.css";
import {useLocation, useNavigate} from "react-router-dom";
import {HeaderProps} from "../types/types";


const Header: React.FC<HeaderProps> = ({ title }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMenu, setCurrentMenu] = useState('typeNow');
    const menus = [
        { id: 'typeNow', src: 'logo_typeNow.svg' },
        { id: 'liveNow', src: 'logo_liveNow.svg' },
        { id: 'readNow', src: 'logo_readNow.svg' },
    ];
    const handleHamburgerMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleMenu = (menuId:string) => {
        setCurrentMenu(menuId)
    }
    const location = useLocation();
    const navigate = useNavigate(); // useNavigate 훅 사용
    useEffect(() => {
        const path = location.pathname.substring(1); // 첫 번째 '/'를 제거하고 경로를 가져옴
        setCurrentMenu(path);
    }, [location]);

    useEffect(() => {
        if (currentMenu) {
            navigate(`/${currentMenu}`);
        }
    }, [currentMenu, navigate]);


    return (
        <header className={styles.header}>
            <div
                className={`${styles.menuWrapper} ${isOpen ? styles.open : ''}`}
                onClick={handleHamburgerMenu}
            >
                <div className={styles.menuIcon}></div>
            </div>
            {isOpen && (
                <div>
                    {menus
                        .filter(menu => menu.id !== currentMenu)
                        .map(menu => (
                            <img onClick={() => handleMenu(menu.id)} key={menu.id} src={menu.src} alt={menu.id} />
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