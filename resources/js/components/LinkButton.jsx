import styles from '../../css/modules/components/LinkButton.module.css';
export default function LinkButton({style, onClick, children, className}) {
    const combinedClassName = `${styles.linkButton} ${className || ''}`;

    return <>
        <div className={combinedClassName}
            style={{...style}}
            onClick={onClick}>
            {children}
        </div>
    </>;
};
