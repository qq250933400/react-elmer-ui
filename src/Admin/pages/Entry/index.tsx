import React, { useEffect, useState } from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import { msjApi } from "../../MSJApp";
import { IPageInfo } from "@MSJApp";
import { utils } from "elmer-common/lib/utils";
import { queueCallFunc } from "elmer-common/lib/BaseModule/QueueCallFun";
import RoutePages, { AdminPages } from "../index";
import { adminWorkspace } from "@Admin/data/page";

const Entry = () => {
    const [ appState, setAppState ] = useState({});
    const [ implUpdate, setImplUpdate ] = useState(true);
    const navigateTo = useNavigate();
    const location = useLocation();
    const [ routePrefix ] = useState("/admin/");
    const [ initPathName ] = useState(location.pathname);
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
        msjApi.run({
            workspace: "admin",
            location: initPathName,
            implInit: {
                setAppState: (state: any) => {
                    setImplUpdate(true);console.log(state);
                    setAppState(state);
                },
                navigateTo: (pageInfo: IPageInfo) => {
                    return queueCallFunc([
                        {
                            id: "onBeforeAction",
                            fn: () => {
                                return new Promise((resolve, reject) => {
                                    if(pageInfo.onBeforeEnter && !utils.isEmpty(pageInfo.onBeforeEnter)) {
                                        msjApi.callApiEx(pageInfo.onBeforeEnter)
                                            .then(resolve)
                                            .catch(reject);
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
                }
            }
        });
        return () => msjApi.destory();
    },[navigateTo, initPathName]);
    useEffect(()=>{
        !implUpdate && msjApi.refreshStoreData(appState);
    },[ implUpdate, appState]);
    return (
        <>
            <Routes>
                {
                    RoutePages.map((info, index) => {
                        const RComponent = info.component;
                        const routePath = [routePrefix, info.path].join("/").replace(/[/]{2,}/,"/"); console.log(routePath);
                        return <Route key={`subRoute_${index}`} path={routePath} element={<RComponent />}/>
                    })
                }
            </Routes>
        </>
    );
};

export default Entry;
