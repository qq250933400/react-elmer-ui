import { IPageInfoEx } from "@Admin/MSJApp/Types/IPageInfoEx";
import { createWorkspace } from "@MSJApp";
type TypePageExtAttr = {
    navigateTo?: string;
    component?: any;
    isAdminPage?: boolean;
};
export const adminWorkspace = createWorkspace<TypePageExtAttr>("admin")
    .createPage({
        id: "login",
        path: "/admin/login"
    })
    .createPage({
        id: "landing",
        path: "/landing"
    })
    .createPageFrom("landing", {
        id: "homeLanding",
        onBeforeEnter: "admin.initLoad"
    });

export type TypeDefinePage = IPageInfoEx & {
    title?: string;
    description?: string;
    component: any;
    isAdminPage?: boolean;
};