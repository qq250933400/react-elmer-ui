import React, { useCallback, useContext, useState } from "react";
import { ValidationContext } from "./Context";
import { Observe } from "elmer-common";

type TypeWithValidateEvent = {
    onValidateByTag: (opt: any) => void;
    onValidateById: (opt: any) => void;
};
type TypeWithValidateProps<T={}> = Omit<T, "validateApi"> //; {[P in Exclude<keyof T, "validateApi">]: T[P]};

export interface IValidateApi {
    validateById(id: string, value: any, opt?: any): boolean;
    validateByTag(tag: string, opt?: any): boolean;
};

export const withValidate = <P extends {}>(opt?: any) => (TargetComponent:React.ComponentType<any>): React.ComponentType<TypeWithValidateProps<P>> => {
    return (props: TypeWithValidateProps<P>) => {
        const contextObj = useContext(ValidationContext);
        const [ observeObj ] = useState(() => new Observe<TypeWithValidateEvent>())
        const validateById = useCallback((id: string, value:any, opt: any) => {
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
        const validateByTag = useCallback((tagName: string, opt: any) => {
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
        return <TargetComponent {...props} validateApi={{
            validateById,
            validateByTag
        }}/>
    }
};
