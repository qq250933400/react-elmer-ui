import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import reportWebVitals from './reportWebVitals';
import { ValidationProvider, withValidate, useValidate, Validated } from "./components/Validation";

const App = withValidate()(() => {
  const validateApi = useValidate();
  const [ labelStyle ] = useState({display: "block"});
  const [ tagName ] = useState("---do test");
  const [ test1, setTest1] = useState<string>();
  const [ test2, setTest2] = useState<string>();
  const onSubmit = useCallback(() => {
    validateApi.validateByTag(tagName);
  }, []);
  useEffect(() => {
    return validateApi.on("onValidateByTag", (opt) => {
      console.log(opt);
    }) as any;
  }, []);
  return (<div>
    <h2>Validation test</h2>
    <Validated emitValidate id="test1" value={test1} tag={tagName} type="isRequired" errMsg='必填项'>
      <label style={labelStyle}><span>Test1</span><input onChange={(event) => setTest1(event.currentTarget.value)} type="text"/></label>
    </Validated>
    <Validated emitValidate id="test2" value={test2} tag={tagName} type="isRequired" errMsg='必填项'>
    <label style={labelStyle}><span>Test2</span><input type="text" onChange={(event) => setTest2(event.currentTarget.value)} /></label>
    </Validated>
    <button onClick={onSubmit}>Submit</button>
  </div>);
});


ReactDOM.render(<ValidationProvider><App /></ValidationProvider>,
  document.getElementById('root')
);

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();