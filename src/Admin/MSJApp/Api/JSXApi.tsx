import { TypeAttachApiFunc } from "@MSJApp";

type TypeApiState = {
    showLoading: boolean;
};

export type TypeApiEvent = {
    onShowLoading(visible: boolean): void;
};

const apiState: TypeApiState = {
    showLoading: false
};



export type TypeJSXApi = {
    /**
     * 显示Loading
     */
    showLoading(): void;
    /**
     * 隐藏Loading
     */
    hideLoading(): void;
};

export const JSXApi: TypeAttachApiFunc<TypeJSXApi, TypeApiEvent> = {
    showLoading: (api) => () => {
        if(!apiState.showLoading) {
            apiState.showLoading = true;
            api.emit("onShowLoading", true);
        }
    },
    hideLoading: (api) => () => {
        apiState.showLoading = false;
        api.emit("onShowLoading", false);
    }
};