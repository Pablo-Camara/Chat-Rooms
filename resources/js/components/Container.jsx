import styles from '../../css/modules/components/Container.module.css';

export default function Container({style, children}) {
    return <>
        <div className={styles.container} style={{...style}}>
            {children}
        </div>
    </>;
}
