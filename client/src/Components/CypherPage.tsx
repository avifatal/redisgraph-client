import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, Button, Tabs, Timeline, Switch, Menu, Drawer, Affix, message } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { ShareAltOutlined,RollbackOutlined, PullRequestOutlined, HistoryOutlined } from '@ant-design/icons';
import ReactJson from 'react-json-view'
import { useQueryHandler } from "../hooks/useQueryHandler";
import { NodeInformation } from "./NodeInformation";
import { useHistory } from "../hooks/useHistory";
import { useSettings } from "../hooks/useSettings";

declare var vis:any;
const { TabPane } = Tabs;

const defaultHeight = 200;
const shrinkedHeight = 90;

    
export const CypherPage = () => {
    const [running, setRunning] = useState(false);
    const [shrinable, setShrinable] = useState(true);
    const [shrined,setShrined] = useState(false);
    const [height, setHeight] = useState(defaultHeight);
    const [query, setQuery] = useState('');
    const [json, setJson] = useState<{}>({});
    const [graphData, setGraphData] = useState<any>();
    const [network, setNetwork] = useState<any>();
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [editingItem,setEditingItem] = useState<any>({});
    const history = useHistory(); 
    const queryHandler = useQueryHandler();
    const graphDiv = useRef<HTMLDivElement>();
    const settings = useSettings();

    const addToHistory = (query) => {
        history.add(query);
    }

    const run = () => {
        
        setRunning(true);
        addToHistory(query);
        queryHandler.run(query).then(x => {
            shrink();
            setJson(x.jsonData);
            setGraphData(x.graphData)
            setRunning(false);
            shrink();
        }).catch(x => {
            message.error("Redisgraph error: " + x.response.data.message,80);
            setRunning(false);
            unShrink();
        });
    }

    const unShrink = () => {
        setShrined(false);
        setHeight(defaultHeight);
    }

    const shrink = () => {
        setShrined(true);
        if(shrinable){
            setHeight(shrinkedHeight);
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
            var nodeId = params.nodes[0];
            if(nodeId){
                var node = graphData.nodes.find(x => x.id == nodeId);
                setEditingItem(node);
                setSettingsVisible(true);
                return;
            }
            var edgeId = params.edges[0];
            if(edgeId){
                var edge = graphData.edges.find(x => x.id == edgeId);
                setEditingItem(edge);
                setSettingsVisible(true);
                return;
            }
        });
        setNetwork(network);
        
    },[graphData]);

    useEffect(() => {
        if(query == ''){
            setQuery(history.getLast()?.query!)
        }
    })
    const type: 'node' | 'edge' = editingItem.relation ? 'edge' : 'node';

    const actions = !shrined ? [
    <Switch unCheckedChildren={'unshrink'} checkedChildren={'shrink'}defaultChecked={shrinable} onChange={x => setShrinable(x)} />,<span></span>,
    <Button style={{ width: '100%' }} icon={<ShareAltOutlined />} onClick={x => run()} loading={running} type="primary">Run <small> (crtl+enter)</small></Button>] : []
    
    return <>
        <Affix offsetTop={10}>
        <Row gutter={[16, 16]}>
            <Col span={24} >
                <Card  actions={actions} style={{ height: height }} ><TextArea onChange={x =>setQuery(x.target.value)} value={query} onFocus={unShrink}  onKeyDown={keyDown} style={{ width: '100%', height: (height - 50) + 'px', fontSize:'20px' }}></TextArea></Card>
            </Col>
        </Row>
        </Affix>
        <Row gutter={[16, 16]}>
            <Col span={24} >
                <Card>
                    <Tabs style={{minHeight:'800px'}} defaultActiveKey="1">
                        <TabPane tab={<><ShareAltOutlined /> GRAPH RESULTS</>} key="1">
                            <div style={{width: '100%', height: '100vh'}} ref={graphDiv as any}>
                           
                            </div>
                         </TabPane>
                        <TabPane tab={<> <PullRequestOutlined /> JSON RESULTS</>} key="2">
                            <ReactJson src={json} />
                        </TabPane>
                        <TabPane tab={<><HistoryOutlined /> QUERY HISTORY</>} key="3">
                            <Timeline mode={'left'}>
                                {history.all().map(item => {
                                    var date = new Date(item.date as number);
                                    var formatted = date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
                                    return <Timeline.Item key={item.date} label={formatted}><Button onClick={x => setQuery(item.query!)} type="primary" size="small" icon={<RollbackOutlined />} />  {item.query}</Timeline.Item>
                                })}

                            </Timeline>
                        </TabPane>

                    </Tabs>
                </Card>
            </Col>
        </Row>
        {editingItem.label && settingsVisible && <Drawer 
                                    title={  type.charAt(0).toUpperCase() + type.slice(1) + ' information - ' + editingItem?.label}
                                    placement="right"
                                    closable={true}
                                    visible={settingsVisible}
                                    onClose={x => setSettingsVisible(false)}
                                    width={600} >
                                        <NodeInformation onSettingsChange={() => network.setData(queryHandler.rebuildData().graphData)} settingsItem={settings.getOrCreate(type, editingItem?.label)} type={type} label={editingItem?.label} />
                                </Drawer>}

    </>



}