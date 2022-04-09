import { msjApi } from "../MSJApp";
import formatCallbacks from "./formatCallbacks";

msjApi.registGlobalSchema({
    properties: {
        currentMenu: {
            type: "Object",
        }
    },
    formatCallbacks
});
