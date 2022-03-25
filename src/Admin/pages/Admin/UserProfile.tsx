import React, { useState, useMemo } from "react";
import { UserOutlined, VideoCameraOutlined, UploadOutlined } from "@ant-design/icons";
import styles from "./style.module.scss";
import { Menu, Dropdown } from "antd";
import utils from "../../../utils";

type TypeTheme = "dark" | "light";
type TypeUserProfileProps = {
    theme?: TypeTheme;
}

const UserProfile = (props: TypeUserProfileProps) => {
    const [ theme ] = useState<TypeTheme>(props.theme || "light");
    const MenuList = useMemo(()=>{
        return (
            <Menu theme={theme}>
                <Menu.Item key="1" icon={<UserOutlined />}>Nav1</Menu.Item>
                <Menu.Item key="2" icon={<VideoCameraOutlined />}>Nav2</Menu.Item>
                <Menu.Item key="3" icon={<UploadOutlined />}>Nav3</Menu.Item>
            </Menu>
        );
    },[theme]);
    return (
        <Dropdown overlay={MenuList} placement="bottomRight" arrow>
            <button className={utils.cn(styles.adminTopButton_profile, styles.adminTopButton)}>
                <UserOutlined />
            </button>
        </Dropdown>
    );
};

export default UserProfile;
