import { useEffect } from "react";
export const useResize = (callback: Function) => {
    useEffect(() => {
        let isUnmount = false;
        let handler: number;
        let resizeState: any = null;
        const reqAnimationFrame = window.requestAnimationFrame ||
            (window as any).webkitRequestAnimationFrame ||
            (window as any).mozRequestAnimationFrame ||
            (window as any).msRequestAnimationFrame ||
            (window as any).oRequestAnimationFrame || ((fn) => setTimeout(fn, 60));
        const cancelAnimationFrame = window.cancelAnimationFrame ||
            (window as any).webkitCancelAnimationFrame ||
            (window as any).mozCancelAnimationFrame ||
            (window as any).msCancelAnimationFrame ||
            (window as any).ORequestAnimationFrame || ((id: number) => clearTimeout(id))
        const onResizeListen = () => {
            if (handler) {
                cancelAnimationFrame(handler);
            }
            if (!isUnmount) {
                if (typeof callback === "function") {
                    resizeState = callback(resizeState);
                }
                handler = reqAnimationFrame(onResizeListen);
            }
        }
        onResizeListen();
        return () => {
            if(handler) {
                cancelAnimationFrame(handler);
            }
            isUnmount = true;
        };
    });
}