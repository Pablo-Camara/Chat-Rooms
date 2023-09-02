export default function TextArea({ className, value, setTextFunc }) {
    return <>
        <div className={className}>
            <textarea
                onChange={(e) => setTextFunc(e.target.value) }
            >
                {value}
            </textarea>
        </div>
    </>;
};
