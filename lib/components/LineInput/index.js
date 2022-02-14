import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from "react";
import styles from "../style.module.scss";
const LineInput = (props) => {
    const onChange = useCallback((event) => {
        const value = event.target.value;
        typeof props.onChange === "function" && props.onChange(value);
    }, [props]);
    const onKeydown = useCallback((event) => {
        if (props.type === "mobile") {
            if (event.key === "Backspace" || /^[\d]$/.test(event.key)) {
                if (event.key !== "Backspace" && event.target.value.length >= 11) {
                    event.preventDefault();
                    event.stopPropagation();
                    typeof event.stopImmediatePropagation === "function" && event.stopImmediatePropagation();
                    return false;
                }
            }
            else {
                event.preventDefault();
                event.stopPropagation();
                typeof event.stopImmediatePropagation === "function" && event.stopImmediatePropagation();
                return false;
            }
        }
    }, [props]);
    return (_jsx("div", Object.assign({ className: styles.lineInput }, { children: _jsxs("div", { children: [_jsx("label", Object.assign({ className: styles.lineInputLabel }, { children: props.label }), void 0),
                _jsx("div", Object.assign({ className: styles.lineInputBox }, { children: _jsx("input", { defaultValue: props.defaultValue || "", onKeyDown: onKeydown, maxLength: props.maxLength, type: props.type || "text", onChange: onChange }, void 0) }), void 0)] }, void 0) }), void 0));
};
export default LineInput;
