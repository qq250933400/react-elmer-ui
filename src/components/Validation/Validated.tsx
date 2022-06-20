/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactNode, useContext, useEffect, useState, useCallback } from "react";
import { ValidatedContext, ValidationContext } from "./Context";
import { Validator } from "./Validator";
import { TypeValidators } from "./validators";
import { CloseCircleOutlined } from "@ant-design/icons";
import { cn } from "../../utils";
import styles from "../style.module.scss";


export type TypeValidatorType = keyof TypeValidators;
export type TypeValidatedProps = {
    children?: ReactNode;
    value?: any;
    id: string;
    type: TypeValidatorType | String;
    tag?: string;
    validator?: Function;
    // 是否手动触发验证规则，未设置或false将在value改变的时候触发
    emitValidate?: boolean;
    errMsg?: string;
};

export const Validated = function <P = {}>(props: TypeValidatedProps & P) {
    const validateApi = useContext(ValidatedContext);
    const contxtObj = useContext(ValidationContext);
    const [value, setValue] = useState(props.value);
    const [validators] = useState<any>({
        ...contxtObj.validators,
        ...validateApi.validators
    });
    const [validateStatus, setValidateStatus] = useState({
        pass: true,
        message: ""
    });
    const getValue = useCallback(() => value, [value]);
    const getProps = useCallback(() => {
        const ignoreKeys = ["children", "value", "id", "type", "tag", "validator", "emitValidate"];
        const useProps: any = {};
        Object.keys(props).forEach((key: string) => {
            if (ignoreKeys.indexOf(key) < 0) {
                useProps[key] = (props as any)[key];
            }
        });
        return useProps;
    }, [props]);
    const [validatorObj] = useState<Validator>(() => {
        const ValidatorFn: any = validators[props.type as any];
        if (ValidatorFn) {
            const obj: Validator = new ValidatorFn({
                id: props.id,
                validator: props.validator,
                tag: props.tag,
                emitValidate: props.emitValidate,
                getValue,
                getProps
            });
            contxtObj.registe(props.id, obj);
            return obj;
        } else {
            throw new Error(`Undefined validator type(${props.type})`);
        }
    });
    useEffect(() => {
        if (!props.emitValidate) {console.log("validate in firstTime", props.emitValidate);
            if (validateApi.validateById(props.id, value, {})) {
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
        }
        validatorObj.setValue(value);
    }, [validatorObj, validateApi, props.emitValidate, props.id, value]);
    useEffect(() => {
        setValue(props.value);
    }, [props.value]);
    useEffect(() => {
        const removeValidateById = validateApi.on("onValidateById", (evt) => {
            if (evt.id === props.id) {
                if (evt.pass) {
                    setValidateStatus({
                        pass: true,
                        message: ""
                    });
                } else {
                    setValidateStatus({
                        pass: false,
                        message: evt.message || "Unknow Error"
                    });
                }
            }
        });
        return () => {
            contxtObj.unRegiste(props.id);
            removeValidateById();
        };
    }, []);
    useEffect(() => {
        const removeOnValidateByTag = validateApi.on("onValidateByTag", (event) => {
            if ((event.fail && event.fail.indexOf(props.id) >= 0) ||
                (event.success && event.success.indexOf(props.id) >= 0)) {
                if (validatorObj.validateResult !== validateStatus.pass) {
                    setValidateStatus({
                        pass: validatorObj.validateResult,
                        message: validatorObj.message
                    });
                }
            }
        });
        return () => {
            removeOnValidateByTag();
        };
    }, [validateStatus]);
    return (
        <div className={cn(
            styles.validation,
            !validateStatus.pass && styles.validateFailed,
            !validateStatus.pass ? "validated_failed" : null)}>
            <div>{props.children}</div>
            {!validateStatus.pass && (
                <div className={styles.validated_message}>
                    <CloseCircleOutlined className="icon" />
                    <span>{validateStatus.message}</span>
                </div>)}
        </div>
    );
};