import React, { useEffect, useMemo, useState } from "react";
import styles from "./style.module.scss";
import { Content } from "antd/lib/layout/layout";
import { IPageInfoEx } from "@Admin/MSJApp/Types/IPageInfoEx";
import { PageHeader } from "antd";
import { FormattedMessage } from "react-intl";
import { ReadOutlined, LeftOutlined } from "@ant-design/icons";
import { Button } from "antd";

type TypePageContainerProps = {
    children: any;
    currentPage?: IPageInfoEx;
};


const PageContainer = (props: TypePageContainerProps) => {
    const [ page, setPage ] = useState(props.currentPage);
    const [ showBack ] = useState(false);
    const BackIcon = useMemo(()=>{
        return showBack ? <LeftOutlined /> : <ReadOutlined />
    },[showBack]);
    const HeaderButtons = useMemo(()=>{
        const buttons:any[] = [];
        if(page && page.buttons && page?.buttons?.length > 0) {
            page.buttons.forEach((btn, index) => {
                buttons.push(<Button key={`headBtn_${index}`} id={btn.id} name={btn.name} className={btn.className}><FormattedMessage id={btn.title}/></Button>);
            });
        }
        return buttons;
    }, [page ]);
    useEffect(()=>{
        setPage(props.currentPage);
    },[props.currentPage]);
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
