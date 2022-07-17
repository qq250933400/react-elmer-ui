import React, { useRef, useMemo, useState } from "react";
import style from "./styles.module.scss";
import { useNodeDrag, useResize } from "../../hook";
import { useThumbSize } from "./useThumbSize";
import { IVScrollBarProps } from "./IScrollProps";

const VScrollBar = (props: IVScrollBarProps) => {
    const thumbRef = useRef<HTMLButtonElement>(null);
    const trackerRef = useRef<HTMLDivElement>(null);
    const [ barHeight, setBarHeight ] = useState(props.height || 0);
    const thumbHeight = useThumbSize(barHeight, props.scrollHeight)
    const buttonstyle = useMemo(() => {
        return {
            height: isNaN(thumbHeight) ? "100%" : thumbHeight,
            top: props.thumbTop || 0
        };
    }, [thumbHeight, props.thumbTop]);
    const slideHeight = useMemo(() => barHeight - thumbHeight, [ barHeight, thumbHeight ]);
    useNodeDrag(thumbRef.current as any, {
        limitRect: {
            left: 0,
            top: 0,
            right: 1,
            bottom: barHeight - thumbHeight
        },
        onlyOffset: props.onlyOffset,
        onChange: (data: any) => {
            const offsetTop = data.offsetTop || 0;
            const thumbTop = props.thumbTop || 0;
            const offTop = offsetTop + thumbTop;
            typeof props.onChange === "function" && props.onChange({
                top: offTop,
                offset: offTop / slideHeight
            });
        }
    });
    useResize((_state: number) => {
        if(trackerRef.current) {
            const height = trackerRef.current.clientHeight;
            if(_state !== height) {
                setBarHeight(height);
            }
            return height;
        }
    });
    return (
        <div className={style.vScrollBar} style={{ display: props.visible ? "block" : "none" }}>
            <div ref={trackerRef} className={style.vScrollBarTracker}>
                <button ref={thumbRef} style={buttonstyle}/>
            </div>
        </div>
    );
};

export default VScrollBar;