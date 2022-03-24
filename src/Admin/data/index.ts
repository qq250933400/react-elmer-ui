import "./page";
import { msjApi } from "../MSJApp";

msjApi.registeEntryRules([
    {
        test: /\/admin\/main$/,
        page: "adminMain"
    }, {
        test: "/",
        page: "adminMain"
    }
]);

// eslint-disable-next-line import/no-anonymous-default-export
export default {};
