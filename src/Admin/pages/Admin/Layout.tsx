import React, { useState, useCallback, useEffect } from "react";
import { Layout, Menu, Button } from "antd";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined
} from "@ant-design/icons";
import utils from "../../../utils";
import styles from "./style.module.scss";
import UserProfile from "./UserProfile";
import NotifyBtn from "./Notify";

const { Sider, Header, Content } = Layout;

type TypeAdminLayoutProps = {
    children?: any;
    title?: string;
    shortTitle?: string;
};

const AdminLayout = (props: TypeAdminLayoutProps) => {
    const [ collasped, setCollasped ] = useState(false);
    const [ theme ] = useState<"light"|"dark">("dark");
    const [ smallMode, setSmalMode ] = useState(false);
    const [ title, setTitle ] = useState({
        text: props.title,
        shortText: props.shortTitle || (props.title || "").substring(0,2)
    });
    const onToggle = useCallback(()=>{
        setCollasped(!collasped);
    }, [collasped]);
    useEffect(()=>{
        const onResize = () => {
            const width = document.body.clientWidth;
            if(width <= 500) {
                if(!smallMode) {
                    setSmalMode(true);
                    setCollasped(true);
                }
            } else {
                if(smallMode) {
                    setSmalMode(false);
                    setCollasped(false);
                }
            }
        };
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
        }
    },[smallMode]);
    useEffect(() => {
        setTitle({
            text: props.title,
            shortText: props.shortTitle || (props.title || "").substring(0,2)
        });
    }, [props.title, props.shortTitle]);
    return (
        <Layout className={styles.admin_layout}>
            <Sider theme={theme} trigger={null} collapsible collapsed={collasped}>
                <div className={utils.cn(styles.admin_layout_logo, collasped && styles.collaspedLogo)}>
                    <span className={theme}>{!collasped ? title.text : title.shortText}</span>
                </div>
                <Menu theme={theme} mode="inline" defaultSelectedKeys={["1"]}>
                    <Menu.Item key="1" icon={<UserOutlined />}>Nav1</Menu.Item>
                    <Menu.Item key="2" icon={<VideoCameraOutlined />}>Nav2</Menu.Item>
                    <Menu.Item key="3" icon={<UploadOutlined />}>Nav3</Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className={styles.admin_layout_header} style={{padding: 0}}>
                    <Button className={styles.admin_menu_taggle} onClick={onToggle}>
                        { collasped ? <MenuUnfoldOutlined /> : <MenuFoldOutlined/> }
                    </Button>
                    <UserProfile />
                    <NotifyBtn />
                </Header>
                <Content className={styles.admin_layout_content}>
                    {props.children}
                </Content>
            </Layout>
        </Layout>
    );
}

export default AdminLayout;