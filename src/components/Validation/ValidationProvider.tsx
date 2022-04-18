import { Observe } from "elmer-common";
import React, { useState } from "react";
import { TypeWithValidateEvent, ValidationContext } from "./Context";
import { Validator } from "./Validator";
import Validators from "./validators";

const ValidationProvider = (props: any) => {
    const [ validates ] = useState<any>({});
    const [ validateState ] = useState({
        validators: {
            ...Validators
        },
        observeObj: new Observe<TypeWithValidateEvent>(),
        registe: (id: string, validateObj:any) => {
            if(!validates[id]) {
                validates[id] = validateObj
            } else {
                throw new Error(`验证规则(${id})已经存在,请注意ID是否重复。`);
            }
        },
        unRegiste: (id: string) => {
            delete validates[id];
        },
        getValidateById: (id: string) => {
            return validates[id];
        },
        getValidateByTag: (tag: string) => {
            const res:Validator[] = [];
            Object.keys(validates).map((validateId: string) => {
                const vd: Validator = validates[validateId];
                if(vd.option.tag === tag) {
                    res.push(vd);
                }
            });
            return res;
        }
    });
    return <ValidationContext.Provider value={validateState}>{props.children}</ValidationContext.Provider>
};

export default ValidationProvider;
