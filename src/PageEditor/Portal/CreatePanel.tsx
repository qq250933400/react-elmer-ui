import styles from "./style.module.scss";
import { Input } from "../components/Input";
import { useState } from "react";
import { FormattedMessage } from "@HOC/withI18n";
import { FileMarkdownOutlined, Html5Outlined } from "@ant-design/icons";

const CreatePanelNode = () => {
    const [ fileTypes ] = useState([
        { title: <FormattedMessage id="webPage"/>, value: "webPage", icon: <Html5Outlined /> },
        { title: <FormattedMessage id="markdown"/>, value: "markdown", icon: <FileMarkdownOutlined /> },
    ]);
    return (<section className={styles.CreatePanel}>
        <div>
            <table>
                <tbody>
                    <tr>
                        <td width={80}><label>文件名</label></td>
                        <td><Input type="text" placeholder="输入文件名"/></td>
                    </tr>
                    <tr>
                        <td className={styles.createPanelAlignTop}><label>项目类型</label></td>
                        <td className={styles.createPanelAlignTop}>
                            <div className={styles.createPanelFileTypes}>
                            {
                                fileTypes.map((item, index) => {
                                    return (
                                        <label className="RadioButton" key={index} htmlFor={item.value} title={item.title as any}>
                                            <input type="radio" name="fileType" id={item.value}/>
                                            <i>{item.icon}</i>
                                            <span>{item.title}</span> 
                                        </label>);
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