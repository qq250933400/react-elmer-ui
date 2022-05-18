import React, { useEffect, useMemo, useState } from "react";
import styles from "./style.module.scss";
import { Content } from "antd/lib/layout/layout";
import { IPageInfoEx } from "@Admin/MSJApp/Types/IPageInfoEx";
import { PageHeader } from "antd";
import { FormattedMessage } from "react-intl";
import { ReadOutlined, LeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { msjApi } from "@Admin/MSJApp";

type TypePageContainerProps = {
    children: any;
    currentPage?: IPageInfoEx;
};


const PageContainer = (props: TypePageContainerProps) => {
    const [ page, setPage ] = useState(props.currentPage);
    const [ showBack ] = useState(false);
    const [ buttons, setButtons ] = useState<any[]>([]);
    const BackIcon = useMemo(()=>{
        return showBack ? <LeftOutlined /> : <ReadOutlined />
    },[showBack]);
    const HeaderButtons = useMemo(()=>{
        const buttonsResult:any[] = [];
        if(buttons && buttons.length > 0) {
            buttons.forEach((btn, index) => {
                const attrs = btn.attrs || {};
                buttonsResult.push((
                    <Button
                        {...attrs}
                        key={`headBtn_${index}`}
                        id={btn.id}
                        name={btn.name}
                        className={btn.className}
                        onClick={()=>{
                            msjApi.callApi("admin","onPageHeaderButtonClick", {
                                evtBtn: btn,
                                path: page?.path,
                                buttons: page?.buttons
                            });
                        }}
                    >
                        <FormattedMessage id={btn.title}/>
                    </Button>
                ));
            });
        }
        return buttonsResult;
    }, [ page, buttons ]);
    useEffect(()=>{
        setButtons((props.currentPage ? props.currentPage.buttons || [] : []) as any[]);
        setPage(props.currentPage);
    },[props.currentPage]);
    useEffect(()=>{
        const destoryOnClickEvent = msjApi.on("onPHBClick", (evt)=>{
            setButtons(evt.buttons || []);
        });
        return () => destoryOnClickEvent()
    },[]);
    return (
        <div className={styles.admin_layout_content_pt}>
            {
                page && page.fullPage && !page.override && (
                    <Content className={styles.admin_layout_content}>
                        {props.children}
                    </Content>
                )
            }
            {
                page && page.override ? props.children : <></>
            }
            {
                (!page || (!page.fullPage && !page.override)) && (
                    <Content className={styles.admin_layout_content}>
                        <PageHeader
                            className={styles.admin_layout_header}
                            onBack={() => null}
                            backIcon={BackIcon}
                            subTitle={page?.title ? <FormattedMessage id={page?.title}/> : <span>&nbsp;</span>}
                            extra={HeaderButtons}
                        />
                        <div className={styles.admin_layout_container}>
                            <div>
                                {props.children}
                            </div>
                        </div>
                    </Content>
                )
            }
        </div>
    );
};

export default PageContainer;
