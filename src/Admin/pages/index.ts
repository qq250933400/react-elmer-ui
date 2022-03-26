import Loadable from "../../components/Loadable";
import { TypeDefinePage } from "../data/page";

const Login = Loadable({
    loader: () => import("./Login")
});

const Main = Loadable({
    loader: () => import("./Main")
});

const Admin = Loadable({
    loader: () => import("./Admin")
});
const Landing = Loadable({
    loader: () => import("./Landing")
});

export const Entry = Loadable({
    loader: () => import("./Entry")
});

export const AdminPages:TypeDefinePage[] = [
    {
        id: "main",
        path: "/main",
        component: Main
    }, {
        id: "admin_landing",
        path: "/landing",
        component: Landing
    }
];

// eslint-disable-next-line import/no-anonymous-default-export
export default [
    {
        path: "/login",
        component: Login
    }, {
        path: "/landing",
        component: Landing
    },{
        path: "/admin/*",
        component: Admin
    },{
        path: "/*",
        component: Landing
    }
];