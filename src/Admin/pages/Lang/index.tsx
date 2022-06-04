import { useInitData } from "@Admin/hooks";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { withTable } from "@HOC/withTable";
import { useI18n } from "@HOC/withI18n";
import { FormattedMessage } from "react-intl";
import SearchBox from "./Search";
import Langs from "./Langs";
import { utils } from "elmer-common";
import { usePHB } from "@Admin/hooks/usePHB";
import { Button } from "antd";

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
        pageSize: 20
    }
})((props) => {
    const data = useInitData();
    const i18n = useI18n();
    const [ locale ] = useState(i18n.getLocale());
    const [ searchData, setSearchData ] = useState<any>({});
    const [ evtBtnName, setEvtBtnName ] = useState("search");
    const [ isEditRow, setIsEditRow ] = useState(false);
    const sourceData = useMemo(() => {
        return data?.data || {};
    }, [data]);
    const lngList = useMemo<string[]>(() => data.lngList || [], [data]);
    const listData = useMemo(()=>{
        return sourceData[locale] || [];
    }, [sourceData, locale]);
    useEffect(()=>{
        const columnList: any[] = [
            {
                title: <FormattedMessage id="lng_id"/>,
                dataIndex: "key",
                width: 240,
                fixed: "left"
            }
        ];
        lngList.forEach((lng) => {
            columnList.push({
                dataIndex: lng,
                title: <FormattedMessage id={lng}/>,
                editable: true,
                placeHolder: <FormattedMessage id="lngPlaceHolder"/>
            });
        });
        columnList.push({
            dataIndex: "key",
            title: <label style={{textAlign: "center", display: "block"}}><FormattedMessage id="lng_operate"/></label>,
            width: 140,
            fixed: "right",
            render: (id: string) => {
                const isEdit = props.tableApi.getEditKey() === id && isEditRow;
                return (
                    <section style={{textAlign: "center", display: "block"}}>
                        <Button type="link" size="small" onClick={() => {
                            if(props.tableApi.getEditKey() === id) {
                                if(isEditRow) {
                                    props.tableApi.setEditKey("");
                                    setIsEditRow(false);
                                } else {
                                    props.tableApi.setEditKey(id);
                                    setIsEditRow(true);
                                }
                            } else {
                                props.tableApi.setEditKey(id);
                                setIsEditRow(true);
                            }
                        }}>
                            { !isEdit && <FormattedMessage id="btnEdit"/> }
                            { isEdit && <FormattedMessage id="btnSave"/> }
                        </Button>
                        <Button type="link" size="small"><FormattedMessage id="btnDel"/></Button>
                    </section>
                );
            }
        });
        props.tableApi.setColumn(columnList);
    },[lngList, isEditRow, props.tableApi]);
    useEffect(()=>{
        const sourceData = data.srcData || {};
        const txtId = searchData.textId;
        const text:string = searchData.text;
        const newListData: any[] = [];
        listData.forEach((keyData: any, index: number) => {
            let isMatched = false;
            if(!utils.isEmpty(txtId)) {
                isMatched = keyData.key.indexOf(txtId) >= 0;
            } else {
                if(utils.isEmpty(text)) {
                    isMatched = true;
                }
            }
            lngList.forEach((lng) => {
                const lngData = sourceData[lng];
                const lngText:string = lngData[keyData.key]||"";
                listData[index][lng] = lngData[keyData.key];
                if(!utils.isEmpty(text)) {
                    if(lngText.toLowerCase().indexOf(text.toLowerCase())>=0) {
                        isMatched = true;
                    }
                } else {
                    if(isMatched) {
                        isMatched = true;
                    }
                }
            });
            if(isMatched) {
                newListData.push({
                    ...listData[index]
                });
            }
        });
        props.tableApi.setData(newListData);
    }, [listData,lngList,searchData, data, props.tableApi]);
    usePHB((evt) => {
        setEvtBtnName(evt.name || "lang");
    });
    return <>
        { evtBtnName === "search" && <SearchBox onSearch={(data:any) => setSearchData(data)}/> }
        { evtBtnName === "lang" && <Langs />  }
        {props.children}
    </>;
});

export default Lang;