import React, { createContext, useCallback, useContext, useState, useMemo } from 'react';
import { TypeServiceConfig, ElmerService, TypeServiceSendOptions, TypeServiceNamespace, TypeServiceEndPoint } from "./ElmerService";
import { commonHandler } from "./ErrorHandle";
import { IServiceContext } from './ServiceContext';
import { utils, queueCallFunc } from "elmer-common";
export { createServiceConfig } from "./ServiceContext";

type TypeServiceProviderProps = {
    env: string,
    data: TypeServiceConfig;
    children: any;
};
export type TypeServiceRequestOptions = {
    throwException?: boolean;
    newEndPoint?: TypeServiceEndPoint
};
type TypeWithService<T={}> = {
    config?: React.Context<IServiceContext<T>>;
    handlers?: Function[];
};

export interface IWithServiceApi {
    config: TypeServiceNamespace<any>;
    send: (option: TypeServiceSendOptions, opt?: TypeServiceRequestOptions) => Promise<any>,
    handlers?: Function[];
}

const ServiceContext = createContext({
    config: {},
    env: "DEV"
});

const WithServiceContext = createContext<IWithServiceApi>({
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

export const withService = function<T={}>(option?:TypeWithService<T>) {
    return (SerivceWrapper:React.ElementType) => {
        return (props:any) => {
            const { forService } = props;
            const rootContext = useContext(ServiceContext);
            const configContext: IServiceContext<T> = option?.config ? useContext(option.config) : {} as any;
            const withContext = useContext(WithServiceContext);
            const [ serviceObj ] = useState(() => {
                const obj = new ElmerService();
                obj.setENV(rootContext.env);
                obj.setConfig(rootContext.config as any);
                !utils.isEmpty(configContext.name) && obj.setNamespace(configContext.name, configContext.data);
                return obj;
            });
            const allHanlders: Function[] = useMemo(() => ([
                ...(withContext.handlers || []),
                ...(option?.handlers || [])
            ]), [withContext]);
            const handlerExec = useCallback(async(response: any, success: boolean):Promise<any> => {
                let pIndex = -1;
                return new Promise((resolve, reject) => {
                    queueCallFunc(allHanlders as any[], (_, fn: Function) => {
                        return fn({
                            response,
                            success: !!!success
                        },forService);
                    }, {
                        throwException: true,
                        paramConvert: (fn: Function) => {
                            pIndex += 1;
                            return {
                                id: "sevHandle_" + pIndex,
                                params: fn
                            };
                        }
                    }).then((data: any) => {
                        const lastKey: string = "sevHandle_" + (allHanlders.length - 1).toString();
                        resolve(data[lastKey]);
                    }).catch((err) => {
                        reject(err.exception?.stack || err.exception || err);
                    });
                });
            }, [allHanlders, forService]);
            const sendRequest = useCallback((option: TypeServiceSendOptions, opt?: TypeServiceRequestOptions) =>{
                return new Promise((resolve, reject) => {
                    const handleEvent:any = {
                        throwException: opt?.throwException || option?.throwException
                    };
                    serviceObj.send((option || {}) as any, opt?.newEndPoint).then(async(resp: any) => {
                            handleEvent.onError = (err:any) => {
                                reject({
                                    ...resp,
                                    statusCode: err.statusCode,
                                    message: err.message
                                });
                            }
                            let reqStatus = commonHandler(resp, false, handleEvent);
                            let reqHandlerResult = null;
                            if(allHanlders.length > 0) {
                                reqHandlerResult = await handlerExec(resp, reqStatus);
                                if(reqHandlerResult) {
                                    reqStatus = reqHandlerResult.success;
                                }
                            }
                            if(!reqStatus) {
                                resolve(reqHandlerResult || (resp.data || {}));
                            } else {
                                reject({
                                    ...resp,
                                    statusCode: reqHandlerResult?.statusCode || resp.data?.statusCode,
                                    message: reqHandlerResult?.message || resp.data?.message,
                                    ...(reqHandlerResult || (resp.data || {}))
                                });
                            }
                        }).catch(async(err) => {
                            let statusCode, message;
                            handleEvent.onError = (errx:any) => {
                                statusCode = errx.statusCode;
                                message = errx.message;
                            };
                            commonHandler(err, true, handleEvent);
                            let reqHandlerResult = null;
                            if(allHanlders.length > 0) {
                                reqHandlerResult = await handlerExec(err, false);
                            }
                            reject({
                                statusCode: reqHandlerResult?.statusCode || statusCode || err.status,
                                message: reqHandlerResult?.message || message,
                                ...(reqHandlerResult || (err.data || {})),
                                response: err
                            });
                        });
                });
            },[serviceObj, allHanlders, handlerExec]);

            const api = useMemo(()=> ({
                send: sendRequest,
                config: serviceObj.getConfig() as any,
                handlers: allHanlders
            }), [sendRequest, serviceObj, allHanlders]);
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

