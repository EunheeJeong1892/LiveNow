import React, {useEffect, useState} from 'react';
import styles from "../css/common.module.css";
import {useLocation, useNavigate} from "react-router-dom";
import {HeaderProps} from "../types/types";


const Header: React.FC<HeaderProps> = ({ title }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [currentMenu, setCurrentMenu] = useState('');
    const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
    const [fadeClass, setFadeClass] = useState('');  // fade 애니메이션 클래스 상태

    const menus = [
        { id: 'writeNow', src: 'logo_write', guide:'주어진 질문에 대해 생각해보고 글을 써주세요! 문장을 완성했다면 엔터키를 눌러 나의 기록이 타인의 이미지로 재해석되는 슬라이드를 감상해보세요! 페이지를 새로고침하면 질문이 다른 것으로 변경됩니다.' },
        { id: 'liveNow', src: 'logo_library', guide: '사이트에 등록된 단어와 이미지를 찾아보고 추가로 등록할 수 있는 라이브러리 페이지입니다. 이미지 카드를 클릭하여 사진이 의미하는 단어와 그에 담긴 이야기를 읽어보세요! 아래에 + 버튼을 눌러 나의 사진과 단어를 등록해주세요.' },
        { id: 'readNow', src: 'logo_read',guide: 'writeNow에서 작성된 모든 글을 모아보세요! 밑줄이 쳐진 단어를 클릭하면 이전에 같은 단어를 사용한 문장으로 이동합니다.' },
    ];
    const handleHamburgerMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleGuideIcon = () => {
        if (isGuideOpen) {
            setFadeClass('fade-out');
            setTimeout(() => {
                setIsGuideOpen(false);
            }, 500);  // 0.5초 후에 가이드 창 닫기
        } else {
            setIsGuideOpen(true);  // 가이드 열기
        }
    };

    // isGuideOpen이 true로 변경되면 fade-in 클래스를 추가
    useEffect(() => {
        if (isGuideOpen) {
            setFadeClass('fade-in');
        }
    }, [isGuideOpen]);

    const handleMenu = (menuId:string) => {
        setCurrentMenu(menuId)
    }

    const handleMouseEnter = (menuId: string) => {
        setHoveredMenu(menuId);
    };

    const handleMouseLeave = () => {
        setHoveredMenu(null);
    };

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
                            <img
                                onClick={() => handleMenu(menu.id)}
                                key={menu.id}
                                src={hoveredMenu === menu.id ? `${menu.src}-black.png` : `${menu.src}-gray.png`}
                                alt={menu.id}
                                className={`${styles.menuLogo} ${hoveredMenu === menu.id ? styles.menuLogoHover : ''}`}
                                onMouseEnter={() => handleMouseEnter(menu.id)}
                                onMouseLeave={handleMouseLeave}
                            />
                        ))}
                </div>
            )}
            {!isOpen && (
                <div>
                    {menus
                        .filter(menu => menu.id === currentMenu)
                        .map(menu => (
                            <img key={menu.id} src={`${menu.src}-black.png`} alt={menu.id} className={styles.menuLogo}/>
                        ))}
                </div>
            )}
            <div onClick={handleGuideIcon} className={`${styles.guideIcon} ${isGuideOpen? styles.guideIconActive : ''}`}></div>
            {isGuideOpen && (
                <div className={`${styles.guideContainer} ${styles[fadeClass]}`}>
                    {menus.find(o => o.id === currentMenu)?.guide}
                </div>
            )}
        </header>
    )
        ;
};

export default Header;