import React, { useEffect } from "react";
import Loading from "../../../components/CarLoading";
import { msjApi } from "@Admin/MSJApp";
const Main = () => {
    useEffect(()=>{
        msjApi.save("arr", [{
            name: "test",
            age: 12
        }, {
            name: "elmer",
            age: 32
        }]);
        msjApi.get("arr").then((data) => {
            console.log("---SaveData--", data);
        });
        msjApi.getFormDataByCode("aa", "bb").then((data) => {
            console.log("formData: ", data);
        }).catch((err) => {
            console.error(err);
        })
    },[]);
    return <div>
        <button onClick={() => {
            msjApi.showLoading();
            setTimeout(() => msjApi.hideLoading(), 10000);
        }}>显示Loading</button>
        <Loading />
    </div>
};

export default Main;
