import React, { useState, useMemo } from "react";
import { UserOutlined } from "@ant-design/icons";
import styles from "./style.module.scss";
import { Menu, Dropdown } from "antd";
import utils from "../../../utils";
import { IMenuList } from "@MSJApp/types/IAdmin";
import { renderMenuList } from "./RenderMenus";


type TypeTheme = "dark" | "light";
type TypeUserProfileProps = {
    theme?: TypeTheme;
    menuList?: IMenuList;
    onMenuChange: Function;
}


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
