import styles from '../../css/modules/components/Button.module.css';

export default function Button({style, onClick, children}) {
    return <>
        <div className={styles.button}
            style={{...style}}
            onClick={onClick}>
            {children}
        </div>
    </>;
};
