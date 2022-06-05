import React, { useState } from "react";
import { IWindowProps } from "./IWindowModel";
import { useModel } from "./Container";

interface IWithModelApi {
    createWindow(option: IWindowProps): void;
};
interface IWithModelProps {
    withModelApi: IWithModelApi;
};

export const withModel = () => (TargetWrapper: React.ComponentType<IWithModelProps>) => {
    return (props: any) => {
        const modelObj = useModel();
        const [ api ] = useState<IWithModelApi>({
            createWindow: modelObj.createWindow
        });
        return (
            <TargetWrapper {...props} withModelApi={api}/>
        );
    };
};

export const createModel = (options: any) => {
    
};