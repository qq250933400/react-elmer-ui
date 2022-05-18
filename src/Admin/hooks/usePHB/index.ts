import { useEffect } from "react";
import { IPageHeadButton } from "@Admin/MSJApp/Types/IPageInfoEx";
import { msjApi } from "@Admin/MSJApp";

type TypePHBClickEvent = {
    name?: string;
    id?: string;
    buttons: IPageHeadButton[];
};
type TypePHBEventCallback = (evt: TypePHBClickEvent) => void;

export const usePHB = (callback: TypePHBEventCallback) => {
    useEffect(() => {
        const destoryPHBEvent = msjApi.on("onPHBClick", (vEvt)=>{
            typeof callback === "function" && (callback as Function)(vEvt);
        });
        return () => destoryPHBEvent();
    }, [ callback ]);
};