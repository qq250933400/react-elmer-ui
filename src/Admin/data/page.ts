import { IPageInfoEx } from "@Admin/MSJApp/Types/IPageInfoEx";
import { createWorkspace, TypeCreateWorkspaceResult } from "../../lib/MSJApp";
type TypePageExtAttr = {
    navigateTo?: string;
    component?: any;
    isAdminPage?: boolean;
};
const adminWorkspaceData = createWorkspace<TypePageExtAttr>("admin")
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
    }).createPage({
        id: "editor",
        path: "/editor"
    });

export type TypeDefinePage = IPageInfoEx & {
    title?: string;
    description?: string;
    component: any;
    isAdminPage?: boolean;
};

export const adminWorkspace:TypeCreateWorkspaceResult<TypePageExtAttr> = adminWorkspaceData as any;