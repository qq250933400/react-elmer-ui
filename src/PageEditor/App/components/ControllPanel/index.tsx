import styles from "../../style.module.scss";
import cn from "classnames";
import { FolderOpenOutlined } from "@ant-design/icons";

export const ControllPanel = () => {
    return (
        <section className={cn(styles.controllPanel, "ControllPanel")}>
            <div>
                <ul className={cn(styles.controllTabs, "ControllTabs")}>
                    <li>
                        <FolderOpenOutlined />
                    </li>
                </ul>
            </div>
        </section>
    );
};