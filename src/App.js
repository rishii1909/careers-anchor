// import logo from './logo.svg';
import React, { useState } from 'react';

import './App.css';
import { Button, Form, Slider, Divider, Progress, Row, Col, Table, message } from 'antd';
import { ExperimentOutlined, DownloadOutlined } from '@ant-design/icons';

import questions from './questions';
import RadarChart from '@ant-design/plots/es/components/radar';
import printHtmlToPDF from "print-html-to-pdf";

var responses = [];

// For testing
// for (let i = 0; i < questions.length; i++) {
//   responses[i] = Math.floor(Math.random() * 11)*10;
  
// }

const anchors = {
  0 : "Security, Stability, Organizational Identity",
  1 : "Autonomy / Independence",
  2 : "Technical / Functional Competence",
  3 : "Managerial Competence",
  4 : "Entrepreneurial Creativity",
  5 : "Sense of Service / Dedication to a Cause",
  6 : "Pure Challenge",
  7 : "Life-Style Integration"
}

function App() {
  
  const [response_counter, setResponse_counter] = useState(0);
  const [result, setResult] = useState([]);
  const [filled, setFilled] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [downloaded, setDownloaded] = useState(false);


  function onFinish(values){

    let condense = [];
    for (let i = 0; i < questions.length; i++) {
      const el = responses[i];
      const addr = (i) % 8;
      if(addr === 0) console.log(i, el)
      if(condense[addr] === undefined){
        condense[addr] = {
          label : anchors[addr],
          value : el
        };
      }
      else condense[addr].value += el;
    }
    condense.sort((a,b) => {
      if(a.value < b.value) return 1;
      if(a.value > b.value) return -1;
      return 0

    })
    console.log(condense);
    setResult(condense);
    setFilled(true);
    
    
  }

  async function downloadPDF(){
    setPrinting(true);
    const node = document.getElementById('app-root');
    const pdfOption = {
      jsPDF: {
        unit: 'px',
        format: 'letter',
      },
       spin: false,
       fileName: 'Career_Anchors_Assessment_Result',
       // You can hide element which you don't want to be part of pdf
       hideDomNodeUsingGivenSelectors: {
         id: [],
         class: ['download-button'],
         nodes: []
       },
    }
    await printHtmlToPDF.print(node, pdfOption);
    setPrinting(false);
    setDownloaded(true);
   };

  return (
    <div className="App" id='app-root'> 
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
            autoComplete="off"
            onFinish={onFinish}
            onFinishFailed={() => message.error("Please make a choice for each of the given statements.")}
            disabled
          >
            {questions.map((q, i) =>
              <Form.Item
              // name={`question_${}`}
              name={i}
              key={i}
              label={`Q${i+1}. ${q.text}`}
              style={{paddingBottom : '1em', borderBottom : '1px solid lightGray'}}
              rules={[{required : true, message : "Please make a choice."}]}
              // initialValue={responses[i]}
              >
                <Slider
                defaultValue={50}
                  min={0}
                  step={10}
                  tipFormatter={formatter[q.type]}
                  tooltipVisible={true}
                  max={100}
                  onChange={(val) => {
                    if(responses[i] === undefined) setResponse_counter(response_counter + 1);
                    responses[i] = val;
                    if(filled) setFilled(false);
                  }}
                  disabled={filled}
                />
              </Form.Item>
            )}
            {
              !filled && 
              <div style={{display : 'flex', alignItems : "flex-end", justifyContent : 'flex-end'}}>
                <Button style={{borderRadius : '3px', boxShadow : '-0.5px 0.5px 4px 1px gray'}} icon={<ExperimentOutlined />} type='primary' htmlType='submit'>Analyze responses ! </Button>
              </div>
            }
            <div className='progress-container' style={{padding : '0.6em', position : 'fixed', left : '1em', bottom : "1em", backgroundColor : 'white', borderRadius : '4px', boxShadow : '-1px 2px 10px 5px lightGray' , width: 170}} >
            Your progress
              <Progress 
                percent={Math.round(response_counter*100 / questions.length)} 
                // percent={100} 
                strokeColor={{
                  // from: '#FF674D',
                  from: '#034748',
                  to : '#1481BA'
                }} 
              />
              {(response_counter === questions.length && !filled) && 
                <Button type="primary" size='small' htmlType='submit' style={{marginTop : "0.4em", boxShadow : '-0.5px 0.5px 4px 1px gray'}} icon={<ExperimentOutlined />}>Analyze !</Button>
              }
              </div>
          </Form>
          {result.length > 0 && 
            <>
            <Divider/>
            <Row justify='space-between' align='middle' className='results-container'>
              <Col md={24} lg={24} xl={10} style={{marginBottom : '1.4em'}} >
              <h2 style={{textAlign : "left", borderBottom : '1px solid lightGray'}}  > Here are your results! 🎉</h2>
              <Table 
              dataSource={result}
              pagination={false}
              columns={[
                {
                  title : 'Points',
                  dataIndex : 'value',
                  key : 'value'
                },
                {
                  title : "Career Anchor",
                  dataIndex : 'label',
                  key : 'label'
                }
              ]}></Table>
              </Col>
              <Col md={24} lg={24} xl={14} style><RadarChart style={{marginBottom : '1.4em'}} data={result} {...config}/></Col>
            </Row>
            <div style={{padding : '1.2em', }} >
              <p>The highest score is your Career Anchor.  If any two scores are close (within 10 points), read the description of each of the two Career Anchors and see which one you feel best describes your true preference.  The Career Anchor indicated by your second highest score may also be an important indicator and should also be recorded.  The Career Anchor descriptions follow the scoring form.  If one of the descriptions seems to be accurate with your own self-perceptions but is not your highest number, use that one as your Career Anchor, regardless of the scores. </p>
                <div style={{justifyContent : 'right', display : 'flex', paddingTop : '1em'}}>
                  <Button loading={printing} onClick={()=>downloadPDF()} type="primary" className={downloaded ? 'download-button' : 'download-button wiggle'} shape="round" icon={<DownloadOutlined /> }>
                    Download Assessment Result
                  </Button>
                </div>
            </div>
            
            </>
          }
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

const config = {
  xField: 'label',
  yField: 'value',
  meta: {
    value: {
      alias: 'Points',
      min: 0,
      nice: true,
      // formatter: (v) => Number(v).toFixed(2),
    },
  },
  appendPadding: [0, 10, 0, 10],
  color : '#1481BA',
  // meta: {
  //   value: {
  //     alias: 'Points',
  //     min: 0,
  //     max: 80,
  //   },
  // },
  xAxis: {
    tickLine: null,
  },
  yAxis: {
    label: false,
    grid: {
      alternateColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  area: {},
  point: {
    size: 2,
  },
};

export default App;
