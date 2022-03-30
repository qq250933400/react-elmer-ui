import React, { useMemo, useState, createContext, useCallback } from "react";
import { IntlProvider } from "react-intl";
import messages from "./data";

export const I18nContext = createContext({
    locale: "en",
    setLocale: (locale: string) => {},
    getLocale: () => {}
});

const I18nApp = (props: any) => {
    const [ locale, setLocale ] = useState("en");
    const [ i18nState ] = useState({
        locale: "en"
    });
    const message = useMemo(() => {
        return (messages as any)[locale] || messages.en;
    }, [locale]);
    const getLocale = useCallback(() => {
        return i18nState.locale;
    }, [ i18nState ]);
    return (<IntlProvider locale={locale} messages={message}>
        <I18nContext.Provider value={{
            locale,
            setLocale: (vLocale: string) => {
                setLocale(vLocale);
                i18nState.locale = vLocale;
            },
            getLocale
        }}>
            {props.children}
        </I18nContext.Provider>
    </IntlProvider>);
};

export default I18nApp;