import React, { useEffect, useMemo, useState } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography } from 'antd';
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
}
interface IEditableProps<T={}> {
    dataSource: (T & IDataItem)[];
    loading?: boolean;
    column: any[];
    pagination?: any;
};

const EditableCell: React.FC<IEditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const EditableTable = <T extends { key: string|number}>(props: IEditableProps<T>) => {
    const [form] = Form.useForm();
    const [data, setData] = useState(props.dataSource || []);
    const [editingKey, setEditingKey] = useState<string|number>('');

    const isEditing = (record: T) => record.key === editingKey;

    const edit = (record: Partial<T> & { key: React.Key }) => {
        form.setFieldsValue({ name: '', age: '', address: '', ...record });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key: React.Key) => {
        try {
            const row = (await form.validateFields()) as any;

            const newData = [...data];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    const [ columns ] = useState(props.column || []);
    // const columns = [
    //     {
    //         title: 'name',
    //         dataIndex: 'name',
    //         width: '25%',
    //         editable: true,
    //     },
    //     {
    //         title: 'age',
    //         dataIndex: 'age',
    //         width: '15%',
    //         editable: true,
    //     },
    //     {
    //         title: 'address',
    //         dataIndex: 'address',
    //         width: '40%',
    //         editable: true,
    //     },
    //     {
    //         title: 'operation',
    //         dataIndex: 'operation',
    //         render: (_: any, record: T) => {
    //             const editable = isEditing(record);
    //             return editable ? (
    //                 <span>
    //                     <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
    //                         Save
    //                     </Typography.Link>
    //                     <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
    //                         <a>Cancel</a>
    //                     </Popconfirm>
    //                 </span>
    //             ) : (
    //                 <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
    //                     Edit
    //                 </Typography.Link>
    //             );
    //         },
    //     },
    // ];

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
                }),
            };
        });
    }, [ props.column, isEditing ]);
    useEffect(() => {
        setData(props.dataSource || []);
    }, [props.dataSource]);
    return (
        <Form form={form} component={false}>
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
        </Form>
    );
};



export default EditableTable;
