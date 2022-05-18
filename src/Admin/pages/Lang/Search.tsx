import React, { useCallback, useMemo } from "react";
import { Button, Col, Form, Input, Row, Select, InputNumber } from "antd";
import { Rule } from "antd/lib/form";
import { FormattedMessage } from "react-intl";
import styles from "./style.module.scss";
const { Option } = Select;

type TypeListItem = {
    label: string|Object;
    value: any;
    data?: any;
};

type TypeAdvancedSearchFormItemProps = {
    name: string;
    type: "Text"|"Dropdown"|"Number",
    label: string|Object;
    validateRules?: Rule[];
    data?: TypeListItem[];
};

type TypeAdvancedSearchProps = {
    onSearch?: Function;
};

const AdvancedSearchFormItem = (props: TypeAdvancedSearchFormItemProps) => {
    const EditNode = useMemo(()=>{
        if(props.type === "Dropdown") {
            return (<Select>
                {
                    props.data && props.data.map((item) => {
                        return <Option value={item.value}>{item.label}</Option>
                    })
                }
            </Select>);
        } else if(props.type === "Number") {
            return <InputNumber autoComplete="off"/>
        } else {
            return <Input autoComplete="off"/>
        }
    }, [props.type, props.data]);
    return (
        <Col span={8} key={props.name}>
            <Form.Item
              name={props.name}
              label={props.label}
              rules={props.validateRules}
            >
                {EditNode}
            </Form.Item>
        </Col>
    );
};

const AdvancedSearchForm = (props: TypeAdvancedSearchProps) => {
    const [form] = Form.useForm();

  
    const onFinish = useCallback((values: any) => {
      typeof props.onSearch === "function" && props.onSearch(values);
    },[props]);
  
    return (
      <Form
        form={form}
        name="advanced_search"
        className={styles["ant-advanced-search-form"]}
        onFinish={onFinish}
      >
        <Row gutter={24}>
            <AdvancedSearchFormItem name="textId" label={<FormattedMessage id="lng_id"/>} type="Text" />
            <AdvancedSearchFormItem name="text" label={<FormattedMessage id="lng_text"/>} type="Text" />
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
                <FormattedMessage id="btnSearch"/>
            </Button>
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => {
                form.resetFields();
              }}
            >
                <FormattedMessage id="btnClear"/>
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  export default AdvancedSearchForm;
