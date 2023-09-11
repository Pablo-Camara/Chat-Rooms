import styles from '../../css/modules/components/Container.module.css';

export default function Container({className, style, children, elRef, onScroll}) {
    let finalClassName = className ? className : styles.container;
    elRef = 'undefined' !== elRef ? elRef : null;
    onScroll = 'undefined' !== onScroll ? onScroll : null;
    return <div ref={elRef} className={finalClassName} style={{...style}} onScroll={onScroll}>
        {children}
    </div>;
}
