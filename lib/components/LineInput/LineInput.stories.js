import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { storiesOf } from '@storybook/react';
import LineInput from "./index";
import VerifyCodeInput from "../VerifyCodeInput";
import style from "./LineInput.stories.scss";
storiesOf('Input', module)
    .add('Text Input Field', () => ( // 一个 add 表示添加一个 story
_jsx("div", Object.assign({ className: style.lineInputStories }, { children: _jsxs("div", { children: [_jsx(LineInput, { label: '\u767B\u5F55\u8D26\u53F7', type: 'text', maxLength: 20 }, void 0),
            _jsx("p", {}, void 0),
            _jsx(LineInput, { label: '\u767B\u5F55\u5BC6\u7801', type: 'password', maxLength: 20 }, void 0)] }, void 0) }), void 0)))
    .add('Verify Code input', () => (_jsx("div", Object.assign({ className: style.lineInputStories }, { children: _jsxs("div", { children: [_jsx(LineInput, { label: '\u767B\u5F55\u8D26\u53F7', type: 'text', maxLength: 20 }, void 0),
            _jsx("p", {}, void 0),
            _jsx(VerifyCodeInput, { label: '\u9A8C\u8BC1\u7801', onBeforeSend: () => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve({});
                        }, 1000);
                    });
                } }, void 0),
            _jsx("p", {}, void 0),
            _jsx(LineInput, { label: '\u767B\u5F55\u5BC6\u7801', type: 'password', maxLength: 20 }, void 0)] }, void 0) }), void 0)));
