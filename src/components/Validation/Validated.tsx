import React, { ReactNode, useContext, useEffect, useState } from "react";
import { ValidationContext } from "./Context";
import { Validator } from "./Validator";
import { TypeValidators } from "./validators";
import { CloseCircleOutlined } from "@ant-design/icons";
import { cn } from "../../utils";
import styles from "../style.module.scss";
import { IValidateApi, withValidate } from "./withValidate";


type TypeValidatorType = keyof TypeValidators;
type TypeValidatedProps = {
    children?: ReactNode;
    value?: any;
    id: string;
    type: TypeValidatorType | String;
    tag?: string;
    validator?: Function;
    validateApi: IValidateApi;
};

export const Validated = withValidate<TypeValidatedProps>()((props: TypeValidatedProps) => {
    const contxtObj = useContext(ValidationContext);
    const [ value, setValue ] = useState(props.value);
    const [ validators ] = useState<any>(contxtObj.validators);
    const [ validateStatus, setValidateStatus ] = useState({
        pass: false,
        message: ""
    });
    const [ validatorObj ] = useState<Validator>(() => {
        const isRequiredFn: any = validators.isRequired;
        const obj:Validator = new isRequiredFn({
            id: props.id,
            validator: props.validator
        });
        contxtObj.registe(props.id, obj);
        return obj;
    });
    useEffect(() => {
        if(props.validateApi.validateById(props.id, value, {})) {
            setValidateStatus({
                pass: true,
                message: ""
            });
        } else {
            setValidateStatus({
                pass: false,
                message: validatorObj.message || "Unknow Error"
            });
        }
    }, [validatorObj,props.validateApi, props.id,value]);
    useEffect(() => {
        setValue(props.value);
    }, [props.value]);
    useEffect(() => {
        return () => {
            contxtObj.unRegiste(props.id);
        };
    }, [props.id, contxtObj]);
    return (
        <div className={cn(
            styles.validation,
            !validateStatus.pass && styles.validateFailed,
            !validateStatus.pass ? "validated_failed" : null)
        }>
            <div>{props.children}</div>
            { !validateStatus.pass && (
                <div className={styles.validated_message}>
                    <CloseCircleOutlined className="icon"/>
                    <span>{validateStatus.message}</span>
                </div>)
            }
        </div>
    );
});