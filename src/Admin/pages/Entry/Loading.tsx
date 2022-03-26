import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import styles from "./style.module.scss";
import { cn } from "../../../utils";

type TypeLoadingProps = {
    visible?: boolean;
    children?: any;
};

const Loading = (props: TypeLoadingProps) => {
    const [ visible, setVisible ] = useState(props.visible);
    const [ animation, setAnimation ] = useState(props.visible ? styles.animationFadeIn : null);
    const [ landingState ] = useState({
        show: props.visible
    });
    const onAnimationEnd = useCallback(() => {
        if(!landingState.show) {
            setVisible(false);
        }
    }, [landingState]);
    useEffect(()=>{
        if(props.visible) {
            landingState.show = true;
            setAnimation(styles.animationFadeIn);
            setVisible(props.visible);
        } else {
            landingState.show = false;
            setAnimation(styles.animationZoomout);
        }
    },[props.visible, landingState]);

    return visible ? createPortal((
        <div className={cn(styles.loading, animation)} onAnimationEnd={onAnimationEnd}>
            <div>
                { props.children }
            </div>
        </div>
    ), document.body) : null;
};

export default Loading;
