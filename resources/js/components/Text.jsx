export default function Text({style, onClick, children}) {
    return <>
        <style>
        {`
          /* Scoped styles */
          .text {
            font-family: Verdana;
            font-size: 16px;
            color: #000000;
            text-align: center;
          }
        `}
        </style>
        <div className="text"
            style={{...style}}
            onClick={onClick}>
            {children}
        </div>
    </>;
};
