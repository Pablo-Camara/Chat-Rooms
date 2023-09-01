export default function TextBox({children}) {
    return <>
        <style>
        {`
          /* Scoped styles */
          .text-box-container {
            background: #D8D8D8;
            border: 1px solid #979797;
            width: 280px;
            height: 31px;
            margin-top: 6px;
          }
        `}
        </style>
        <div className="text-box-container">
            {/* <input type="text" /> */}
        </div>
    </>;
};
