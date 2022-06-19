import styles from "../style.module.scss";

type TypeLoadingProps = {
    title?: string;
    visible?: boolean;
};

const Spin = () => {
    return (<div className={styles.spin}>
        <i />
        <i />
        <i />
    </div>);
};

const Loading = (props: TypeLoadingProps) => {
    return (<div className={styles.loading} style={{
        display: props.visible ? "block" : "none"
    }}>
        <div>
            <section className={styles.loadingSpin}>
                <Spin />
                {props.title && <label>{props.title}</label>}
            </section>
        </div>
    </div>);
};

export default Loading;
