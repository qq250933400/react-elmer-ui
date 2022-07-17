export interface IScrollViewProps {
    scrollY?: boolean;
    scrollX?: boolean;
    speed?: number;
    children?: any;
    onWheelChangeForX?: boolean;
    onWhellChangeForY?: boolean;
    onScrollX?: Function;
    data?: any;
}

export interface IHScrollBarProps{
    thumbLeft?: number;
    scrollWidth: number;
    width: number;
    onChange?: Function;
    visible?: boolean;
    /** 是否只获取鼠标偏移数据 */
    onlyOffset?:boolean;
}

export interface IVScrollBarProps{
    thumbTop?: number;
    scrollHeight: number;
    height: number;
    onChange?: Function;
    visible?: boolean;
    /** 是否只获取鼠标偏移数据 */
    onlyOffset?:boolean;
}