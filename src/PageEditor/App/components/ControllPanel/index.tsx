import styles from "../../style.module.scss";
import cn from "classnames";
import { useApp } from "../../data";
import { FormattedMessage } from "@HOC/withI18n";
import { useState } from "react";

export const ControllPanel = () => {
    const appData = useApp(["appData"]).data.appData;
    const [ currentPanel, setCurrentPanel ] = useState<any>({});
    console.log(appData);
    return (
        <section className={cn(styles.controllPanel, "ControllPanel")}>
            <div>
                <ul className={cn(styles.controllTabs, "ControllTabs")}>
                    {
                        appData?.panels && appData.panels.length > 0 && appData.panels.map((item, index) => {
                            const Icon = item.Icon;
                            return (<li
                                    key={index}
                                    className={item.value === currentPanel?.value ? "Active" : ""}
                                    onClick={() => setCurrentPanel(item)}
                                >
                                    <Icon />
                                    <i>
                                        <span>
                                            <FormattedMessage id={item.title}/>
                                        </span>
                                    </i>
                            </li>);
                        })
                    }
                </ul>
            </div>
        </section>
    );
};