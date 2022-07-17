import React, { createContext, useCallback, useMemo, useRef, useState } from "react";
import HScrollBar from "./HScrollBar";
import VScrollBar from "./VScrollBar";
import style from "./styles.module.scss";
import { useResize } from "../../hook";
import { useThumbSize } from "./useThumbSize";
import { IScrollViewProps } from "./IScrollProps";

const ScrollContext = createContext({
    viewWidth: 0,
    viewHeight: 0,
    scrollWidth: 0,
    scrollHeight: 0,
    data: {}
});

const ScrollView = (props: IScrollViewProps) => {
    const ctRef = useRef<HTMLDivElement>(null);
    const [slideData] = useState({
        viewHeight: 0,
        viewWidth: 0,
        scrollHeight: 0,
        scrollTop: 0,
        scrollThumbHeight: 0,
        scrollWidth: 0,
        scrollLeft: 0,
        scrollThumbWidth: 0
    });
    const [speed] = useState(props.speed || 8);
    const [heightInfo, setHeightInfo] = useState({
        height: 0,
        scrollHeight: 0
    });
    const [widthInfo, setWidthInfo] = useState({
        width: 0,
        scrollWidth: 0
    });
    const [scrollTop, setScrollTop] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const vScrollThumbHeight = useThumbSize(heightInfo.height, heightInfo.scrollHeight);
    const vScrollThumbWidth = useThumbSize(widthInfo.width, widthInfo.scrollWidth);
    const onContextwheel = useCallback((event: React.WheelEvent) => {
        const scrollSpeed = speed;
        if (props.scrollY) {
            if (props.onWhellChangeForY) {
                if (event.deltaY > 0) {
                    if (scrollTop + vScrollThumbHeight + scrollSpeed <= heightInfo.height) {
                        slideData.scrollTop = scrollTop + scrollSpeed;
                        setScrollTop(slideData.scrollTop);
                    } else {
                        if (scrollTop !== heightInfo.height - vScrollThumbHeight){
                            slideData.scrollTop = heightInfo.height - vScrollThumbHeight
                            setScrollTop(slideData.scrollTop);
                        }
                    }
                } else {
                    if (scrollTop - scrollSpeed >= 0) {
                        slideData.scrollTop = scrollTop - scrollSpeed;
                        setScrollTop(slideData.scrollTop);
                    } else {
                        if (scrollTop !== 0) {
                            slideData.scrollTop =0;
                            setScrollTop(0);
                        }
                    }
                }
            }
        } else {
            if (props.scrollX && props.onWheelChangeForX) {
                if (event.deltaX > 0) {
                    if (scrollLeft + vScrollThumbWidth + scrollSpeed <= widthInfo.width) {
                        slideData.scrollLeft = scrollLeft + scrollSpeed;
                        setScrollLeft(slideData.scrollLeft);
                    } else {
                        if (scrollLeft !== widthInfo.width - vScrollThumbWidth) {
                            slideData.scrollLeft = widthInfo.width - vScrollThumbWidth;
                            setScrollLeft(slideData.scrollLeft);
                        }
                    }
                } else {
                    if(scrollLeft - scrollSpeed >= 0) {
                        slideData.scrollLeft = scrollLeft - scrollSpeed;
                        setScrollLeft(slideData.scrollLeft);
                    } else {
                        if(scrollLeft !== 0) {
                            slideData.scrollLeft = 0;
                            setScrollLeft(0);
                        }
                    }
                }
            }
        }
    },[speed, vScrollThumbHeight, vScrollThumbWidth, widthInfo, heightInfo, props, scrollLeft, scrollTop, slideData]);
    const contextstyle = useMemo(() => {
        const styleData: any = {};
        let offsetY = 0;
        let offsetX = 0;
        if (props.scrollY) {
            offsetY = (heightInfo.scrollHeight - heightInfo.height) * (scrollTop / (heightInfo.height - vScrollThumbHeight));
        }
        if (props.scrollX) {
            const offsetxPercent = scrollLeft / (widthInfo.width - vScrollThumbWidth);
            offsetX = (widthInfo.scrollWidth - widthInfo.width) * offsetxPercent;
            if (typeof props.onScrollX === "function") {
                props.onScrollX({
                    value: isNaN(offsetX) ? 0 : offsetX,
                    offset: isNaN(offsetxPercent) ? 0 : offsetxPercent
                });
                offsetX = 0;
            }
        }
        offsetY = isNaN(offsetY) ? 0 : offsetY;
        offsetX = isNaN(offsetX) ? 0 : offsetX;
        styleData.transform = `translate3d(-${offsetX}px,-${offsetY}px,0px)`;
        return styleData;
    },[scrollTop, scrollLeft, heightInfo, widthInfo, vScrollThumbHeight, vScrollThumbWidth, props]);
    const onVScrollChange = useCallback((data: any) => {
        const offset = data.offset;
        const slideHeight = heightInfo.height - vScrollThumbHeight;
        const scrollTopTo = slideHeight * offset;
        if(scrollTopTo >= 0 && scrollTopTo <= slideHeight) {
            slideData.scrollTop = scrollTopTo;
            setScrollTop(scrollTopTo);
        } else {
            if(scrollTopTo < 0) {
                slideData.scrollTop = 0;
                scrollTop !== 0 && setScrollTop(0);
            } else {
                slideData.scrollTop = slideHeight;
                scrollTop !== slideHeight && setScrollTop(slideData.scrollTop);
            }
        }
    }, [heightInfo, scrollTop, vScrollThumbHeight, slideData]);
    const onHScrollChange = useCallback((data: any) => {
        const offset = data.offset;
        const slideWidth = widthInfo.width - vScrollThumbWidth;
        const scrollLeftTo = slideWidth * offset;
        if(scrollLeftTo >= 0 && scrollLeftTo <= slideWidth) {
            slideData.scrollLeft = scrollLeftTo;
            setScrollLeft(scrollLeftTo);
        } else {
            if(scrollLeftTo < 0) {
                slideData.scrollLeft = 0;
                scrollLeft !== 0 && setScrollLeft(0);
            } else {
                slideData.scrollLeft = slideWidth;
                scrollLeft !== slideWidth && setScrollLeft(slideData.scrollLeft);
            }
        }
    }, [widthInfo,scrollLeft, vScrollThumbWidth, slideData]);
    const hasHorizontal = useMemo(() => (props.scrollX && widthInfo.scrollWidth > widthInfo.width), [props.scrollX, widthInfo]);
    const hasVertial = useMemo(() => (props.scrollY && heightInfo.scrollHeight > heightInfo.height), [props.scrollY, heightInfo]);
    const contextClassName =  useMemo(() => {
        const strArr: string[] = [style.scrollView];
        if(hasHorizontal && !hasVertial) {
            strArr.push("OnlyHorizontal");
        } else if(!hasHorizontal && hasVertial) {
            strArr.push("OnlyVertical");
        } else if(hasHorizontal && hasVertial) {
            strArr.push("Both");
        }
        return strArr.join(" ");
    }, [hasHorizontal, hasVertial]);
    const ChildrenWrapper = useMemo(() => props.children, [props.children]);
    const ContextData = useMemo(() => ({
        viewWidth: widthInfo.width,
        viewHeight: heightInfo.height,
        scrollWidth: widthInfo.scrollWidth,
        scrollHeight: heightInfo.scrollHeight,
        data: props.data
    }), [widthInfo, heightInfo, props.data]);
    useResize((saveSize: string) => {
        if(ctRef.current) {
            const container = ctRef.current;
            const parent = (container.parentElement as HTMLDivElement);
            const height = parent.clientHeight;
            const width = parent.clientWidth;
            const scrollHeight = container.clientHeight;
            const scrollWidth = container.clientWidth;
            const sizeID = [scrollHeight, scrollWidth].join("|");
            if(saveSize !== sizeID) {
                if(slideData.viewHeight !== height || slideData.scrollHeight !== scrollHeight) {
                    slideData.viewHeight = height;
                    slideData.scrollHeight = scrollHeight;
                    setHeightInfo({
                        height,
                        scrollHeight
                    });
                    if(scrollHeight <= height) {
                        setScrollTop(0);
                    } else if(slideData.scrollTop > height - slideData.scrollThumbHeight) {
                        setScrollTop(height - slideData.scrollThumbHeight);
                    }
                }
                if(slideData.viewWidth !== width || slideData.scrollWidth !== scrollWidth) {
                    slideData.viewWidth = width;
                    slideData.scrollWidth = scrollWidth;
                    setWidthInfo({
                        width,
                        scrollWidth
                    });
                    if(scrollWidth <= width) {
                        setScrollTop(0);
                    } else if(slideData.scrollLeft > width - slideData.scrollThumbWidth) {
                        setScrollTop(width - slideData.scrollThumbWidth);
                    }
                }
            }
            return sizeID;
        }
    });
    return (<ScrollContext.Provider value={ContextData}>
        <div className={contextClassName}>
            <div className={style.scrollViewContext} onWheel={onContextwheel}>
                <div className={style.mask}>
                    <div style={contextstyle} ref={ctRef} className={style.scrollViewWrapper}>{ChildrenWrapper}</div>
                </div>
            </div>
            {
                props.scrollX && (<HScrollBar
                    visible={hasHorizontal}
                    scrollWidth={widthInfo.scrollWidth}
                    thumbLeft={scrollLeft}
                    width={widthInfo.width}
                    onChange={onHScrollChange}
                    onlyOffset
                />)
            }
            {
                props.scrollY && (<VScrollBar
                    visible={hasVertial}
                    scrollHeight={heightInfo.scrollHeight}
                    thumbTop={scrollTop}
                    height={heightInfo.height}
                    onChange={onVScrollChange}
                    onlyOffset
                />)
            }
        </div>
    </ScrollContext.Provider>);
};

export { default as HScrollBar } from "./HScrollBar";
export { default as VScrollBar } from "./VScrollBar";

export default ScrollView;
