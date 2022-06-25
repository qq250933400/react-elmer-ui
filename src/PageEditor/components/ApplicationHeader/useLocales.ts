import { useWithi18n } from "@HOC/withI18n";
import { useMemo } from "react";

export const useLocales = () => {
    const i18n = useWithi18n();
    const locale = i18n.getLocale();
    return useMemo(()=>{
        const messages = i18n.i18n;
        const localeData:any[] = [];
        const msgData = messages[locale];
        Object.keys(messages).forEach((locale: string) => {
            localeData.push({
                value: locale,
                title: msgData[locale] || locale
            })
        });
        return {
            name: i18n.name,
            locale: locale,
            languages: localeData,
            getMessages: () => i18n.i18n,
            setLocale: i18n.setLocale
        };
    }, [i18n, locale]);
};