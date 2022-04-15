import React, { useEffect, useState } from "react";
import Loading from "../../../components/CarLoading";
import { msjApi } from "@Admin/MSJApp";
import { Validated } from "@Component/Validation";

const Main = () => {
    const [ test, setTest ] = useState("");
    useEffect(()=>{
        // log
    },[]);
    return <div>
        <button onClick={() => {
            msjApi.showLoading();
            setTimeout(() => msjApi.hideLoading(), 10000);
        }}>显示Loading</button>
        <Loading />
        <Validated value={test} id="test" type="isRequired">
            <input type="text" onChange={(v) => setTest(v.currentTarget.value)}/>
        </Validated>
    </div>
};

export default Main;
