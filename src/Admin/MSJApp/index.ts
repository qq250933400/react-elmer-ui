import { createInstance } from "@MSJApp";
import { AppImpl } from "./AppImpl";
import { TypeModel, UseModel } from "./Model";
import { TypeApi, Api, TypeApiEvent } from "./Api";

export const msjApi = createInstance<TypeModel, TypeApi, TypeApiEvent>(AppImpl, {
    models: UseModel,
    attachApi: Api,
    debug: true
});

