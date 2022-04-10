import React, { useState, useCallback, useEffect } from "react";
import { Layout, Menu, Button, Breadcrumb, message  } from "antd";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    HomeOutlined
} from "@ant-design/icons";
import utils from "../../../utils";
import styles from "./style.module.scss";
import UserProfile from "./UserProfile";
import NotifyBtn from "./Notify";
import { msjApi } from "@Admin/MSJApp";
import LoadableComponent from "../../../components/Loadable";
import { FormattedMessage } from "react-intl";
import { utils as utilsObj } from "elmer-common";
import { renderMenuList } from "./RenderMenus";
import { IBreadCrumbList } from "@Admin/MSJApp/Types/IBreadCrumb";
import { IPageInfoEx } from "@Admin/MSJApp/Types/IPageInfoEx";

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
    const [ mainPage, setMainPage ] = useState<IPageInfoEx>();
    const [ breadCrumbList, setBreadCrumbList ] = useState<IBreadCrumbList>([]);
    const [ menuSelectKey, setMenuSelectKey ] = useState<string[]>([]);
    const [ menuOpenKey, setMenuOpenKey ] = useState<string[]>([]);
    const onToggle = useCallback(()=>{
        setCollasped(!collasped);
    }, [collasped]);
    const onMenuClick = useCallback((item: any) => {
        // const openKeys: string[] = [];
        // const ptRegExp = /^[a-z]{1,}_[\d]{1,}_[\d]{1,}/i;
        // const replaceRegExp = /_[\d]{1,}$/;
        // let curKey: string = item.key || "";
        msjApi.callApi("admin", "onLeftMenuChange", item, leftMenu).then((page) => {
            page && msjApi.callApi("admin", "calcBreadCrumb", page, leftMenu).then(async (breadList) => {
                const selectedKey:any = await msjApi.callApi("admin", "getLeftMenuSelectKey", page, leftMenu);
                setMenuSelectKey(selectedKey ? [selectedKey] : []);
                setBreadCrumbList(breadList);
            });
            !page && setMenuSelectKey([item.key]);
        });
        // while(ptRegExp.test(curKey)) {
        //     const newKey = curKey.replace(replaceRegExp, "");
        //     openKeys.push(newKey);
        //     curKey = newKey;
        // }
        // setMenuOpenKey(openKeys);
    },[leftMenu]);
    const onSubMenuClick = useCallback((item: any) => {
        // const openKeys: string[] = [];
        // const ptRegExp = /^[a-z]{1,}_[\d]{1,}_[\d]{1,}/i;
        // const replaceRegExp = /_[\d]{1,}$/;
        // let curKey: string = item.key || "";
        // while(ptRegExp.test(curKey)) {
        //     const newKey = curKey.replace(replaceRegExp, "");
        //     openKeys.push(newKey);
        //     curKey = newKey;
        // }
        // setMenuOpenKey([item.key, ...openKeys]);
        const newKeys = [...menuOpenKey];
        const keyIndex = newKeys.indexOf(item.key);
        if(keyIndex >= 0) {
            newKeys.splice(keyIndex, 1);
            setMenuOpenKey(newKeys);
        } else {
            newKeys.push(item.key);
            setMenuOpenKey(newKeys);
        }
    }, [menuOpenKey]);
    const onBreadCrumbClick = useCallback((item) => {
        if(item) {
            msjApi.callApi("admin", "calcBreadCrumb", item, leftMenu).then(async (breadList) => {
                const selectedKey:any = await msjApi.callApi("admin", "getLeftMenuSelectKey", item, leftMenu);
                setMenuSelectKey(selectedKey ? [selectedKey] : []);
                setBreadCrumbList(breadList);
            });
            msjApi.navigateTo(item);
        } else {
            message.error("错误的页面导航配置");
        }
    }, [leftMenu]);
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
    }, [staticState]);
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
    useEffect(() => {
        leftMenu && leftMenu.length > 0 && msjApi.callApi("admin", "getMainPage").then((pageInfo) => {
            msjApi.callApi("admin", "calcBreadCrumb", pageInfo, leftMenu).then(async(breadList) => {
                const selectedKey:any = await msjApi.callApi("admin", "getLeftMenuSelectKey", pageInfo, leftMenu);
                setMenuSelectKey(selectedKey ? [selectedKey] : []);
                setMainPage(pageInfo);
                setBreadCrumbList(breadList);
            });
        });
    }, [leftMenu]);

    return (<>
            { !showLoading && (
                <Layout className={styles.admin_layout}>
                    <Sider theme={theme} trigger={null} collapsible collapsed={collasped}>
                        <div className={utils.cn(styles.admin_layout_logo, collasped && styles.collaspedLogo)}>
                            <span className={theme}>{!collasped ? title.text : title.shortText}</span>
                        </div>
                        <Menu theme={theme} mode="inline" openKeys={menuOpenKey} selectedKeys={menuSelectKey}>
                            { renderMenuList(leftMenu, "topMenu", onMenuClick, onSubMenuClick) }
                        </Menu>
                    </Sider>
                    <Layout className="site-layout">
                        <Header className={styles.admin_layout_header} style={{padding: 0}}>
                            <Button className={styles.admin_menu_taggle} onClick={onToggle}>
                                { collasped ? <MenuUnfoldOutlined /> : <MenuFoldOutlined/> }
                            </Button>
                            <UserProfile theme={theme} menuList={topRightMenu} onMenuChange={onMenuClick}/>
                            <NotifyBtn />
                            <Breadcrumb className={styles.admin_layout_breadcrumb}>
                                <Breadcrumb.Item href="#" onClick={() => onBreadCrumbClick(mainPage)}>
                                    <HomeOutlined />
                                </Breadcrumb.Item>
                                {
                                    breadCrumbList.length > 0 && breadCrumbList.map((item, index) => {
                                        return (
                                            <Breadcrumb.Item key={`breadCrumb_${index}`} href="#" onClick={() => {
                                                item.page && onBreadCrumbClick(item.page)
                                            }}>
                                                <FormattedMessage id={item.title}/>
                                            </Breadcrumb.Item>
                                        );
                                    })
                                }
                                {
                                    breadCrumbList.length <= 0 && (<Breadcrumb.Item href="#">
                                        { mainPage && mainPage.title && <FormattedMessage id={mainPage?.title || ""}/> }
                                    </Breadcrumb.Item>)
                                }
                            </Breadcrumb>
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