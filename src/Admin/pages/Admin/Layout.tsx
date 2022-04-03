import React, { useState, useCallback, useEffect } from "react";
import { Layout, Menu, Button } from "antd";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined
} from "@ant-design/icons";
import utils from "../../../utils";
import styles from "./style.module.scss";
import UserProfile, { renderMenuList } from "./UserProfile";
import NotifyBtn from "./Notify";
import { msjApi } from "@Admin/MSJApp";
import LoadableComponent from "../../../components/Loadable";
import { FormattedMessage } from "react-intl";
import { utils as utilsObj } from "elmer-common";

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
    const [ staticState ] = useState({
        notifyTimeHandler: null,
        notifyInterval: 3000
    });
    const [ leftMenu, setLeftMenu ] = useState([]);
    const [ topRightMenu, setTopRightMenu ] = useState([]);
    const [ notifyApi, setNotifyApi ] = useState(null);
    const onToggle = useCallback(()=>{
        setCollasped(!collasped);
    }, [collasped]);
    const onMenuClick = useCallback((item: any) => {
        msjApi.callApi("admin", "onLeftMenuChange", item, leftMenu);
    },[leftMenu]);
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
        setShowLoading(true);console.log("run_init_load");
        msjApi.callApi("admin", "initLoad").then((data)=>{
            const { sysInfo, leftMenu, adminProfileMenu } = data;
            setTitle({
                text: (<FormattedMessage id={sysInfo.sysName}/>) as any,
                shortText: (<FormattedMessage id={sysInfo.sysShortName || sysInfo.sysName}/>) as any,
            });
            staticState.notifyInterval = sysInfo.notifyInterval || 3000;
            setLeftMenu(leftMenu || []);
            setTopRightMenu(adminProfileMenu || []);
            setNotifyApi(sysInfo.notifyApi);
            setShowLoading(false);
        }).catch((err)=>{
            setShowLoading(false);
            msjApi.showException(err);
        });
    }, []);
    useEffect(()=>{
        if(!utilsObj.isEmpty(notifyApi)) {
            if(staticState.notifyTimeHandler) {
                clearInterval(staticState.notifyTimeHandler);
                staticState.notifyTimeHandler = null;
            } else {
                staticState.notifyTimeHandler && clearInterval(staticState.notifyTimeHandler);
                staticState.notifyTimeHandler = setInterval(() => {
                    msjApi.callApi("admin", "getNotifyList", notifyApi).then((resp) => {
                        console.log(resp);
                    });
                }, staticState.notifyInterval) as any;
            }
        } else {
            staticState.notifyTimeHandler && clearInterval(staticState.notifyTimeHandler);
            staticState.notifyTimeHandler = null;
        }
        return () => {
            staticState.notifyTimeHandler && clearInterval(staticState.notifyTimeHandler);
            staticState.notifyTimeHandler = null;
        }
    }, [notifyApi, staticState]);

    return (<>
            { !showLoading && (
                <Layout className={styles.admin_layout}>
                    <Sider theme={theme} trigger={null} collapsible collapsed={collasped}>
                        <div className={utils.cn(styles.admin_layout_logo, collasped && styles.collaspedLogo)}>
                            <span className={theme}>{!collasped ? title.text : title.shortText}</span>
                        </div>
                        <Menu theme={theme} mode="inline" >
                        {
                            renderMenuList(leftMenu, "topMenu", onMenuClick)
                        }
                        </Menu>
                    </Sider>
                    <Layout className="site-layout">
                        <Header className={styles.admin_layout_header} style={{padding: 0}}>
                            <Button className={styles.admin_menu_taggle} onClick={onToggle}>
                                { collasped ? <MenuUnfoldOutlined /> : <MenuFoldOutlined/> }
                            </Button>
                            <UserProfile theme={theme} menuList={topRightMenu} onMenuChange={onMenuClick}/>
                            <NotifyBtn />
                        </Header>
                        <div className={styles.admin_layout_content_pt}>
                            <Content className={styles.admin_layout_content}>
                                {props.children}
                            </Content>
                        </div>
                    </Layout>
                </Layout>
            )}
            {showLoading && <LandingPage />}
        </>
    );
}

export default AdminLayout;