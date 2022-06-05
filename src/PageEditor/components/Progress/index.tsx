import { useMemo } from "react";
import styles from "../style.module.scss";
import { cn } from "../../../utils";

type TypeProgressProps = {
    max: number;
    value: number;
};

export const Progress = ({ max, value }: TypeProgressProps) => {
    const thumWidth = useMemo(()=>{
        return max <= value || max <= 0 ? "100%" : ((value / max) * 100).toFixed(2) + "%";
    }, [max, value]);
    return (
        <div className={cn(styles.progress, "Progress")}>
            <i style={{width: thumWidth}}/>
        </div>
    );
};