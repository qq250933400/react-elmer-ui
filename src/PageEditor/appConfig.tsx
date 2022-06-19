import { editApp } from "./config";
import loadable from "@Component/Loadable";

const Loading = loadable({
    loader: () => import("./components/Loading")
});

editApp.registeApp({
    name: "showLoading",
    render: Loading
});
