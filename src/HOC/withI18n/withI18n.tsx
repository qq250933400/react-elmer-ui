import React, { createContext, useContext,useMemo,useEffect, useState } from "react";
import { useI18n } from "./Provider";

type TypeLocales = "en-GB" | "zh-CN" | "zh-HK" | "zh-TW";

type TypeWithContext = {
    name: string;
    i18n: {[ P in TypeLocales]?: any };
    prev?: any;
};
type TypeWithi18nOptions = TypeWithContext;

const WithContext = createContext<TypeWithContext>({
    name: "",
    i18n: {},
    prev: null
});

export const useWithi18n = () => useContext(WithContext);

export const withI18n = (options: TypeWithi18nOptions) => (TargetWrapper:React.ComponentType<any>) => {
    return (props: any) => {
        const rootContext = useI18n();
        const withContxt = useContext(WithContext);
        const [ updateMessage, setUpdateMessage ] = useState(false);
        const messages = useMemo(()=>{
            const currentData:any = {};
            options.i18n && Object.keys(options.i18n).forEach((locale: string) => {
                const i18nData = (options.i18n as any)[locale] || {};
                const currentI18nMessage:any = {};
                Object.keys(i18nData).forEach((msgKey: string) => {
                    const lineKey = options.name + "." + msgKey;
                    currentI18nMessage[lineKey] = i18nData[msgKey];
                });
                currentData[locale] = currentI18nMessage;
            });
            return currentData;
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
        const prevConfig = useMemo(() => {
            const data = {
                ...(withContxt.prev||{}),
            };
            data[options.name] = true;
        }, [withContxt]);
        useEffect(() => {
            const prev = withContxt.prev || {};
            if(prev[options.name]) {
                throw new Error(`定义多语言节点冲突。${options.name}`);
            }
            rootContext.setMessages(messages);
            setUpdateMessage(true);
            return () => rootContext.removeMessages(messages);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [messages]);
        return (
            <WithContext.Provider value={{
                name: options.name,
                i18n: messages,
                prev: prevConfig
            }}>
                {updateMessage && <TargetWrapper {...props} /> }
            </WithContext.Provider>
        );
    };
};