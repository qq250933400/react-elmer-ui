import React, { ChangeEvent, useCallback,useState, useMemo, useEffect } from "react";
import styles from "../style.module.scss";
import utils from "../../utils";

type TypeLineInputProps = {
    label: string;
    btnSendText?: string;
    className?: string;
    type?: "text" | "number" | "mobile" | "password";
    onChange?: Function;
    onBeforeSend():Promise<any>;
    maxLength?: number;
    defaultValue?: string;
};

const VerifyCodeInput = (props: TypeLineInputProps) => {
    const [ sendDisabled, setSendDisabled ] = useState(false);
    const [ timeoutText, setTimeoutText ] = useState("已发送");
    const [ SendSMS, setSendSMS ] = useState(false);
    const onChange = useCallback((event: ChangeEvent) =>{
        const value = (event.target as HTMLInputElement).value;
        typeof props.onChange === "function" && props.onChange(value);
    },[props]);
    const timeTick = useCallback((timeCount: number) => {
        let timeout = timeCount;
        const timeHandler = setInterval(()=> {
            if(timeout > 1) {
                timeout -= 1;console.log("run_time_", timeout);
                setTimeoutText(`已发送(${timeout}s)`);
            } else {
                setSendDisabled(false);
                setSendSMS(false);
                clearInterval(timeHandler);
            }
        }, 1000);
        return timeHandler;
        
    }, [setTimeoutText, setSendDisabled]);
    const onSendClick = useCallback(()=> {
        if(!sendDisabled) {
            props.onBeforeSend().then(() => {
                console.log("send-success");
                setSendDisabled(true);
                setSendSMS(true);
            });
        }
    }, [sendDisabled, props]);
    const sendProps = useMemo(() => {
        if(sendDisabled) {
            return {
                disabled: true
            };
        } else {
            return {};
        }
    }, [sendDisabled]);
    const sendButtonText = useMemo(() => {
        if(!sendDisabled) {
            return props.btnSendText || "发送验证码";
        } else {
            return timeoutText;
        }
    }, [props, sendDisabled, timeoutText]);
    useEffect(()=>{
        if(SendSMS) {
            const timeHandler = timeTick(90);
            return () => {
                clearInterval(timeHandler);
            }
        }
    },[ SendSMS,timeTick ]);
    return (
        <div className={utils.cn(styles.lineInput, props.className)}>
            <div>
                <label className={styles.lineInputLabel}>{props.label}</label>
                <div className={utils.cn(styles.lineInputBox, styles.verifyCodeInput)} >
                    <input defaultValue={props.defaultValue || ""} maxLength={props.maxLength} type={props.type || "text"} onChange={onChange}/>
                    <button {...sendProps} onClick={onSendClick}>{ sendButtonText}</button>
                </div>
            </div>
        </div>
    );
};

export default VerifyCodeInput;
