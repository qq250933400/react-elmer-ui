import styles from "../../style.module.scss";

const Section = () => {
    return (
        <div className={styles.sectionPanel} style={{height: 1200}}>
            <textarea defaultValue={"Hello world"}/>
            <button className="btn-primary">Confirm</button>
            <button>Cancel</button>
        </div>
    );
};

export default Section;