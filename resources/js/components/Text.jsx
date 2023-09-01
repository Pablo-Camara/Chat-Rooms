import styles from '../../css/modules/components/Text.module.css';
export default function Text({style, onClick, children}) {
    return <>
        <div className={styles.text}
            style={{...style}}
            onClick={onClick}>
            {children}
        </div>
    </>;
};
