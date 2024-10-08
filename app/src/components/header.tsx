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
        { id: 'writeNow', src: 'logo_write', guide:'라이브러리에 등록된 단어를 사용하면 화면에 이미지 카드가 떠오릅니다. 카드 꾸러미는 해당 단어에 여러 이미지가 등록되어 있다는 뜻이에요! 카드를 클릭해 가장 마음에 드는 이미지를 골라보세요. 글을 완성했다면 엔터 아이콘을 클릭해 슬라이드 애니메이션을 감상하세요.' },
        { id: 'readNow', src: 'logo_read',guide: 'writeNow에서 작성된 글을 모두 모아보세요! 작성된 순서대로 저장되며 밑줄이 쳐진 단어는 하이퍼 텍스트로 클릭하면 같은 단어가 쓰인 타인의 문장으로 이동하게 됩니다. 다시보기 아이콘을 클릭하면 문장의 슬라이드 애니메이션을 다시 감상할 수 있습니다.' },
        { id: 'library', src: 'logo_library', guide: '단어와 이미지가 저장된 라이브러리 페이지입니다. 모든 이미지를 톺아보거나 원하는 단어의 이미지만 검색하여 찾아보세요. 우측 하단의 + 아이콘을 눌러 새로운 단어와 이미지를 등록해 주세요.' },
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