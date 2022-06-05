import { useEffect } from "react";
import { withModel } from "../components/Window";
import { editApp } from "../config";

export const WindowOperate = withModel()((props) => {
    useEffect(()=>{
        return editApp.on("onCreateWindow", (options) => {
            props.withModelApi.createWindow(options);
        }) as any;
    }, [props.withModelApi]);
    return (
        <>{props.children}</>
    );
});