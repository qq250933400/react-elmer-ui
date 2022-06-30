import "./page";
import "./config";
import "./menu";
import "./globalSchema";
import { msjApi } from "../MSJApp";

msjApi.registeEntryRules([
    {
        test: /\/admin\/main$/,
        page: "adminMain",
        default: true
    },{
        test: "/",
        page: "adminMain"
    }
]);

// eslint-disable-next-line import/no-anonymous-default-export
export default {};
