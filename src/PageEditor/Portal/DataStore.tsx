import { withStore } from "../components/Application/withStore";

interface IFileInfo {
    fileName: string;
    name: string;
    path: string;
}

interface IPortalStore {
    openHistory: IFileInfo[];
}

export const StoreContainer = withStore<IPortalStore>({
    name: "portal",
    dispatch: {
        openHistory: (dispatch: Function, root: any) => (data) => dispatch(data)
    }
})(
    (props: any) => {
        return (props.children);
    }
);

export const useStore = StoreContainer.useData;
