import React, {useState} from 'react';
import styles from "../css/common.module.css";

type TitleType = "TypeNow" | "LiveNow" | "ReadNow";
interface HeaderProps {
    title: TitleType;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    let logoSrc: string;

    switch (title) {
        case "TypeNow":
            logoSrc = "logo_typeNow.svg"
            break;
        case "LiveNow":
            logoSrc = "logo_liveNow.svg"
            break;
        case "ReadNow":
            logoSrc = "logo_readNow.svg"
            break;
        default:
            logoSrc = "";
    }
    const [isOpen, setIsOpen] = useState(false);

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
    <img src={logoSrc} alt={`${title} logo`}/>
</header>
)
    ;
};

export default Header;
