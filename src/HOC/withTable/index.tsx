import React, { useMemo, useState } from "react";
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
            const [ api ] = useState<IWithTableApi<T>>({
                hideLoading: () => setLoading(false),
                showLoading: () => setLoading(true),
                setData: (dataList: (IDataItem & T)[]) => setDataSource(dataList as any[]),
                setColumn: (columns: IWithTableColumn[]) => setColumn(columns)
            });
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
                />
            </TargetComponent>
        };
    }
};
