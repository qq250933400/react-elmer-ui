import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState, useMemo } from "react";
import styles from "../style.module.scss";
import utils from "../../utils";
const VerifyCodeInput = (props) => {
    const [sendDisabled, setSendDisabled] = useState(false);
    const [timeoutText, setTimeoutText] = useState("已发送");
    const onChange = useCallback((event) => {
        const value = event.target.value;
        typeof props.onChange === "function" && props.onChange(value);
    }, [props]);
    const timeTick = useCallback((timeCount) => {
        if (timeCount > 1) {
            setTimeoutText(`已发送(${timeCount}s)`);
            setTimeout(() => timeTick(timeCount - 1), 1000);
        }
        else {
            setSendDisabled(false);
        }
    }, [setTimeoutText, setSendDisabled]);
    const onSendClick = useCallback(() => {
        if (!sendDisabled) {
            props.onBeforeSend().then(() => {
                console.log("send-success");
                setSendDisabled(true);
                timeTick(90);
            });
        }
    }, [sendDisabled, props, timeTick]);
    const sendProps = useMemo(() => {
        if (sendDisabled) {
            return {
                disabled: true
            };
        }
        else {
            return {};
        }
    }, [sendDisabled]);
    const sendButtonText = useMemo(() => {
        if (!sendDisabled) {
            return props.btnSendText || "发送验证码";
        }
        else {
            return timeoutText;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sendDisabled, timeoutText]);
    return (_jsx("div", Object.assign({ className: utils.cn(styles.lineInput, props.className) }, { children: _jsxs("div", { children: [_jsx("label", Object.assign({ className: styles.lineInputLabel }, { children: props.label }), void 0),
                _jsxs("div", Object.assign({ className: utils.cn(styles.lineInputBox, styles.verifyCodeInput) }, { children: [_jsx("input", { defaultValue: props.defaultValue || "", maxLength: props.maxLength, type: props.type || "text", onChange: onChange }, void 0),
                        _jsx("button", Object.assign({}, sendProps, { onClick: onSendClick }, { children: sendButtonText }), void 0)] }), void 0)] }, void 0) }), void 0));
};
export default VerifyCodeInput;
