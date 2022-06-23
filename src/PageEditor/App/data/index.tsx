import { IAppData } from "../../data/IAppInfo";
import { withStore } from "../../components/Application";

type TypeAppStore = {
    appData: IAppData
}

export const AppStore = withStore<TypeAppStore>({
    name: "app",
    dispatch: {
        appData: (dispatch) => (data) => dispatch(data)
    }
})((props:any)=>{
    return props.children;
});

export const useApp = AppStore.useData;