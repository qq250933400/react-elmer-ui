import styles from "../style.module.scss";
import cn from "classnames";

type TypeRadioButtonProps = {
    title: string|number|JSX.Element;
    type?: "radio"|"checkbox";
    alt?: string;
    name: string|number;
    id: string|number;
    icon: JSX.Element;
    className?: string;
}

const RadioButton = (props: TypeRadioButtonProps) => {
    return (
        <label className={cn(styles.radioButton,"RadioButton",props.className)} htmlFor={props.id as any} title={props.alt || props.title as any}>
            <input type={props.type || "radio"} name={props.name.toString()} id={props.id.toString()}/>
            <i>{props.icon}</i>
            <span>{props.title}</span> 
        </label>
    );
};

export default RadioButton;
