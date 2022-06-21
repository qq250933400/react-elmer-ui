import styles from "../style.module.scss";
import cn from "classnames";
import React, { useCallback } from "react";

type TypeRadioButtonProps = {
    title: string|number|JSX.Element;
    type?: "radio"|"checkbox";
    alt?: string;
    name: string|number;
    id: string|number;
    icon: JSX.Element;
    className?: string;
    onClick?: Function;
    onChange?: Function;
}

const RadioButton = (props: TypeRadioButtonProps) => {
    const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>)=>{
        typeof props.onChange === "function" && props.onChange({
            checked: event.currentTarget.checked,
            id: props.id,
            name: props.name
        });
    }, [props]);
    const onClick = useCallback((event: React.MouseEvent)=>{
        typeof props.onClick === "function" && props.onClick({
            id: props.id,
            name: props.name
        });
    }, [props]);
    return (
        <label onClick={onClick} className={cn(styles.radioButton,"RadioButton",props.className)} htmlFor={props.id as any} title={props.alt || props.title as any}>
            <input onChange={onChange} type={props.type || "radio"} name={props.name.toString()} id={props.id.toString()}/>
            <i>{props.icon}</i>
            <span>{props.title}</span> 
        </label>
    );
};

export default RadioButton;
