import { cn } from "src/utils";
import { utils } from "elmer-common";
import { FormattedMessage } from "@HOC/withI18n";
import styles from "../style.module.scss";
import { useCallback, useEffect, useState } from "react";
import { editApp } from "../../config";
import { IMenuList, IMenuInfo } from "../../config/types/IMenu";
import { ContextMenu } from "../ContextMenu";

type TypeMenuButton = {
    data: IMenuInfo;
}

const ApplicationMenuButton = ({ data }: TypeMenuButton) => {
    const [ menuStyle, setMenuStyle ] = useState<any>({
        top: "100%",
        left: "0",
        display: "none"
    });
    const onMouseEnter = useCallback(() => {
        setMenuStyle({
            ...menuStyle,
            display: "block"
        });
    }, [menuStyle]);
    const onMouseLeave = useCallback(() => {
        setMenuStyle({
            ...menuStyle,
            display: "none"
        });
    }, [menuStyle]);
    const onMenuClick = useCallback((data) => {
        if(!utils.isEmpty(data.value)) {
            editApp.callApiEx(data.value, data);
        }
    }, []);
    return (
        <li className={cn("TitleColor", "MenuBarItem")} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <label>
                <span>{data.title}</span>
                { !utils.isEmpty(data.hotKey) && <i>({data.hotKey})</i> }
            </label>
            { data.items && data.items.length > 0 && <ContextMenu onClick={onMenuClick} style={menuStyle} data={data.items}/> }
        </li>
    );
};

export const ApplicationHeader = () => {
    const [ menuList, setMenuList ] = useState<IMenuList>([]);
    useEffect(()=>{
        editApp.callApi("menu", "applicationMenu").then((data) => {
            setMenuList(data);
        });
    },[]);
    return (
        <div className={cn(styles.applicationHeader, "NormalBackColor")}>
            <ul className={styles.applicationHeaderMenu}>
                {
                    menuList.map((item, index):any => {
                        return <ApplicationMenuButton key={index} data={item}/>
                    })
                }
            </ul>
            <h5 className={cn(styles.applicationHeaderTitle, "TitleColor")}><FormattedMessage id="applicationTitle"/></h5>
        </div>
    );
};
