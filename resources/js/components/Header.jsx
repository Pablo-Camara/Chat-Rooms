import styles from '../../css/modules/components/Header.module.css';

export default function Header({type, style, children, className}) {
    const combinedClassName = `${styles.defaultHeader} ${className || ''}`;

    return <>
        {
            type === 'h1'
            &&
            <>
                <h1 className={combinedClassName} style={{...style}}>
                    {children}
                </h1>
            </>
        }

        {
            type === 'h2'
            &&
            <>
                <h2 className={combinedClassName} style={{...style}}>
                    {children}
                </h2>
            </>
        }
    </>
}
