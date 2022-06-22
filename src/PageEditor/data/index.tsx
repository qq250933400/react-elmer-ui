import { withStore } from "../components/Application";
import { IAppInfo } from "./IAppInfo";
import { withValidate } from "@Component/Validation";

interface IWithStoreDispatchs {
    currentApp: IAppInfo;
}

export const RootStore = withStore<IWithStoreDispatchs>({
    name: "editor",
    dispatch: {
        currentApp: (dispatch) => (data) => dispatch(data, true)
    }
})((props: any) => {
    return props.children;
});

export const useRootStore = RootStore.useData;

export const EmitValidation = withValidate({ emitValidate: true })((props: any) => {
    return props.children;
});
