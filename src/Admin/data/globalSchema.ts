import { msjApi } from "../MSJApp";
import formatCallbacks from "./formatCallbacks";

msjApi.registGlobalSchema({
    properties: {
        currentMenu: {
            type: "Object",
        },
        arr: {
            type: "Array<#test>"
        }
    },
    dataType: {
        test: {
            type: "Object",
            properties: {
                name: {
                    type: "String",
                    format: "formatName"
                },
                age: {
                    type: "Number",
                    format: "formatAge"
                }
            }
        }
    },
    formatCallbacks
});
