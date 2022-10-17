import React, { useMemo, useState, createContext, useCallback, useEffect, useContext } from "react";
import { IntlProvider } from "react-intl";

type TypeI18nProviderProps = {
    children: any;
    messages: any;
    onMessagesChange?: Function;
};

export interface II18nApi<I18nData={}> {
    locale: (keyof I18nData) | "en-GB",
    message: I18nData,
    getLocale: () => (keyof I18nData) | "en-GB",
    setLocale: (locale: keyof I18nData) => void,
    setMessages: (msgData:any) => void,
    removeMessages: (msgData: any) => void,
    getMessages: () => I18nData
}

const getDefaultLocale = () => {
    let locale = localStorage.getItem("locale");
    locale = !locale || locale.length <=0 ? (navigator.language || "zh-CN") : locale;
    return locale;
};

export const I18nContext = createContext<II18nApi>({
    locale: "en-GB",
    message: {},
    getLocale: () => { return "en-GB"},
    setLocale: (locale: string) => {},
    setMessages: (msgData:any) => {},
    removeMessages: (msgData: any) => {},
    getMessages: ():any => {}
});

export const I18nProvider = (props: TypeI18nProviderProps) => {
    const [ locale, setLocale ] = useState(() => getDefaultLocale());
    const [ i18nMsg, setI18nMsg ] = useState(props.messages || {});
    const [ i18nState ] = useState({
        locale: locale
    });
    const message = useMemo(() => {
        return (i18nMsg as any)[locale] || i18nMsg["zh-CN"];
    }, [locale, i18nMsg]);
    const getLocale = useCallback(() => {
        return i18nState.locale;
    }, [ i18nState ]);
    const getMessages = useCallback(() => i18nMsg, [ i18nMsg ]);
    const setMessages = useCallback((msgData: any) => {
        if(msgData) {
            const newMsgData:any = { ...i18nMsg }
            Object.keys(msgData).forEach((toLocale: string) => {
                const overrideMsg = newMsgData[toLocale] || {};
                const newMsg = msgData[toLocale] || {};
                newMsgData[toLocale] = {
                    ...overrideMsg,
                    ...newMsg
                };
            });
            setI18nMsg(newMsgData);
        }
    }, [i18nMsg]);
    const removeMessages = useCallback((msgData: any) => {
        const newI18nData:any = { ...i18nMsg };
        msgData && Object.keys(msgData).forEach((rmLocale: string) => {
            const rmLocaleData = msgData[rmLocale];
            if(newI18nData[rmLocale]) {
                Object.keys(rmLocaleData).forEach((rmDataKey: string) => {
                    delete newI18nData[rmLocale][rmDataKey];
                });
                if(Object.keys(newI18nData[rmLocale]).length <= 0) {
                    delete newI18nData[rmLocale];
                }
            }
        });
        msgData && setI18nMsg(newI18nData);
    }, [i18nMsg]);
    const i18nData = useMemo(() => ({
        locale,
        message,
        setLocale: (vLocale: string) => {
            localStorage.setItem("locale", vLocale);
            setLocale(vLocale);
            i18nState.locale = vLocale;
        },
        setMessages,
        removeMessages,
        getLocale,
        getMessages
    }), [locale, message, i18nState, setMessages, removeMessages, getLocale, getMessages]);
    useEffect(()=>{
        typeof props.onMessagesChange === "function" && props.onMessagesChange(i18nMsg);
    },[i18nMsg, props]);

    return (<IntlProvider locale={locale} messages={message}>
        <I18nContext.Provider value={i18nData as any}>
            {props.children}
        </I18nContext.Provider>
    </IntlProvider>);
};


