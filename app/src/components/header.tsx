import React, {useEffect, useState} from 'react';
import styles from "../css/common.module.css";

type TitleType = "TypeNow" | "LiveNow" | "ReadNow";
interface HeaderProps {
    title: TitleType;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMenu, setCurrentMenu] = useState('TypeNow');
    const menus = [
        { id: 'TypeNow', src: 'logo_typeNow.svg' },
        { id: 'LiveNow', src: 'logo_liveNow.svg' },
        { id: 'ReadNow', src: 'logo_readNow.svg' },
    ];
    const handleClick = () => {
        setIsOpen(!isOpen);
    };



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
