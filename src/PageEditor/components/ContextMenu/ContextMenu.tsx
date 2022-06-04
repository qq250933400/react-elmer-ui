import { RightOutlined } from "@ant-design/icons";
import { useCallback } from "react";
import { cn } from "src/utils";
import { IMenuInfo, IMenuList } from "../../config/types/IMenu";
import styles from "../style.module.scss";

type TypeContextMenuProps = {
    data: IMenuList;
    style?: any;
    className?: string;
    onClick?(data: IMenuInfo): void;
};
type TypeContextMenuItemProps = {
    data: IMenuInfo;
    onClick?(data: IMenuInfo): void;
};

const MenuItem = ({ data, onClick }: TypeContextMenuItemProps) => {
    // const mouseMove = useCallback(() => {}, []);
    return (
        <li className={cn("MenuItem", data.type === "Split" ? "MenuSplitItem" : "")} onClick={() => {
            typeof onClick === "function" && onClick(data);
        }}>
            <label>
                <span>{data.title}</span>
                { (!data.items || data.items?.length <= 0) && <i>{data.hotKey}</i> }
                { data.items && data.items.length > 0 && <i><RightOutlined className="icon"/></i> }
            </label>
            { data.items && data.items.length > 0 && <MenuList data={data.items}/> }
        </li>
    );
};

const MenuList = ({ data, onClick }: TypeContextMenuProps) => {
    return (
        <ul>
            {
                data.map((item, index) => {
                    return <MenuItem onClick={onClick} key={index} data={item}/>
                })
            }
        </ul>
    );
};

export const ContextMenu = ({ data, className, style, onClick }: TypeContextMenuProps) => {
    return (
        <div className={cn(styles.contextMenu, className, "ContextMenu")} style={style}>
            <div><MenuList data={data} onClick={onClick}/></div>
        </div>
    );
};