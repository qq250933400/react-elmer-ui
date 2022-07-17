import React, { useRef, useMemo, useState } from "react";
import style from "./styles.module.scss";
import { useNodeDrag, useResize } from "../../hook";
import { useThumbSize } from "./useThumbSize";
import { IHScrollBarProps } from "./IScrollProps";

const HScrollBar = (props: IHScrollBarProps) => {
    const thumbRef = useRef<HTMLButtonElement>(null);
    const trackerRef = useRef<HTMLDivElement>(null);
    const [ barWidth, setBarWidth ] = useState(props.width || 0);
    const thumbWidth = useThumbSize(barWidth, props.scrollWidth)
    const buttonstyle = useMemo(() => {
        return {
            width: isNaN(thumbWidth) ? "100%" : thumbWidth,
            left: props.thumbLeft || 0
        };
    }, [thumbWidth, props.thumbLeft]);
    const slideWidth = useMemo(() => barWidth - thumbWidth, [barWidth, thumbWidth]);
    useNodeDrag(thumbRef.current as any, {
        limitRect: {
            left: 0,
            top: 0,
            right: slideWidth,
            bottom: 1
        },
        onlyOffset: props.onlyOffset,
        onChange: (data: any) => {
            const offsetleft = data.offsetLeft || 0;
            const thumbLeft = props.thumbLeft || 0;
            const offLeft = thumbLeft + offsetleft;
            typeof props.onChange === "function" && props.onChange({
                left: offLeft,
                offset: offLeft / slideWidth
            });
        }
    });
    useResize((_state: number) => {
        if(trackerRef.current) {
            const width = trackerRef.current.clientWidth;
            if(_state !== width) {
                setBarWidth(width);
            }
            return width;
        }
    });
    return (
        <div className={style.hScrollBar} style={{ display: props.visible ? "block" : "none" }}>
            <div ref={trackerRef} className={style.hScrollBarTracker}>
                <button ref={thumbRef} style={buttonstyle}/>
            </div>
        </div>
    );
};

export default HScrollBar;