import loadable from "@Component/Loadable";

export const HomePage = loadable({
    loader: () => import(/* webpackChunkName: 'PageEditor_Home' */"./Home")
});
