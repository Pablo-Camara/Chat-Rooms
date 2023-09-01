export default function LinkedButton({style, onClick, children}) {
    return <>
        <style>
        {`
          /* Scoped styles */
          .link-button {
            font-family: Verdana;
            font-size: 16px;
            color: #000000;
            text-align: left;
            display: inline-block;
            cursor: pointer;
          }
        `}
        </style>
        <div className="link-button"
            style={{...style}}
            onClick={onClick}>
            {children}
        </div>
    </>;
};
