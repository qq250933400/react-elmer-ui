import { Button, Col, Form, Row } from "antd";
import React, { useCallback } from "react";
import { FormattedMessage } from "react-intl";
import styles from "./style.module.scss";

const Langs = (props: any) => {
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
                    <FormattedMessage id="btnDel"/>
                </Button>
            </Col>
            </Row>
        </Form>
    );
};

export default Langs;
