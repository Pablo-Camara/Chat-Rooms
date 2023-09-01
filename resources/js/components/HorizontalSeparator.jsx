
import styles from '../../css/modules/components/HorizontalSeparator.module.css';

export default function HorizontalSeparator({style, children}) {
    return <>
        <div className={styles.hseparator} style={{...style}}>
            {children}
        </div>
    </>
}
