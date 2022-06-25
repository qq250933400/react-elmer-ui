import Menu from "./Menu";
import Portal from "./Portal";
import App from "./App";
import WebPage from "./WebPage";

export type TypeModels = {
    menu: Menu;
    portal: Portal;
    app: App;
    webPage: WebPage;
};

export const UseModel = {
    menu: Menu,
    portal: Portal,
    app: App,
    webPage: WebPage
};