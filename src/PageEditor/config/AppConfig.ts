import { editApp } from "./InitApp";


editApp.registeEntryRules([
    {
        test: /^\//,
        page: "portal"
    }
]);