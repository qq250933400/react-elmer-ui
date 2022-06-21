import styles from "./style.module.scss";
import { Input } from "../components/Input";
import { useState, useEffect } from "react";
import { FormattedMessage, useMessage } from "@HOC/withI18n";
import { FileMarkdownOutlined, Html5Outlined } from "@ant-design/icons";
import { EmitValidation } from "../data";
import RadioButton from "../components/RadioButton";
import { editApp } from "../config";
import { useValidate } from "@Component/Validation";
import { useService } from "@HOC/withService";
import { useStore } from "./DataStore";

const { Validated } = EmitValidation;
const CONST_VALIDATE_TAG_NAME = "CreateAppPanel";

const CreatePanelNode = () => {
    const validateApi = useValidate();
    const getMsg = useMessage();
    const service = useService();
    const storeData = useStore(["openHistory"]);
    const [ fileTypes ] = useState([
        { title: getMsg("webPage"), value: "WebPage", icon: <Html5Outlined /> },
        { title: getMsg("markdown"), value: "Markdown", icon: <FileMarkdownOutlined /> },
    ]);
    const [ fileName, setFileName ] = useState("");
    const [ fileType, setFileType ] = useState();
    useEffect(():any => {
        const removeBeforeCreateApp = editApp.on("onBeforeCreateApp", () => {
            editApp.callApi("portal", "updateCreatePayload", {
                name: fileName,
                type: fileType
            });
            return validateApi.validateByTag(CONST_VALIDATE_TAG_NAME);
        });
        const removeAfterCreateApp = editApp.on("onAfterCreateApp", (data:any):any => {
            console.log(data);
            // editApp.goto("app", data);
        });
        return () => {
            removeBeforeCreateApp();
            removeAfterCreateApp();
        };
    }, [validateApi,service,storeData, fileName, fileType]);
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
                            <Validated tag={CONST_VALIDATE_TAG_NAME} errMsg="必填项不能为空" id="fileType" type="isRequired" value={fileType}>
                                <div className={styles.createPanelFileTypes}>
                                {
                                    fileTypes.map((item, index) => {
                                        return (
                                            <RadioButton onClick={(data:any) => setFileType(data)} key={index} name="fileType" id={item.value} title={item.title || ""} icon={item.icon} />
                                        );
                                    })
                                }
                                </div>
                            </Validated>
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