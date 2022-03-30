import React, { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import { msjApi } from "../../MSJApp";
import { IPageInfo } from "@MSJApp";
import { utils } from "elmer-common/lib/utils";
import { queueCallFunc } from "elmer-common/lib/BaseModule/QueueCallFun";
import RoutePages, { AdminPages } from "../index";
import { adminWorkspace } from "@Admin/data/page";
import Loading from "./Loading";
import styles from "./style.module.scss";
import CardLoading from "../../../components/CarLoading";
import withService from "../../../HOC/withService";
import { ElmerService } from "../../../HOC/withService/ElmerService";
import { I18nContext } from "../../i18n";

type TypeAdminPageExtAttr = {
    redirect?: boolean;
};
type TypeEntryProps = {
    service: ElmerService
};

const Entry = (props: TypeEntryProps) => {
    const [ appState, setAppState ] = useState({});
    const [ implUpdate, setImplUpdate ] = useState(true);
    const [ loading, setLoading ] = useState(false);
    const navigateTo = useNavigate();
    const location = useLocation();
    const [ routePrefix ] = useState("/");
    const [ initPathName ] = useState(location.pathname);
    const i18n = useContext(I18nContext);
    const runApi = useCallback(()=>{
        msjApi.run({
            workspace: "admin",
            location: initPathName,
            implInit: {
                setAppState: (state: any) => {
                    setImplUpdate(true);console.log(state);
                    setAppState(state);
                },
                navigateTo: (pageInfo: IPageInfo & TypeAdminPageExtAttr) => {
                    return queueCallFunc([
                        {
                            id: "onBeforeAction",
                            fn: () => {
                                return new Promise((resolve, reject) => {
                                    if(pageInfo.onBeforeEnter && !utils.isEmpty(pageInfo.onBeforeEnter)) {
                                        if(!pageInfo.redirect) {
                                            const landingPage: any = msjApi.getPageById("landing") || {};
                                            navigateTo(landingPage.path, {
                                                state: {
                                                    navTo: {
                                                        ...pageInfo,
                                                        redirect: true
                                                    }
                                                }
                                            });
                                            resolve({});
                                        } else {
                                            resolve({});
                                        }
                                    } else {
                                        resolve({});
                                    }
                                })
                            }
                        }, {
                            id: "naviageTo",
                            fn: (opt): any => {
                                navigateTo(pageInfo.path, {
                                    state: opt.lastResult
                                });
                            }
                        }
                    ], undefined, {
                        throwException: true
                    });
                },
                service: props.service,
                setLocale: (locale: string) => i18n.setLocale(locale),
                getLocale: () => i18n.getLocale()
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[navigateTo,props, initPathName]);
    useEffect(() => {
        AdminPages.forEach((page) => {
            const pagePath = [routePrefix, page.path].join("/").replace(/([\/]{2,})/, "/");
            adminWorkspace.createPage({
                id: page.id,
                path: pagePath,
                title: page.title
            });
        });
    }, [routePrefix]);
    useEffect(()=>{
        runApi();
        const unBindEvent = msjApi.on("onShowLoading", ((visible:any) => {
            setLoading(visible);
        }) as any);
        return () => {
            msjApi.destory();
            unBindEvent();
        };
    },[]);
    useEffect(()=>{
        !implUpdate && msjApi.refreshStoreData(appState);
    },[ implUpdate, appState]);
    return (
        <>
            <Routes>
                {
                    RoutePages.map((info, index) => {
                        const RComponent = info.component;
                        const routePath = [routePrefix, info.path].join("/").replace(/[/]{2,}/,"/");
                        return <Route key={`subRoute_${index}`} path={routePath} element={<RComponent />}/>
                    })
                }
            </Routes>
            <Loading visible={loading}>
                <CardLoading className={styles.cardLoading}/>
            </Loading>
        </>
    );
};

export default withService()(Entry);
