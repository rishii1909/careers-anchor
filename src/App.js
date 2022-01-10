// import logo from './logo.svg';
import React, { useState } from 'react';

import './App.css';
import { Button, Form, Slider, Divider, Progress } from 'antd';
// import { FrownOutlined, SmileOutlined } from '@ant-design/icons';
import questions from './questions';

function App() {
  let responses = {};
  const [response_counter, setResponse_counter] = useState(0);

  function onFinish(values){
    console.log(values)
  }
  return (
    <div className="App">
      <div className='responsive-container'>
        <h1 style={{textAlign : "left", borderBottom : '1px solid lightGray'}} > Motivation and Career Anchors Assessment</h1>
        <p>
        The items in this inventory are designed to help you identify the Career Anchor or self-concept that is most important to you in your work life.  As you answer the questions, think in terms of what it is you really want in your work life.  Remember, there is no right or wrong answers - only your answers.
        </p>
        <p>
        For each statement, circle the number that best rates how important it is to you to have this factor in your work life.  How willing would you be to give it up?  How critical is it for you to retain it?
        </p>
        <Divider></Divider>
        <div className='form-container' >
          <Form
            labelCol={{ span: 8 }}
            labelAlign='left'
            labelWrap
            scrollToFirstError
            colon={false}
            wrapperCol={{ span: 14 }}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed} 
            autoComplete="off"
            onFinish={onFinish}
          >
            {questions.map((q, i) =>
              <Form.Item
              name={`question_${i}`}
              label={`Q${i+1}. ${q.text}`}
              style={{paddingBottom : '1em', borderBottom : '1px solid lightGray'}}
              rules={[{required : true, message : "Please make a choice."}]}
              >
                <Slider
                  defaultValue={50}  
                  min={0}
                  step={10}
                  tipFormatter={formatter[q.type]}
                  max={100}
                  onChange={(val) => {setResponse_counter(response_counter + 1); responses[i] = val}}
                />
              </Form.Item>
            )}
            <Button type='primary' htmlType='submit'>Submit</Button>
            <div style={{padding : '0.4em', position : 'fixed', left : '1em', bottom : "1em", backgroundColor : 'white', borderRadius : '4px', boxShadow : '-1px 2px 10px 5px lightGray' , width: 170}} >
            My progress
              <Progress percent={Math.round(response_counter*100 / questions.length)}></Progress>
              {response_counter >= questions.length && 
                <Button type="primary" size='small' htmlType='submit' style={{marginTop : "0.4em"}}>Submit responses</Button>
              }
              </div>
          </Form>
        </div>
      </div>
      
    </div>
  );
}


const formatter = {
  0 : (val) => {
    if(val === 0) return "Not important at all."
    if(val === 100) return "Very important!"
    return `${val}% important`
  },
  1 : (val) => {
    if(val === 0) return "I do not agree at all"
    if(val === 100) return "I completely agree!"
    return `I agree ${val}%.`
  }
} 

export default App;
