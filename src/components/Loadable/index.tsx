import { ReactComponentElement } from "react";
import Loadable from "@loadable/component";

type TypeLoadableOptions = {
    loader: () => Promise<any>;
    loading?: ReactComponentElement<any,any>
};

// const Loading = () => {
//     return <div>Loading</div>
// };

const LoadableComponent = (options: TypeLoadableOptions) => {
    return Loadable(options.loader);
};

export default LoadableComponent;
