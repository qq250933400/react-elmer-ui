import React from "react";
import Loading from "../../../components/CarLoading";
import { msjApi } from "@Admin/MSJApp";
const Main = () => {
    return <div>
        <button onClick={() => {
            msjApi.showLoading();
            setTimeout(() => msjApi.hideLoading(), 10000);
        }}>显示Loading</button>
        <Loading />
    </div>
};

export default Main;
