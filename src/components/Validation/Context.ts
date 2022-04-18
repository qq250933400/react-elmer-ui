import { createContext } from "react";
import { Validator } from "./Validator";
import { Observe } from "elmer-common";

export type TypeWithValidateEvent = {
    onValidateByTag: (opt: any) => void;
    onValidateById: (opt: any) => void;
};

export const ValidationContext = createContext({
    validators: {},
    observeObj: new Observe<TypeWithValidateEvent>(),
    registe: (id: string, validator: any) => {},
    unRegiste: (id: string) => {},
    getValidateById: (id: string):Validator => { return {} as any },
    getValidateByTag: (tagName: string):Validator[] => { return {} as any }
});