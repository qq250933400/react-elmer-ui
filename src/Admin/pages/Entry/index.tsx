import React, { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import { msjApi } from "../../MSJApp";
import { IPageInfo } from "@MSJApp";
import { utils } from "elmer-common/lib/utils";
import { queueCallFunc } from "elmer-common/lib/BaseModule/QueueCallFun";
import RoutePages, { Admin } from "../index";
import Loading from "./Loading";
import styles from "./style.module.scss";
import CardLoading from "../../../components/CarLoading";
import withService from "../../../HOC/withService";
import { ElmerService } from "../../../HOC/withService/ElmerService";
import { I18nContext } from "../../i18n";
import { useConfig } from "../../hooks";

type TypeAdminPageExtAttr = {
    redirect?: boolean;
    isAdminPage?: boolean;
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
    const [ initPathName ] = useState(location.pathname);
    const i18n = useContext(I18nContext);
    const overrideConfig = useConfig();
    const [ routePrefix ] = useState(overrideConfig.urlPrefix || "/");
    const [ contentPagePath ] = useState([overrideConfig.urlPrefix, overrideConfig.adminUrlPrefix, "*"].join("/").replace(/[/]{2,}/g,"/"));
    const runApi = useCallback(()=>{
        msjApi.run({
            workspace: "admin",
            location: initPathName,
            urlPrefix: overrideConfig.urlPrefix || "/",
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
                                return new Promise((resolve) => {
                                    if(pageInfo.onBeforeEnter && !utils.isEmpty(pageInfo.onBeforeEnter)) {
                                        if(!pageInfo.redirect) {
                                            let landingPage: any = msjApi.getPageById("landing") || {};
                                            if(pageInfo.isAdminPage) {
                                                landingPage = msjApi.getPageById("admin_landing") || {};
                                            }
                                            const redirectPath = landingPage.navigateTo || landingPage.path;
                                            navigateTo(redirectPath, {
                                                state: {
                                                    navTo: {
                                                        ...pageInfo
                                                    }
                                                }
                                            });
                                            resolve({
                                                gotoLanding: true
                                            });
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
                                !opt.lastResult.gotoLanding && navigateTo(pageInfo.path, {
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
                <Route path={contentPagePath} element={<Admin />}/>
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
