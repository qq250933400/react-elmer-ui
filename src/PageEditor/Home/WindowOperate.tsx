import { useModel } from "../components/Window/Container";
import { useEffect } from "react";
import { editApp } from "../config";

export const WindowOperate = (props:any) => {
    const modelObj = useModel();
    useEffect(()=>{
        const desCreateWindow = editApp.on("onCreateWindow", (options) => {
            modelObj.createWindow(options);
        }) as any;
        const desAlert = editApp.on("onCreateAlert", (options) => {
            modelObj.alert(options);
        }) as any;
        const desModal = editApp.on("onCreateModal", (options) => {
            modelObj.modal(options);
        }) as any;
        return () => {
            desCreateWindow();
            desAlert();
            desModal();
        };
    }, [modelObj]);
    return (
        <>{props.children}</>
    );
};