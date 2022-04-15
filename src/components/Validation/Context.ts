import { createContext } from "react";
import { Validator } from "./Validator";

export const ValidationContext = createContext({
    validators: {},
    registe: (id: string, validator: any) => {},
    unRegiste: (id: string) => {},
    getValidateById: (id: string):Validator => { return {} as any },
    getValidateByTag: (tagName: string):Validator[] => { return {} as any }
});