import { useContext, useCallback } from "react";
import { I18nContext, II18nApi } from "./Provider";
import { WithContext } from "./withI18n";
import { TypeUseMessage } from "./FormattedMessage";
import { utils } from "elmer-common";

export const useI18n = <T={}>() => useContext<II18nApi<T>>(I18nContext as any);
export const useWithi18n = () => useContext(WithContext);

export const useMessage = (): TypeUseMessage => {
    const withI18nObj = useWithi18n();
    const rootContext = useI18n();
    return useCallback((id: string, value?: any)=>{
        const lngId = utils.isEmpty(withI18nObj.name) ? id : withI18nObj.name + "." + id;
        const messages:any = rootContext.message;
        return messages[lngId];
    }, [rootContext, withI18nObj]);
}