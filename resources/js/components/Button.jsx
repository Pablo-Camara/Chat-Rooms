export default function Button({style, onClick, children}) {
    return <>
        <style>
        {`
          /* Scoped styles */
          .button {
            background: #013150;
            border: 1px solid #979797;
            border-radius: 8px;
            font-family: Verdana;
            font-size: 18px;
            color: #FFFFFF;
            text-align: center;
            height: 35px;
            line-height: 35px;
          }
        `}
        </style>
        <div className="button"
            style={{...style}}
            onClick={onClick}>
            {children}
        </div>
    </>;
};
