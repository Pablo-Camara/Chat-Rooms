import styles from '../../css/modules/components/TextBox.module.css';
export default function TextBox({children, value, setTextFunc, type = 'text'}) {
    return <>
        <div className={styles.textBoxContainer}>
            <input type={type}
                    value={value}
                    onChange={(e) => setTextFunc(e.target.value) }
                />
        </div>
    </>;
};
