import React, { useState, useMemo } from "react";
import { UserOutlined, UnorderedListOutlined } from "@ant-design/icons";
import styles from "./style.module.scss";
import { Menu, Dropdown } from "antd";
import utils from "../../../utils";
import { IMenuList } from "@MSJApp/types/IAdmin";
import { FormattedMessage } from "react-intl";

const { SubMenu } = Menu;

type TypeTheme = "dark" | "light";
type TypeUserProfileProps = {
    theme?: TypeTheme;
    menuList?: IMenuList;
    onMenuChange: Function;
}

export const renderMenuList = (menuList: IMenuList, parentKey: string, fn: Function) => {
    return (
        menuList.map((item, mIndex):any => {
            if(null === item.visible || undefined === item.visible || (typeof item.visible === "boolean" && item.visible)) {
                const Icon = item.icon || UnorderedListOutlined;
                const itemKey = [parentKey, mIndex].join("_");
                (item as any).key = itemKey;
                if(item.subMenu && item.subMenu.length > 0) {
                    return <SubMenu key={itemKey} icon={<Icon />} title={<FormattedMessage id={item.title}/>}>{renderMenuList(item.subMenu, [parentKey, mIndex].join("_"), fn)}</SubMenu>
                } else {
                    return  <Menu.Item onClick={() => typeof fn === "function" && fn(item)} key={itemKey} icon={<Icon />}>{<FormattedMessage id={item.title}/>}</Menu.Item>;
                }
            } else {
                return <></>
            }
        })
    );
};

const UserProfile = (props: TypeUserProfileProps) => {
    const [ theme ] = useState<TypeTheme>(props.theme || "light");
    const MenuList = useMemo(()=>{
        return (
            <Menu theme={theme === "dark" ? "light" : "dark"}>
                {renderMenuList(props.menuList || [], "topRightMenu", props.onMenuChange)}
            </Menu>
        );
    },[theme, props]);
    return (
        <Dropdown overlay={MenuList} placement="bottomRight" arrow>
            <button className={utils.cn(styles.adminTopButton_profile, styles.adminTopButton)}>
                <UserOutlined />
            </button>
        </Dropdown>
    );
};

export default UserProfile;
