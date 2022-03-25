import React, { useCallback } from "react";
import { SoundOutlined } from "@ant-design/icons";
import { notification } from "antd";
import styles from "./style.module.scss";
import utils from "../../../utils";



const Notify = () => {
    const [ api, contextHolder ] = notification.useNotification();
    const onClick = useCallback(()=>{
        api.info({
            message: "通知消息，application",
            description: "描述： hello application ant",
            placement: "bottomRight"
        })
    },[ api ]);
    return (
        <button onClick={onClick} title="20" className={utils.cn(styles.adminTopButton, styles.adminTopButton_notify)}>
            {contextHolder}
            <SoundOutlined />
        </button>
    );
};

export default Notify;
