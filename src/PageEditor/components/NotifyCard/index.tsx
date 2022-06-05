import styles from "./style.module.scss";
import { cn } from "../../../utils";

type TypeNotifyCardProps = {
    iconMode?: boolean;
};

export const NotifyCard = (props: TypeNotifyCardProps) => {
    return (
        <section className={cn(styles.notifyCard, props.iconMode && styles.notifyIconMode)}>
            <span>Hello</span>
        </section>
    );
};