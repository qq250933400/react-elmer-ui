import { createWorkspace, IPageInfo } from "@MSJApp";

export const adminWorkspace = createWorkspace("admin")
    .createPage({
        id: "login",
        path: "/admin/login"
    })
    .createPage({
        id: "adminMain",
        path: "/admin/main"
    })
    .createPage({
        id: "landing",
        path: "/landing"
    })
    .createPageFrom("landing", {
        id: "homeLanding",
        onBeforeEnter: "admin.initLoad"
    });

export type TypeDefinePage = IPageInfo & {
    title?: string;
    description?: string;
    component: any;
    isAdminPage?: boolean;
};