import { useMemo, useCallback } from "react";
import { FormattedMessage as FormattedMessageIntl } from "react-intl";
import { utils } from "elmer-common";
import { useWithi18n } from "./withI18n";
import { useI18n } from "./Provider";

type TypeFormattedMessageProps = {
    id: string;
    values?: any;
};
type TypeUseMessage = (id: string, value?: any) => string|undefined;

export const FormattedMessage = (props: TypeFormattedMessageProps) => {
    const withI18nObj = useWithi18n();
    const lngId = useMemo(() => {
        return utils.isEmpty(withI18nObj.name) ? props.id : withI18nObj.name + "." + props.id;
    }, [props.id, withI18nObj.name]);
    return (<FormattedMessageIntl id={lngId} values={props.values}/>);
};

export const useMessage = (): TypeUseMessage => {
    const withI18nObj = useWithi18n();
    const rootContext = useI18n();
    return useCallback((id: string, value?: any)=>{
        const lngId = utils.isEmpty(withI18nObj.name) ? id : withI18nObj.name + "." + id;
        const messages:any = rootContext.message;
        return messages[lngId];
    }, [rootContext, withI18nObj]);
}