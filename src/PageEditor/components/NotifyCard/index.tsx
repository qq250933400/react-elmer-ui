import styles from "./style.module.scss";
import { cn } from "../../../utils";
import { Progress } from "../Progress";
import { CloseOutlined, StarOutlined } from "@ant-design/icons";

type TypeNotifyCardProps = {
    iconMode?: boolean;
    icon?: any;
    title: string;
    description?: string;
    progressMax?: number;
    progressValue?: number;
    showProgress?: boolean;
    onClose?: Function;
    onClick?: Function;
};

export const NotifyCard = (props: TypeNotifyCardProps) => {
    return (
        <section className={cn(styles.notifyCard,"NotifyCard", props.iconMode && styles.notifyIconMode)} onClick={props.onClick as any}>
            <div className="NotifyContext">
                <div className="NotifyIcon">
                    { !props.iconMode && <div className="NotifyIconStar"><StarOutlined /></div> }
                    { props.icon && <div className="Icon FocusTextColor">{props.icon}</div> }
                </div>
                <div className="NotifyMsg">
                    <h5 className="TitleColor">{props.title}</h5>
                    <label className="SubTitleColor">{props.description}</label>
                </div>
                <div className={styles.NotifyClose}>
                    <button className="NotifyClose TitleColor" onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        typeof props.onClose === "function" && props.onClose();
                        return false;
                    }}><CloseOutlined /></button>
                </div>
            </div>
            {props.showProgress && <Progress max={100} value={40}/> }
        </section>
    );
};