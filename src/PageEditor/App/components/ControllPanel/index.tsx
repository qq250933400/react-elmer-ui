import styles from "../../style.module.scss";
import cn from "classnames";
import { useApp } from "../../data";
import { FormattedMessage } from "@HOC/withI18n";
import { useCallback, useEffect, useState } from "react";
import { Panel } from "./Panel";
import { IPanel } from "../../../data/IAppInfo";
import { useApp as useAppModel } from "../../hooks";

export const ControllPanel = () => {
    const appData = useApp(["appData"]).data.appData;
    const [ currentPanel, setCurrentPanel ] = useState<IPanel>(appData.panels[0]);
    const [ openPanels, setOpenPanels ] = useState<any[]>(appData.panels[0] ? [ appData.panels[0] ] : []);
    const appObj = useAppModel(appData.appKey);
    const onActivePanel = useCallback((item: any)=>{
        let isExists = false;
        for(const info of openPanels) {
            if(info.value === item.value) {
                isExists = true;
                break;
            }
        }
        setCurrentPanel(item);
        if(!isExists) {
            setOpenPanels([...openPanels, item]);
        }
        appObj.emit("onPanelChange", item);
    }, [openPanels, appObj]);
    useEffect(() => {
        appObj.emit("onPanelChange", currentPanel);
    }, []);
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
                                    onClick={() => onActivePanel(item)}
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
                {
                    openPanels.length > 0 && openPanels.map((data: any, index) => {
                        return <Panel key={index} visible={data.value === currentPanel?.value} data={data} title={<FormattedMessage id={data.title} />}/>;
                    })
                }
            </div>
        </section>
    );
};