import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Table, Input, InputNumber, Form } from 'antd';
import styles from "./style.module.scss";
import { IDataItem, TypeEditableInputType } from './IWithTable';

interface IEditableCellProps<T={}> extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: TypeEditableInputType;
    record: T & IDataItem;
    index: number;
    children: React.ReactNode;
    onEditChange(key: string, value?: any): void;
}
interface IEditableProps<T={}> {
    dataSource: (T & IDataItem)[];
    loading?: boolean;
    column: any[];
    pagination?: any;
    editKey?: string|number;
    uid?: string;
    onChange(key: string, value?: any): void;
};

const EditableCell: React.FC<IEditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    onEditChange,
    ...restProps
}) => {
    const defaultValue = editing ? (((record || {}) as any)[(dataIndex || "")]) : "";
    const onInputChange = useCallback((value: string) => {
        typeof onEditChange === "function" && onEditChange(dataIndex, value);
    },[dataIndex, onEditChange]);
    return (
        <td {...restProps}>
            {editing ? (
                 <>
                    { inputType === 'number' && <InputNumber defaultValue={defaultValue} onChange={(evt) => onInputChange(evt.target.value)}/> }
                    { ['number'].indexOf(inputType) < 0 && <Input defaultValue={defaultValue} onChange={(evt) => onInputChange(evt.target.value)}/> }
                 </>
            ) : (
                children
            )}
        </td>
    );
};

const EditableTable = <T extends { key: string|number}>(props: IEditableProps<T>) => {
    const [data, setData] = useState<any[]>(props.dataSource || []);
    const [editingKey, setEditingKey] = useState<string|number>(props.editKey || "");

    const isEditing = useCallback((record: any) => {
        const key = props.uid || "key";
        return record[key] === editingKey;
    }, [editingKey, props.uid]);

    const cancel = () => {
        setEditingKey('');
    };
    const mergedColumns = useMemo(()=>{
        return (props.column || []).map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: (record: T) => ({
                    record,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: isEditing(record),
                    onEditChange: props.onChange
                })
            };
        });
    }, [ props.column, isEditing, props.onChange ]);
    
    useEffect(() => {
        setData(props.dataSource || []);
    }, [props.dataSource]);
    useEffect(()=>{
        setEditingKey(props.editKey || "");
    },[props.editKey]);

    return (
        <Table
            components={{
                body: {
                    cell: EditableCell,
                },
            }}
            bordered
            dataSource={data}
            columns={mergedColumns}
            rowClassName={styles["editable-row"]}
            loading={props.loading}
            pagination={{
                onChange: cancel,
                ...(props.pagination || {})
            }}
            sticky
        />
    );
};



export default EditableTable;
