import React from "react";
import { utils } from "elmer-common";

export class WatchProps extends React.Component<any> {

    shouldComponentUpdate(nextProps: any, nextState: Readonly<{}>, nextContext: any): boolean {
        for(const key of Object.keys(nextProps)) {
            const nextValue = nextProps[key], prvValue = this.props[key];
            if(!utils.isEqual(nextValue, prvValue)) {
                return true;
            }
        }
        return false;
    }
    render(){
        return this.props.children;
    }
}

export const WithWatchProps = () => (Wrapper: React.ComponentType) => {
    return (props: any) => {
        return (
            <WatchProps {...props}>
                <Wrapper {...props}/>
            </WatchProps>
        );
    };
}