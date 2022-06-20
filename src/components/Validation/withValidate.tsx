import React, { useCallback, useContext } from "react";
import { TypeWithValidateEvent, ValidationContext, ValidatedContext } from "./Context";
import { TypeValidatedProps,TypeValidatorType, Validated } from "./Validated";
import { Validator } from "./Validator";

type TypeWithValidateProps<T={}> = Omit<T, "validateApi">;
type TypeWithValidateOption<V={}> = {
    validators?: { [P in keyof V]: Validator },
    tagName?: string;
    emitValidate?: boolean;
};
type TypeWithValidatedProps<Validators={}> = TypeValidatedProps & { type: keyof Validators | TypeValidatorType }

export interface IValidateApi {
    validateById(id: string, value: any, opt?: any): boolean;
    validateByTag(tag: string, opt?: any): boolean;
    on<Name extends keyof TypeWithValidateEvent>(eventName: Name, callback: TypeWithValidateEvent[Name]): Function;
};

export const withValidate = <P extends {}, V={}>(opt?: TypeWithValidateOption<V>) => {
    return (TargetComponent:React.ComponentType<any>): React.ComponentType<TypeWithValidateProps<P>> & { Validated: React.ComponentType<TypeWithValidatedProps<V>>} => {
        const WithValidateNode = (props: TypeWithValidateProps<P>) => {
            const contextObj = useContext(ValidationContext);
            const validatedObj = useContext(ValidatedContext);
            const observeObj = contextObj.observeObj;
            const validateById = useCallback((id: string, value:any, opt: any): boolean => {
                const validate = contextObj.getValidateById(id);
                if(validate) {
                    const pass = validate.validate(value, opt || {});
                    observeObj.emit("onValidateById", {
                        id: validate.option.id,
                        tag: validate.option.tag,
                        pass,
                        message: validate.message
                    });
                    return pass;
                } else {
                    // raise error
                    observeObj.emit("onValidateById", {
                        id: id,
                        tag: null,
                        pass: false,
                        message: "Validate not found."
                    });
                    return false;
                }
            }, [contextObj, observeObj]);
            const validateByTag = useCallback((tagName: string, opt: any): boolean => {
                const validates = contextObj.getValidateByTag(tagName);
                if(validates.length > 0) {
                    const failedVD: string[] = [];
                    const successVD: string[] = [];
                    const failedMsg: any = {};
                    let pass = true;
                    for(const vd of validates) {
                        if(!vd.validate(vd.getValue(), opt || {})) {
                            pass = false;
                            failedMsg[vd.option.id] = vd.message;
                            failedVD.push(vd.option.id);
                        } else {
                            successVD.push(vd.option.id);
                        }
                    }
                    observeObj.emit("onValidateByTag", {
                        tag: tagName,
                        pass,
                        messages: failedMsg,
                        fail: failedVD,
                        success: successVD
                    });
                    return pass;
                } else {
                    // raise error
                    observeObj.emit("onValidateByTag", {
                        tag: tagName,
                        pass: false,
                        message: "Validates not found."
                    });
                    return false;
                }
            }, [contextObj, observeObj]);
            const on = useCallback((evtName: string, callback: Function) => observeObj.on(evtName as any, callback), [observeObj]);
            return (
            <ValidatedContext.Provider value={{
                validators: {
                    ...(validatedObj.validators || {}),
                    ...(opt?.validators || {})
                },
                validateById,
                validateByTag,
                on
            }}>
                <TargetComponent {...props} validateApi={{
                    validateById,
                    validateByTag,
                    on
                } as IValidateApi}/>
            </ValidatedContext.Provider>
            );
        }
        WithValidateNode.Validated = (props: TypeWithValidatedProps<V>) => {
            return (<Validated {...props} tag={props.tag || opt?.tagName} emitValidate={props.emitValidate || opt?.emitValidate}/>);
        };
        return WithValidateNode;
    }
};

export const useValidate = ():IValidateApi => {
    const validatedObj = useContext(ValidatedContext);
    return {
        validateById: validatedObj.validateById,
        validateByTag: validatedObj.validateByTag,
        on: validatedObj.on
    };
};
