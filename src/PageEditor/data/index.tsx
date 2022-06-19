import { withStore } from "../components/Application";
import { ICurrentApp } from "./ICurrentApp";

interface IWithStoreDispatchs {
    currentApp: ICurrentApp;
}

export const RootStore = withStore<IWithStoreDispatchs>({
    name: "editor",
    dispatch: {
        currentApp: (dispatch) => (data) => dispatch(data)
    }
})((props: any) => {
    return props.children;
});

export const useRootStore = RootStore.useData;
