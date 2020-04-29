import React, { useState, useEffect, createRef, useRef } from "react";
import { Row, Col, Card, Button, message, Tabs, Timeline, Switch, Menu, Drawer } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { ShareAltOutlined,ColumnHeightOutlined,MailOutlined,AppstoreOutlined,SettingOutlined } from '@ant-design/icons';
import axios from 'axios'
import ReactJson from 'react-json-view'
import { GraphData, Settings } from "../models";
import { useQueryHandler } from "../hooks/useQueryHandler";
import { NodeInformation } from "./NodeInformation";
import { useHistory } from "../hooks/useHistory";
import { useSettings } from "../hooks/useSettings";

declare var vis:any;
const { TabPane } = Tabs;

const defaultHeight = 250;

    
export const CypherPage = () => {
    const [running, setRunning] = useState(false);
    const [shrinable, setShrinable] = useState(false);
    const [height, setHeight] = useState(defaultHeight);
    const [query, setQuery] = useState('');
    const [json, setJson] = useState<{}>({});
    const [graphData, setGraphData] = useState<any>();
    const [network, setNetwork] = useState<any>();
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [chosenNode,setChosenNode] = useState<any>({});
    const history = useHistory(); 
    const queryHandler = useQueryHandler();
    const graphDiv = useRef<HTMLDivElement>();

    
    
    

    const addToHistory = (query) => {
        history.add(query);
    }

    const run = () => {
        setRunning(true);
        addToHistory(query);
        queryHandler.run(query).then(x => {
            setJson(x.jsonData);
            setGraphData(x.graphData)
            setRunning(false);
        });
    }

    const unShrink = () => {
        setHeight(defaultHeight);
    }

    const shrink = () => {
        if(shrinable){
            setHeight(100);
        }
    }

    const keyDown = (e: any) => {
        if (e.ctrlKey && e.keyCode == 13) {
            run();
        }
    }
    useEffect(() => {
        var options = {
            physics: false,
            nodes: {
              shape: "dot",
              size: 30,
              font: {
                size: 32
              },
              borderWidth: 2,
              shadow: true
            },
            edges: {
              width: 2,
              shadow: true,
              arrows: {
                to: { enabled: true, scaleFactor: 1, type: "arrow" }
              }
            }
          };
        let network = new vis.Network(graphDiv.current, graphData , options);
        network.on("click", function (params) {
            var id = params.nodes[0];
            if(id){
                var node = graphData.nodes.find(x => x.id == id);
                setChosenNode(node);
                setSettingsVisible(true);
            }
        });
    },[graphData]);

    useEffect(() => {
        if(query == ''){
            setQuery(history.all[0].query!)
        }
    })
    
    return <>
    <Row justify="end">
        <Col span={2} style={{textAlign:'center'}}>
            <Switch unCheckedChildren={'shrink'} checkedChildren={'unshrink'}defaultChecked={shrinable} onChange={x => setShrinable(x)} />
        </Col>
        <Col span={3}>
            <Button style={{ width: '100%' }} icon={<ShareAltOutlined />} onClick={run} loading={running} type="primary">Run <small> (crtl+enter)</small></Button>
        </Col>
    </Row>
        <Row gutter={[16, 16]}>
            <Col span={24} >
                <Card style={{ height: height }} ><TextArea onChange={x =>setQuery(x.target.value)} value={query} onFocus={unShrink} onBlur={shrink} onKeyDown={keyDown} style={{ width: '100%', height: (height - 50) + 'px' }}></TextArea></Card>
            </Col>
        </Row>
        <Row gutter={[16, 16]}>
            <Col span={24} >
                <Card>
                    <Tabs style={{minHeight:'800px'}} defaultActiveKey="1">
                        <TabPane tab="GRAPH RESULTS" key="1">
                            <div style={{width: '100%', height: '100vh'}} ref={graphDiv as any}>
                           
                            </div>
                            {chosenNode.label && settingsVisible && <Drawer
                                    title="Node information"
                                    placement="right"
                                    closable={true}
                                    visible={settingsVisible}
                                    onClose={x => setSettingsVisible(false)}
                                    getContainer={false}
                                    style={{ position: 'absolute' }}
                                    width={600}
                                    >
                                        <NodeInformation type='node' label={chosenNode?.label} />
                                    </Drawer>}
                         </TabPane>
                        <TabPane tab="JSON RESULTS" key="2">
                            <ReactJson src={json} />
                        </TabPane>
                        <TabPane tab="QUERY HISTORY" key="3">
                        <Timeline mode={'left'}>
                            {history.all.map(item => {
                                var date = new Date(item.date as number);
                                var formatted = date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
                                return <Timeline.Item key={item.date} label={formatted}>{item.query}</Timeline.Item>
                            })}

                        </Timeline>
                        </TabPane>

                    </Tabs>
                </Card>
            </Col>
        </Row>

    </>



}