import { IPanelSection } from "../../config/types/IApp";
import styles from "../style.module.scss";
import cn from "classnames";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { useCallback, useState, useRef } from "react";
import { FormattedMessage } from "@HOC/withI18n";

type TypePanelSectionProps = {
    data: IPanelSection[];
}
const PanelSection = (props: TypePanelSectionProps) => {
    const [ SectionStatus, setSectionStatus ] = useState<any>({});
    const [ currentPanelHeight, setCurrentPanelHeight ] = useState<string|number>("auto");
    const panelRef = useRef(null);
    const calcCurrentPanelHeight = useCallback(() => {
        if(panelRef.current) {
            const rootSection = (panelRef.current as unknown) as HTMLElement;
            const firstItem = rootSection.firstChild?.firstChild;
            const headHeight = firstItem ? (firstItem as HTMLLabelElement).clientHeight : 23;
            const offsetHeight = props.data.length * headHeight;
            const rootHeight = rootSection.clientHeight;
            return rootHeight - offsetHeight - 4;
        } else {
            return "auto";
        }
    }, [panelRef, props.data]);
    const onExpandClick = useCallback((item: IPanelSection) => {
        const expend = !!SectionStatus[item.value];
        const newStatus:any = {};
        newStatus[item.value] = !expend;
        setCurrentPanelHeight(calcCurrentPanelHeight())
        setSectionStatus(newStatus);
    }, [SectionStatus, calcCurrentPanelHeight]);
    return (
        <section ref={panelRef} className={cn(styles.panelSection, "PanelSection")}>
            {
                props.data?.length > 0 && props.data.map((item, index) => {
                    const DefineComponent = item.Component;
                    const expend = SectionStatus[item.value];
                    return (
                        <div key={index}>
                            <label className="TitleColor" onClick={() => onExpandClick(item)}>
                                { expend &&  <DownOutlined /> }
                                { !expend &&  <RightOutlined /> }
                                <span className="Text"><FormattedMessage id={item.title}/></span>
                            </label>
                            <section style={{ display: expend ? "block" : "none", height: currentPanelHeight }}>
                                <DefineComponent data={item.data}/>
                            </section>
                        </div>
                    );
                })
            }
        </section>
    );
};

export default PanelSection;
