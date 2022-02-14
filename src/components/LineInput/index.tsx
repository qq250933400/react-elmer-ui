import React, { ChangeEvent, useCallback } from "react";
import styles from "../style.module.scss";

type TypeLineInputProps = {
    label: string;
    type?: "text" | "number" | "mobile" | "password";
    onChange?: Function;
    maxLength?: number;
    defaultValue?: string;
};

const LineInput = (props: TypeLineInputProps) => {
    const onChange = useCallback((event: ChangeEvent) =>{
        const value = (event.target as HTMLInputElement).value;
        typeof props.onChange === "function" && props.onChange(value);
    },[props]);
    const onKeydown = useCallback((event: KeyboardEvent) =>{
        if(props.type === "mobile") {
            if(event.key === "Backspace" || /^[\d]$/.test(event.key)) {
                if(event.key !== "Backspace" && (event.target as HTMLInputElement).value.length >= 11) {
                    event.preventDefault();
                    event.stopPropagation();
                    typeof event.stopImmediatePropagation === "function" && event.stopImmediatePropagation();
                    return false;
                }
            } else {
                event.preventDefault();
                event.stopPropagation();
                typeof event.stopImmediatePropagation === "function" && event.stopImmediatePropagation();
                return false;
            }
        }
    }, [props]);
    return (
        <div className={styles.lineInput}>
            <div>
                <label className={styles.lineInputLabel}>{props.label}</label>
                <div className={styles.lineInputBox} >
                    <input defaultValue={props.defaultValue || ""} onKeyDown={onKeydown as any} maxLength={props.maxLength} type={props.type || "text"} onChange={onChange}/>
                </div>
            </div>
        </div>
    );
};

export default LineInput;
