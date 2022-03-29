import React, { useState, useCallback, useEffect } from "react";
import { Layout, Menu, Button, message } from "antd";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    UnorderedListOutlined
} from "@ant-design/icons";
import utils from "../../../utils";
import styles from "./style.module.scss";
import UserProfile from "./UserProfile";
import NotifyBtn from "./Notify";
import { msjApi } from "@Admin/MSJApp";
import { queueCallFunc } from "elmer-common";
import LoadableComponent from "../../../components/Loadable";
import { FormattedMessage } from "react-intl";
import { IMenuItem, IMenuList } from "@MSJApp/types/IAdmin";

const { SubMenu } = Menu;

const LandingPage = LoadableComponent({
    loader: () => import("../Landing")
});

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
    const [ showLoading, setShowLoading ] = useState(false);
    const [ title, setTitle ] = useState({
        text: props.title,
        shortText: props.shortTitle || (props.title || "").substring(0,2)
    });
    const [ leftMenu, setLeftMenu ] = useState([]);
    const onToggle = useCallback(()=>{
        setCollasped(!collasped);
    }, [collasped]);
    const onMenuClick = useCallback((item: any) => {
        msjApi.callApi("admin", "onLeftMenuChange", item, leftMenu);
    },[leftMenu]);
    const renderLeftMenu = useCallback((menuList: IMenuList, parentKey: string) => {
        return (
            menuList.map((item, mIndex):any => {
                if(null === item.visible || undefined === item.visible || (typeof item.visible === "boolean" && item.visible)) {
                    const Icon = item.icon || UnorderedListOutlined;
                    const itemKey = [parentKey, mIndex].join("_");
                    (item as any).key = itemKey;
                    if(item.subMenu && item.subMenu.length > 0) {
                        return <SubMenu key={itemKey} icon={<Icon />} title={item.title}>{renderLeftMenu(item.subMenu, [parentKey, mIndex].join("_"))}</SubMenu>
                    } else {
                        return  <Menu.Item onClick={() => onMenuClick(item)} key={itemKey} icon={<Icon />}>{item.title}</Menu.Item>;
                    }
                } else {
                    return <></>
                }
            })
        );
    }, [onMenuClick]);
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
    useEffect(()=>{
        setShowLoading(true);
        msjApi.callApi("admin", "initLoad").then((data)=>{
            const { sysInfo, leftMenu } = data;
            setTitle({
                text: (<FormattedMessage id={sysInfo.sysName}/>) as any,
                shortText: (<FormattedMessage id={sysInfo.sysShortName || sysInfo.sysName}/>) as any,
            });
            setLeftMenu(leftMenu || []);
            console.log(data);
            setShowLoading(false);
        }).catch((err)=>{
            setShowLoading(false);
            msjApi.showException(err);
        });
    }, []);
    return (<>
            { !showLoading && (
                <Layout className={styles.admin_layout}>
                    <Sider theme={theme} trigger={null} collapsible collapsed={collasped}>
                        <div className={utils.cn(styles.admin_layout_logo, collasped && styles.collaspedLogo)}>
                            <span className={theme}>{!collasped ? title.text : title.shortText}</span>
                        </div>
                        <Menu theme={theme} mode="inline" >
                        {
                            renderLeftMenu(leftMenu, "topMenu")
                        }
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
            )}
            {showLoading && <LandingPage />}
        </>
    );
}

export default AdminLayout;