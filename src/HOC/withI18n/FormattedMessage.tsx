import { useMemo } from "react";
import { FormattedMessage as FormattedMessageIntl } from "react-intl";
import { utils } from "elmer-common";
import { useWithi18n } from "./withI18n";

type TypeFormattedMessageProps = {
    id: string;
    values?: any;
};

export const FormattedMessage = (props: TypeFormattedMessageProps) => {
    const withI18nObj = useWithi18n();
    const lngId = useMemo(() => {
        return utils.isEmpty(withI18nObj.name) ? props.id : withI18nObj.name + "." + props.id;
    }, [props.id, withI18nObj.name]);
    return (<FormattedMessageIntl id={lngId} values={props.values}/>);
};