import { useEffect, useState, useMemo } from "react";

type TypeRect = {
    left: number,
    top: number;
    right: number;
    bottom: number;
};
type TypeMoveData = { left?: number, top?: number, offsetLeft?: number, offsetTop?: number };
type TypeUseDragOptions = {
    moveTarget?: HTMLElement|null;
    limitRect?: TypeRect;
    onlyOffset?: boolean;
    onChange?: (data: TypeMoveData) => void;
};

export const useNodeDrag = (target:HTMLElement|null, options?: TypeUseDragOptions) => {
    const [ dragState ] = useState({
        isPressed: false,
        offsetX: 0,
        offsetY: 0
    });
    const moveTarget = useMemo(() => options?.moveTarget || target, [target,options?.moveTarget]);
    const limitRect = useMemo(() => {
        if(options?.limitRect) {
            return options.limitRect;
        } else {
            return {
                left: 0,
                top: 0,
                right: document.body.clientWidth,
                bottom: document.body.clientHeight
            }
        }
    }, [options?.limitRect]);
    useEffect(() => {
        if(target) {
            const onPress = (event: MouseEvent | TouchEvent) => {
                if(event instanceof MouseEvent) {
                    dragState.offsetX = event.clientX;
                    dragState.offsetY = event.clientY;
                } else if(event instanceof TouchEvent) {
                    dragState.offsetX = event.touches[0].clientX;
                    dragState.offsetY = event.touches[0].clientY;
                }
                dragState.isPressed = true;
            };
            const onMove = (event: MouseEvent|TouchEvent) => {
                if(dragState.isPressed && moveTarget) {
                    const nodeX = moveTarget.offsetLeft, nodeY = moveTarget.offsetTop;
                    let mouseX = 0, mouseY = 0;
                    if(event instanceof MouseEvent) {
                        mouseX = event.clientX;
                        mouseY = event.clientY;
                    } else if(event instanceof TouchEvent) {
                        mouseX = event.touches[0].clientX;
                        mouseY = event.touches[0].clientY;
                    }
                    if(!options?.onlyOffset) {
                        const moveLeft = nodeX + (mouseX - dragState.offsetX),
                            moveTop = nodeY + (mouseY - dragState.offsetY);
                        if(moveLeft >= limitRect.left && moveLeft < limitRect.right && moveTop >= limitRect.top && moveTop <limitRect.bottom) {
                            moveTarget.style.left = moveLeft + "px";
                            moveTarget.style.top = moveTop + "px";
                        }
                        typeof options?.onChange === "function" && options?.onChange({
                            left: moveLeft,
                            top: moveTop
                        });
                    } else {
                        typeof options?.onChange === "function" && options?.onChange({
                            offsetLeft: mouseX - dragState.offsetX,
                            offsetTop: mouseY - dragState.offsetY
                        });
                    }
                    dragState.offsetX = mouseX;
                    dragState.offsetY = mouseY;
                }
            };
            const onMoveEnd = () => {
                dragState.isPressed = false;
            }
            target.addEventListener("mousedown", onPress);
            target.addEventListener("touchstart", onPress);
            document.body.addEventListener("mousemove", onMove);
            document.body.addEventListener("touchmove", onMove);
            document.body.addEventListener("mouseup", onMoveEnd);
            document.body.addEventListener("touchend", onMoveEnd);
            return () => {
                target.removeEventListener("mousedown", onPress);
                target.removeEventListener("touchstart", onPress);
                document.body.removeEventListener("mousemove", onMove);
                document.body.removeEventListener("touchmove", onMove);
                document.body.removeEventListener("mouseup", onMoveEnd);
                document.body.removeEventListener("touchend", onMoveEnd);
            };
        }
    }, [ target, options, dragState, moveTarget,limitRect]);
};