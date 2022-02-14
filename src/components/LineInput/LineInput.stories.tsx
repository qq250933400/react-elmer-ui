import React from 'react';
import { storiesOf } from '@storybook/react';
import LineInput from "./index";
import VerifyCodeInput from "../VerifyCodeInput";
import style from "./LineInput.stories.scss";

storiesOf('Input', module)
    .add('Text Input Field', () => (  // 一个 add 表示添加一个 story
        <div className={style.lineInputStories}>
            <div>
                <LineInput label='登录账号' type='text' maxLength={20} />
                <p />
                <LineInput label='登录密码' type='password' maxLength={20} />
            </div>
        </div>
    ))
    .add('Verify Code input', () => (
        <div className={style.lineInputStories}>
            <div>
                <LineInput label='登录账号' type='text' maxLength={20} />
                <p />
                <VerifyCodeInput label='验证码' onBeforeSend={()=>{
                    return new Promise((resolve) => {
                        setTimeout(()=>{
                            resolve({});
                        }, 1000);
                    })
                }}/>
                <p/>
                <LineInput label='登录密码' type='password' maxLength={20} />
            </div>
        </div>
    ));