import styles from '../../css/modules/components/Navbar.module.css';

export default function Navbar({ className, style, onClick, children}) {
    let finalClassName = className ? className : styles.unauthenticatedNavbar;
    return <>
        <div className={finalClassName}
            style={{...style}}
            onClick={onClick}>
            { children ? children : 'Chat rooms'}
        </div>
    </>;
};
