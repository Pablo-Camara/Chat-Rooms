import styles from '../../css/modules/components/Header.module.css';

export default function Header({type, style, children}) {
    return <>
        {
            type === 'h1'
            &&
            <>
                <h1 className={styles.defaultHeader} style={{...style}}>
                    {children}
                </h1>
            </>
        }

        {
            type === 'h2'
            &&
            <>
                <h2 className={styles.defaultHeader} style={{...style}}>
                    {children}
                </h2>
            </>
        }
    </>
}
