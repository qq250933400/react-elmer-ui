import React, { useCallback, useMemo, useState } from "react";
import EditableTable from "./EditableTable";
import { IDataItem, IEditConfig, TypeBottomOption, TypeTopOption } from "./IWithTable";

interface IWithTableColumn {
    dataIndex: string;
    title: string|Function|Object;
    width?: number|string;
    key?: string;
    editable?: boolean;
    render?: Function;
}

interface IWithTableOption<T={}> {
    column: IWithTableColumn[];
    data?: (IDataItem & T)[];
    isEdit?: boolean;
    editConfig?: IEditConfig;
    /** 编辑判断字段 */
    uid?: string;
    pagination?: {
        position?: [TypeTopOption, TypeBottomOption];
        defaultCurrent?: number;
        total?: number;
        pageSize?: number;
        current?: number;
        showSizeChanger?: boolean;
    }
}

interface IWithTableApi<T={}> {
    showLoading: () => void;
    hideLoading: () => void;
    setData: (dataList: (IDataItem & T)[]) => void;
    setColumn: (colmns: IWithTableColumn[]) => void;
    setEditKey: (key: string|number) => void;
    getEditKey: () => string|number;
    onPaginationChange?: Function;
}

interface ITargetComponentProps<T={}> {
    tableApi: IWithTableApi<T>;
}

export const withTable = <T extends {}>(option: IWithTableOption<T>) => {
    return (TargetComponent: React.ComponentType<ITargetComponentProps<T>>) => {
        return () => {
            const [ loading, setLoading ] = useState(false);
            const [ dataSource, setDataSource ] = useState(option.data || []);
            const [ column, setColumn ] = useState(option.column ||[]);
            const [ editKey, setEditKey ] = useState<string|number>("");
            const [ editStore ] = useState({ data: {} });
            const api = useMemo<IWithTableApi<T>>(()=>({
                hideLoading: () => setLoading(false),
                showLoading: () => setLoading(true),
                setData: (dataList: (IDataItem & T)[]) => setDataSource(dataList as any[]),
                setColumn: (columns: IWithTableColumn[]) => setColumn(columns),
                setEditKey: (key: string|number): void => setEditKey(key),
                getEditKey: () => editKey
            }), [editKey]);
            const onInputChange = useCallback((key: string, value: any) => {
                (editStore.data as any)[key] = value;console.log(editStore.data);
            }, [editStore]);
            const TableWrapper = useMemo(()=>{
                return EditableTable;
            },[]);
            return <TargetComponent tableApi={api}>
                <TableWrapper
                    pagination={{
                        ...(option.pagination||{}),
                        onChange: api.onPaginationChange
                    }}
                    column={column}
                    dataSource={dataSource} loading={loading}
                    editKey={editKey}
                    uid={option.uid || "key"}
                    onChange={onInputChange}
                />
            </TargetComponent>
        };
    }
};
