import React, { useState, useEffect } from "react"
import { SketchPicker } from 'react-color'
import { Col, Row, Input, Switch, InputNumber } from "antd";
import { useSettings } from "../hooks/useSettings";
import { SettingsItem } from "../models";


export const NodeInformation = (props: { type: 'edge' | 'node', label: string }) => {

    const graphSetting = useSettings();
    var found = graphSetting.getOrCreate(props.type, props.label);
    const [settingsItem, setSettingsItem] = useState<SettingsItem>(found);

    const change = () => {
        if (props.type == 'edge') {
            graphSetting.setEdge(props.label, settingsItem, false)
        } else {
            graphSetting.setNode(props.label, settingsItem, false)
        }
    };
    
    useEffect(() => change(), [settingsItem]);
    
    return <>
        <Row gutter={[3,6]} >
            <Col span={10}>Fill color</Col>
            <Col span={14}>
                <ColorPicker color={settingsItem.fillColor!} setColor={x => setSettingsItem(({ ...settingsItem, fillColor:x  }))}></ColorPicker>
            </Col>
        </Row>
         <Row gutter={[3,6]} > 
            <Col span={10}>Border color</Col>
            <Col span={14}>
                <ColorPicker color={settingsItem.borderColor!} setColor={x => setSettingsItem(({ ...settingsItem, borderColor:x  }))}></ColorPicker>
            </Col>
        </Row>
        <Row gutter={[3,6]} > 
            <Col span={10}>Shadow</Col>
            <Col span={14}>
                <Switch checked={settingsItem.shadow}  onClick={x =>setSettingsItem(({ ...settingsItem, shadow:x  }))} />
            </Col>
        </Row>
        <Row gutter={[3,6]} > 
            <Col span={10}>Opacity</Col>
            <Col span={14}>
                <InputNumber defaultValue={settingsItem.opacity} style={{width:'100%'}} min={0.2} max={1} step={0.1} onChange={x =>{setSettingsItem(({ ...settingsItem, opacity : x  }));}} />
            </Col>
        </Row>
        <Row gutter={[3,6]} > 
            <Col span={10}>Size</Col>
            <Col span={14}>
                <InputNumber defaultValue={settingsItem.size} style={{width:'100%'}} min={10} max={80} step={0.1} onChange={x =>{setSettingsItem(({ ...settingsItem, size : x  }));}} />
            </Col>
        </Row>
    </>
}

export const ColorPicker = (props: {color: string, setColor: (x) => void}) => {
    const [hidden, setHidden] = useState(true);
    const click = () => {
        setHidden(!hidden);
    }
    const cover = {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      } as any
    const action = <div onClick={click} className="color-picker" style={{background:props.color, width:'50px', height:'20px'}}></div>
    return <> 
             <Input defaultValue={props.color} addonAfter={action} />
             {!hidden && <div >
                <div style={ cover } onClick={x => setHidden(true) }/>
                <SketchPicker color={props.color}   onChangeComplete={x => {props.setColor(x.hex);} } />
            </div>}
    </>

}