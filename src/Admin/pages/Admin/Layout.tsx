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

const { Sider, Header, Content } = Layout;

const AdminLayout = () => {
    const [ collasped, setCollasped ] = useState(false);
    const [ theme ] = useState<"light"|"dark">("dark");
    const [ smallMode, setSmalMode ] = useState(false);
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
    return (
        <Layout className={styles.admin_layout}>
            <Sider theme={theme} trigger={null} collapsible collapsed={collasped}>
                <div className={utils.cn(styles.admin_layout_logo)}><span className={theme}>后台管理系统</span></div>
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
                </Header>
                <Content className={styles.admin_layout_content}
                    style={{
                        margin: "10px 14px",
                        padding: 24,
                        minHeight: 280
                    }}
                >
                    Content
                </Content>
            </Layout>
        </Layout>
    );
}

export default AdminLayout;