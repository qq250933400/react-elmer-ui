import styles from "../../style.module.scss";
import cn from "classnames";

type TypePanelProps = {
    title: string|JSX.Element;
}

export const Panel = (props:TypePanelProps) => {
    return (
        <section className={cn(styles.panel)}>
            <label className="TitleColor">
                <span>{props.title}</span>
            </label>
        </section>
    );
};