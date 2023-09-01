export default function Header({type, style, children}) {
    return <>
        <style>
            {`
                /* Scoped styles */
                h1, h2 {
                    font-weight: normal;
                }
            `}
        </style>

        {
            type === 'h1'
            &&
            <>
                <style>
                    {`
                        /* Scoped styles */
                        h1 {
                            font-family: Verdana;
                            font-size: 20px;
                            color: #000000;
                            text-align: center;
                        }
                    `}
                </style>
                <h1 style={{...style}}>{children}</h1>
            </>
        }


        {
            type === 'h2'
            &&
            <>
                <style>
                    {`
                        /* Scoped styles */
                        h2 {
                            font-family: Verdana;
                            font-size: 20px;
                            color: #000000;
                            text-align: center;
                        }
                    `}
                </style>
                <h2 style={{...style}}>{children}</h2>
            </>
        }
    </>
}
