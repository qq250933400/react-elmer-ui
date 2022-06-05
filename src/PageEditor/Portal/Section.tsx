import styles from "./style.module.scss";

type TypeActionSection = {
    title: any;
    children: any;
}

export const Section = ({title, children}: TypeActionSection) => {
    return (
        <section className={styles.action}>
            <h4 className="SubTitleColor">{title}</h4>
            <div>
                { children }
            </div>
        </section>
    );
};
