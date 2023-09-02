import styles from '../../css/modules/components/Container.module.css';

export default function Container({className, style, children}) {
    let finalClassName = className ? className : styles.container;
    return <>
        <div className={finalClassName} style={{...style}}>
            {children}
        </div>
    </>;
}
