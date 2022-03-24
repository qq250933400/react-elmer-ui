import React, { useMemo, useState, createContext } from "react";
import { IntlProvider } from "react-intl";
import messages from "./data";

const I18nContext = createContext({
    locale: "en",
    setLocale: (locale: string) => {}
});

const I18nApp = (props: any) => {
    const [ locale, setLocale ] = useState("en");
    const message = useMemo(() => {
        return (messages as any)[locale] || messages.en;
    }, [locale]);
    return (<IntlProvider locale={locale} messages={message}>
        <I18nContext.Provider value={{
            locale,
            setLocale: (vLocale: string) => setLocale(vLocale)
        }}>
            {props.children}
        </I18nContext.Provider>
    </IntlProvider>);
};

export default I18nApp;