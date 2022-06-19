import styles from "../style.module.scss";
import cn from "classnames";
import React from "react";

type TypeInputProps = {
    name?: string;
    id?: string;
    className?: string;
    type?: "text"|"password"|"number"|"date"|"email"|"mobile";
    placeholder?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onCompositionEnd?: (event: React.CompositionEvent<HTMLInputElement>) => void;
    onCompositionStart?: (event: React.CompositionEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const Input = (props: TypeInputProps) => {
    return (<input
        className={cn(styles.input, "Input", props.className)}
        type={props.type || "text"}
        placeholder={props.placeholder}
        onChange={props.onChange}
        onCompositionEnd={props.onCompositionEnd}
        onCompositionStart={props.onCompositionStart}
        onKeyDown={props.onKeyDown}
        onKeyUp={props.onKeyUp}
        onKeyPress={props.onKeyPress}
    />);
};
