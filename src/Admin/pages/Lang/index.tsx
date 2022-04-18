import { useInitData } from "@Admin/hooks";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { withTable } from "@HOC/withTable";
import { I18nContext } from "@Admin/i18n";
import { FormattedMessage } from "react-intl";

const Lang = withTable({
    column: [
        {
            title: "文本ID",
            dataIndex: "key",
            width: 100
        }
    ],
    pagination: {
        position: ["none","bottomLeft"],
        showSizeChanger: true,
        pageSize: 15
    }
})((props) => {
    const data = useInitData();
    const i18n = useContext(I18nContext);
    const [ locale ] = useState(i18n.getLocale());
    const sourceData = useMemo(() => {
        return data.data || {};
    }, [data]);
    const lngList = useMemo<string[]>(() => data.lngList, [data]);
    const listData = useMemo(()=>{
        return sourceData[locale] || [];
    }, [sourceData, locale]);
    useEffect(()=>{
        const columnList: any[] = [
            {
                title: <FormattedMessage id="lng_id"/>,
                dataIndex: "key",
                width: 240
            }
        ];
        lngList.forEach((lng) => {
            columnList.push({
                dataIndex: lng,
                title: <FormattedMessage id={lng}/>,
                editable: true
            });
        });
        props.tableApi.setColumn(columnList);
    },[lngList, props.tableApi]);
    useEffect(()=>{
        const sourceData = data.srcData || {};
        props.tableApi.onPaginationChange = (res:any) => {
            console.log(res);
        }
        listData.forEach((keyData: any, index: number) => {
            lngList.forEach((lng) => {
                const lngData = sourceData[lng];
                listData[index][lng] = lngData[keyData.key];
            });
        });
        props.tableApi.setData(listData);
    }, [listData,lngList, data, props.tableApi]);
   
    console.log(lngList, "----");
    return <>
        <button onClick={() => props.tableApi.showLoading()}>显示loading</button>
        <button onClick={() => props.tableApi.hideLoading()}>隐藏loading</button>
        <span>Hello</span>
        {props.children}
    </>;
});

export default Lang;