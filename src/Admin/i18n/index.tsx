import { useMemo } from "react";
import { ConfigProvider } from "antd";
import { useI18n, I18nProvider } from "@HOC/withI18n";
import { msjApi } from "@Admin/MSJApp";
import messagesData from "../../Admin/i18n/data";
import en_GB from "antd/es/locale-provider/en_GB";
import zh_CN from "antd/es/locale-provider/zh_CN";
import zh_HK from "antd/es/locale-provider/zh_HK";
import zh_TW from "antd/es/locale-provider/zh_TW";

const antdMessages = {
    en_GB,
    zh_CN,
    zh_HK,
    zh_TW
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (props: any) => {
    const i18n = useI18n();
    const locale = i18n.locale;
    const antdLocale = useMemo(()=>{
        const vLocale = locale.replace(/-/g,"_");
        return (antdMessages as any)[vLocale] || zh_CN;
    },[locale]);
    const notAllowDeleteKeys = useMemo(() => {
        const keys:string[] = [];
        const defaultLang = (props.messages || {})["en-GB"] || {};
        Object.keys(defaultLang).forEach((key: string) => {
            keys.push(key);
        });
        return keys;
    }, [props]);
    return (
        <I18nProvider messages={messagesData} onMessagesChange={(i18nMsg:any)=>{
            msjApi.callApi("lang", "updateNotAllowDeleteKeys", notAllowDeleteKeys);
            msjApi.callApi("lang","updateData", i18nMsg);
        }}>
            <ConfigProvider locale={antdLocale}>
                {props.children}
            </ConfigProvider>
        </I18nProvider>
    )
};