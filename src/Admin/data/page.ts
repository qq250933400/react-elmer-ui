import { createWorkspace } from "@MSJApp";

export const adminWorkspace = createWorkspace("admin")
    .createPage({
        id: "login",
        path: "/admin/login"
    })
    .createPage({
        id: "adminMain",
        path: "/admin/main"
    });

export type TypeDefinePage = {
    id: string;
    path: string;
    title?: string;
    description?: string;
    component: any;
};