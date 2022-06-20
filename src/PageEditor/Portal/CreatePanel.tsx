import styles from "./style.module.scss";
import { Input } from "../components/Input";
import { useState, useEffect } from "react";
import { FormattedMessage } from "@HOC/withI18n";
import { FileMarkdownOutlined, Html5Outlined } from "@ant-design/icons";
import { EmitValidation } from "../data";
import RadioButton from "../components/RadioButton";
import { editApp } from "../config";
import { useValidate } from "@Component/Validation";

const { Validated } = EmitValidation;
const CONST_VALIDATE_TAG_NAME = "CreateAppPanel";

const CreatePanelNode = () => {
    const validateApi = useValidate();
    const [ fileTypes ] = useState([
        { title: <FormattedMessage id="webPage"/>, value: "webPage", icon: <Html5Outlined /> },
        { title: <FormattedMessage id="markdown"/>, value: "markdown", icon: <FileMarkdownOutlined /> },
    ]);
    const [ fileName, setFileName ] = useState("");
    useEffect(():any => {
        return editApp.on("onBeforeCreateApp", () => {
            return validateApi.validateByTag(CONST_VALIDATE_TAG_NAME);
        });
    }, []);
    return (<section className={styles.CreatePanel}>
        <div>
            <table>
                <tbody>
                    <tr>
                        <td width={80} className={styles.createPanelAlignTop}>
                            <label><FormattedMessage id="fileName"/></label>
                        </td>
                        <td className={styles.createPanelAlignTop}>
                            <Validated tag={CONST_VALIDATE_TAG_NAME} errMsg="必填项不能为空" id="fileName" type="isRequired" value={fileName}>
                                <Input type="text" placeholder="输入文件名" defaultValue={fileName} onChange={(event) => setFileName(event.currentTarget.value)}/>
                            </Validated>
                        </td>
                    </tr>
                    <tr>
                        <td className={styles.createPanelAlignTop}><label><FormattedMessage id="fileType"/></label></td>
                        <td className={styles.createPanelAlignTop}>
                            <div className={styles.createPanelFileTypes}>
                            {
                                fileTypes.map((item, index) => {
                                    return (
                                        <RadioButton key={index} name="fileType" id={item.value} title={item.title} icon={item.icon} />
                                    );
                                })
                            }
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>);
};

export const createPanel = () => {
    return <CreatePanelNode />
};