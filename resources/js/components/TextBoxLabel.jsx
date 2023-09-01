import styles from '../../css/modules/components/TextBoxLabel.module.css';
export default function TextBoxLabel({style, children}) {
    return <>
        <div className={styles.textBoxLabel} style={{...style}}>
            {children}
        </div>
    </>
}
