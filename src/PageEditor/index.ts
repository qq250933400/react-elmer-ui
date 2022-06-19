import loadable from "@Component/Loadable";
import "./appConfig";

export const HomePage = loadable({
    loader: () => import(/* webpackChunkName: 'PageEditor_Home' */"./Home")
});
