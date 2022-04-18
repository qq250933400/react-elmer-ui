import { msjApi } from "@Admin/MSJApp";
import React, { useMemo, useState, createContext, useCallback, useEffect } from "react";
import { IntlProvider } from "react-intl";
import messages from "./data";

const getDefaultLocale = () => {
    let locale = localStorage.getItem("locale");
    locale = navigator.language || "zh-CN";
    return locale;
}

export const I18nContext = createContext({
    locale: "en",
    getLocale: (): string => { return "en-GB"},
    setLocale: (locale: string) => {},
    setMessages: (msgData:any) => {}
});

const I18nApp = (props: any) => {
    const [ locale, setLocale ] = useState(getDefaultLocale());
    const [ i18nMsg, setI18nMsg ] = useState(messages);
    const [ i18nState ] = useState({
        locale: locale
    });
    const message = useMemo(() => {
        return (i18nMsg as any)[locale] || i18nMsg["zh-CN"];
    }, [locale, i18nMsg]);
    const notAllowDeleteKeys = useMemo(() => {
        const keys:string[] = [];
        const defaultLang = messages["en-GB"];
        Object.keys(defaultLang).forEach((key: string) => {
            keys.push(key);
        });
        return keys;
    }, []);
    const getLocale = useCallback(() => {
        return i18nState.locale;
    }, [ i18nState ]);
    useEffect(()=>{
        msjApi.callApi("lang", "updateNotAllowDeleteKeys", notAllowDeleteKeys);
        msjApi.callApi("lang","updateData", i18nMsg);
    },[i18nMsg, notAllowDeleteKeys]);
    return (<IntlProvider locale={locale} messages={message}>
        <I18nContext.Provider value={{
            locale,
            setLocale: (vLocale: string) => {
                localStorage.setItem("locale", vLocale);
                setLocale(vLocale);
                i18nState.locale = vLocale;
            },
            setMessages: (msgData: any) => {
                setI18nMsg({
                    ...messages,
                    ...msgData
                });
            },
            getLocale
        }}>
            {props.children}
        </I18nContext.Provider>
    </IntlProvider>);
};

export default I18nApp;