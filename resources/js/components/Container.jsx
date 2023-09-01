export default function Container({style, children}) {
    return <>
        <style>
        {`
          /* Scoped styles */
          .container {
            max-width: 280px;
            margin: auto;
          }
        `}
        </style>
        <div className="container" style={{...style}}>
            {children}
        </div>
    </>;
}
