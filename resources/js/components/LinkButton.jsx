export default function LinkButton({style, onClick, children, className}) {
    return <>
        <div className={className}
            style={{...style}}
            onClick={onClick}>
            {children}
        </div>
    </>;
};
