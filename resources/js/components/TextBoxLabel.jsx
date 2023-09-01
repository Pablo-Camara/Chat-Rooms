export default function TextBoxLabel({style, children}) {
    return <>
        <style>
        {`
          /* Scoped styles */
          .text-box-label {
            font-family: Verdana;
            font-size: 16px;
            color: #000000;
            text-align: left;
          }
        `}
        </style>
        <div className="text-box-label" style={{...style}}>
            {children}
        </div>
    </>
}
