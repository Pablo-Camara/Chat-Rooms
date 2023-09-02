import styles from '../../css/modules/components/Text.module.css';
export default function Text({style, onClick, children, className}) {
    let finalClassName = className ? className : styles.text;
    return <>
        <div className={finalClassName}
            style={{...style}}
            onClick={onClick}>
            {children}
        </div>
    </>;
};
