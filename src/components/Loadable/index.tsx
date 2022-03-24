import { ReactComponentElement } from "react";
import Loadable from "react-loadable";

type TypeLoadableOptions = {
    loader: () => Promise<any>;
    loading?: ReactComponentElement<any,any>
};

const Loading = () => {
    return <div>Loading</div>
};

const LoadableComponent = (options: TypeLoadableOptions) => {
    return Loadable({
        loader: options.loader,
        loading: options.loading as any || Loading
    });
};

export default LoadableComponent;
