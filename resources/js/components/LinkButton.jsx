import styles from '../../css/modules/components/LinkButton.module.css';
export default function LinkButton({style, onClick, children}) {
    return <>
        <div className={styles.linkButton}
            style={{...style}}
            onClick={onClick}>
            {children}
        </div>
    </>;
};
