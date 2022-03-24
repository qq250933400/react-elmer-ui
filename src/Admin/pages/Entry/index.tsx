import React, { useEffect, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { msjApi } from "../../MSJApp";
import { IPageInfo } from "@MSJApp";
import { utils } from "elmer-common/lib/utils";
import { queueCallFunc } from "elmer-common/lib/BaseModule/QueueCallFun";
import RoutePages from "../index";

const Entry = () => {
    const [ appState, setAppState ] = useState({});
    const [ implUpdate, setImplUpdate ] = useState(true);
    const navigateTo = useNavigate();
    useEffect(()=>{
        msjApi.run({
            workspace: "admin",
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
    },[navigateTo]);
    useEffect(()=>{
        !implUpdate && msjApi.refreshStoreData(appState);
    },[ implUpdate, appState]);
    return (
        <>
            <Routes>
                {
                    RoutePages.map((info, index) => {
                        const RComponent = info.component;
                        return <Route key={`subRoute_${index}`} path={info.path} element={<RComponent />}/>
                    })
                }
            </Routes>
        </>
    );
};

export default Entry;
