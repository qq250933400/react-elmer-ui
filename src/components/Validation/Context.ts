import { createContext } from "react";
import { Validator } from "./Validator";
import { Observe } from "elmer-common";

interface IValidateByIdEvent {
    id: string;
    tag?: string;
    pass: boolean;
    message: string;
}
interface IValidateByTagEvent {
    tag: string;
    pass: boolean;
    messages?: string;
    fail?: string[];
    success?: string[];
}

export type TypeWithValidateEvent = {
    onValidateByTag: (opt: IValidateByTagEvent) => void;
    onValidateById: (opt: IValidateByIdEvent) => void;
};

export const ValidationContext = createContext({
    validators: {},
    observeObj: new Observe<TypeWithValidateEvent>(),
    registe: (id: string, validator: any) => {},
    unRegiste: (id: string) => {},
    getValidateById: (id: string):Validator => { return {} as any },
    getValidateByTag: (tagName: string):Validator[] => { return {} as any }
});

export const ValidatedContext = createContext({
    validators: {},
    validateById: (id: string, value:any, opt: any): boolean => true,
    validateByTag: (tagName: string, opt: any): boolean => true,
    on: <Name extends keyof TypeWithValidateEvent>(evtName: Name, callback: TypeWithValidateEvent[Name]): any => {}
});