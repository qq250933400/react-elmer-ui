import { IPageInfoEx } from "@Admin/MSJApp/Types/IPageInfoEx";
import { createWorkspace } from "@MSJApp";

export const adminWorkspace = createWorkspace("admin")
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