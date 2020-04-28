import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, message, Tabs, Timeline, Switch, Menu } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { ShareAltOutlined,ColumnHeightOutlined,MailOutlined,AppstoreOutlined,SettingOutlined } from '@ant-design/icons';
import { useHistory } from "./useHistory";
import axios from 'axios'
const { TabPane } = Tabs;

const defaultHeight = 250;

const useQueryHandler = () => {
    const run = (query) => {
        axios.post('/run',{query}).then(x => {
           // x.data.data
        });
    }

    return {run};
}
    

export const CypherPage = () => {
    const [running, setRunning] = useState(false);
    const [shrinable, setShrinable] = useState(false);
    const [height, setHeight] = useState(defaultHeight);
    const [query, setQuery] = useState('');
    const history = useHistory(); 

    const addToHistory = (query) => {
        history.add(query);
    }

    const run = () => {
        console.log("dsds");
        setRunning(true);
        addToHistory(query);
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

    },[shrinable])
    
    return <>
    <Row justify="end">
        <Col span={2} style={{textAlign:'center'}}>
            <Switch unCheckedChildren={'shrink'} checkedChildren={'unshrink'}defaultChecked={shrinable} onChange={x => setShrinable(x)} />
        </Col>
        <Col span={5}>
            <Button style={{ width: '100%' }} icon={<ShareAltOutlined />} loading={running} type="primary">Run <small>(crtl+enter)</small></Button>
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
                            Content of Tab Pane 1
                         </TabPane>
                        <TabPane tab="JSON RESULTS" key="2">
                            Content of Tab Pane 2
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