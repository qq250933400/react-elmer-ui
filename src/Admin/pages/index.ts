import Loadable from "../../components/Loadable";

const Login = Loadable({
    loader: () => import("./Login")
});
const Entry = Loadable({
    loader: () => import("./Entry")
});

// eslint-disable-next-line import/no-anonymous-default-export
export default [
    {
        path: "/admin/login",
        component: Login
    },
    {
        path: "/",
        component: Entry
    }
];
