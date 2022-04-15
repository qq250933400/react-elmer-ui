import Loadable from "../../components/Loadable";
import { TypeDefinePage } from "../data/page";

const Login = Loadable({
    loader: () => import("./Login")
});

const Main = Loadable({
    loader: () => import("./Main")
});


const Landing = Loadable({
    loader: () => import("./Landing")
});
const Right = Loadable({
    loader: () => import(/** webpackChunkName: Right */"./Right")
});
const Lang = Loadable({
    loader: () => import(/** webpackChunkName: Lang */"./Lang")
})

export const Entry = Loadable({
    loader: () => import(/** webpackChunkName: Entry */"./Entry")
});
export const Admin = Loadable({
    loader: () => import(/** webpackChunkName: Admin */"./Admin")
});

export const AdminPages:TypeDefinePage[] = [
    {
        id: "adminMain",
        path: "/main",
        title: "homePage",
        fullPage: true,
        component: Main
    }, {
        id: "admin_landing",
        path: "/landing",
        component: Landing
    }, {
        id: "admin_rights",
        path: "/rights",
        onBeforeEnter: "admin.initRightConfig",
        title: "accessRight",
        component: Right
    }, {
        id: "admin_lang",
        path: "/language",
        title: "language",
        buttons: [
            {
                title: "btnAdd",
                type: "Api",
                value: "admin.onBtnAdd"
            }
        ],
        component: Lang
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
        path: "/*",
        component: Landing
    }
];
