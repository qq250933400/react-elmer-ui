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

// eslint-disable-next-line import/no-anonymous-default-export
export default {};
