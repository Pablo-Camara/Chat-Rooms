export default function HorizontalSeparator({style, children}) {
    return <>
        <style>
        {`
          /* Scoped styles */
          .hseparator {
            background: #D8D8D8;
            border: 1px solid #979797;
            height: 4px;
          }
        `}
        </style>
        <div className="hseparator" style={{...style}}>
            {children}
        </div>
    </>
}
