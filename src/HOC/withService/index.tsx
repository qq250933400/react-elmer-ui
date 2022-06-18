import React, { createContext, useCallback, useContext, useState, useMemo } from 'react';
import { TypeServiceConfig, ElmerService, TypeServiceSendOptions, TypeServiceNamespace } from "./ElmerService";
import { commonHandler } from "./ErrorHandle";
import { useNavigate } from "react-router-dom";
import { IServiceContext } from './ServiceContext';
export { createServiceConfig } from "./ServiceContext";

type TypeServiceProviderProps = {
    env: string,
    data: TypeServiceConfig;
    children: any;
};
type TypeServiceRequestOptions = {
    throwException?: boolean;
};
type TypeWithService<T={}> = {
    config: React.Context<IServiceContext<T>>;
};

const ServiceContext = createContext({
    config: {},
    env: "DEV"
});

const WithServiceContext = createContext<{
    config: TypeServiceNamespace<any>,
    send: (option: TypeServiceSendOptions, opt?: TypeServiceRequestOptions) => Promise<any>
}>({
    config: {} as any,
    send: (() => {}) as any
});

export const ServiceProvider = (props: TypeServiceProviderProps) => {
    return (
        <ServiceContext.Provider value={{
            config: props.data,
            env: props.env
        }}>
            {props.children}
        </ServiceContext.Provider>
    );
};

const withService = function<T={}>(option?:TypeWithService<T>) {
    return (SerivceWrapper:React.ElementType) => {
        return (props:any) => {
            const rootContext = useContext(ServiceContext);
            const configContext: IServiceContext<T> = option?.config ? useContext(option.config) : {} as any;
            const [ serviceObj ] = useState(() => {
                const obj = new ElmerService();
                obj.setENV(rootContext.env);
                obj.setConfig(rootContext.config as any);
                obj.setNamespace(configContext.name, configContext.data);
                return obj;
            });
            const navigateTo = useNavigate();
            const sendRequest = useCallback((option: TypeServiceSendOptions, opt?: TypeServiceRequestOptions) =>{
                return new Promise((resolve, reject) => {
                    const token = sessionStorage.getItem("token");
                    const handleEvent:any = {
                        throwException: opt?.throwException || option.throwException
                    };
                    serviceObj.send({
                        ...option,
                        cookie: {
                            ...(option.cookie || {}),
                            token
                        }
                    }).then((resp: any) => {
                            handleEvent.onError = (err:any) => {
                                reject({
                                    ...resp,
                                    statusCode: err.statusCode,
                                    message: err.message
                                });
                            }
                            if(!commonHandler(resp, false, handleEvent)) {
                                resolve(resp.data);
                            } else {
                                reject({
                                    ...resp,
                                    statusCode: resp.data?.statusCode,
                                    message: resp.data?.message
                                });
                            }
                            if(handleEvent.returnValue?.statusCode === "NoLogin") {
                                navigateTo("/login");
                            }
                        }).catch((err) => {
                            console.log(handleEvent, "----", option);
                            handleEvent.onError = (errx:any) => {
                                reject({
                                    ...err,
                                    statusCode: errx.statusCode,
                                    message: errx.message
                                });
                            };
                            commonHandler(err, true, handleEvent);
                            if(handleEvent.returnValue?.statusCode === "NoLogin") {
                                navigateTo("/login");
                            }
                            reject(err);
                        });
                });
            },[serviceObj, navigateTo]);
            const api = useMemo(()=> ({
                send: sendRequest,
                config: serviceObj.getConfig() as any
            }), [sendRequest, serviceObj]);
            return (
                <WithServiceContext.Provider value={api}>
                    <SerivceWrapper {...props} service={{
                        send: api.send,
                        config: api.config
                    }}/>
                </WithServiceContext.Provider>
            );
        }
    }
};

export const useService = () => useContext(WithServiceContext);
export { createService } from "./ServiceContext";
export default withService;
