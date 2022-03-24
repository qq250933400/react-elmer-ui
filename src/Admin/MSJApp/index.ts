import { createInstance } from "@MSJApp";
import { AppImpl } from "./AppImpl";
import { TypeModel, UseModel } from "./Model";

export const msjApi = createInstance<TypeModel>(AppImpl, {
    models: UseModel
});
