import React, { useState, useEffect } from "react"
import { SketchPicker } from 'react-color'
import { Col, Row, Input, Switch, InputNumber } from "antd";
import { useSettings } from "../hooks/useSettings";
import { SettingsItem } from "../models";


export const NodeInformation = (props: { type: 'edge' | 'node', itemType: string, label: string, settingsItem: SettingsItem, onSettingsChange: () => void }) => {
    const graphSetting = useSettings();
    //var found = graphSetting.getOrCreate(props.type, props.label);

    const [settingsItem, setSettingsItem] = useState<SettingsItem>(props.settingsItem);

    const change = () => {
       
        if (props.type == 'edge') {
            graphSetting.setEdge(props.itemType, settingsItem, false)
        } else {
            graphSetting.setNode(props.itemType, settingsItem, false)
        }
        props.onSettingsChange();
    };
    //useEffect(() => setSettingsItem(graphSetting.getOrCreate(props.type, props.label)), []);
    useEffect(() => change(), [settingsItem]);
    return <>
     <Row gutter={[3,6]} ></Row>
        <Row gutter={[3,6]} >
            <Col span={10}>Fill color</Col>
            <Col span={14}>
                <ColorPicker color={settingsItem.fillColor!} setColor={x => setSettingsItem(b =>({ ...b, fillColor:x  }))}></ColorPicker>
            </Col>
        </Row>
         <Row gutter={[3,6]} > 
            <Col span={10}>Border color</Col>
            <Col span={14}>
                <ColorPicker color={settingsItem.borderColor!} setColor={x => setSettingsItem(b => ({ ...b, borderColor:x  }))}></ColorPicker>
            </Col>
        </Row>
        <Row gutter={[3,6]} > 
            <Col span={10}>Shadow</Col>
            <Col span={14}>
                <Switch checked={settingsItem.shadow}  onClick={x =>setSettingsItem(b =>({ ...b, shadow:x  }))} />
            </Col>
        </Row>
        <Row gutter={[3,6]} > 
            <Col span={10}>Opacity</Col>
            <Col span={14}>
                <InputNumber value={settingsItem.opacity} style={{width:'100%'}} min={0.2} max={1} step={0.1} onChange={x =>{setSettingsItem(b =>({ ...b, opacity : x  }));}} />
            </Col>
        </Row>
        <Row gutter={[3,6]} > 
            <Col span={10}>Size</Col>
            <Col span={14}>
                
                <InputNumber value={settingsItem.size}  style={{width:'100%'}} min={10} max={80} step={0.1} onChange={x =>{setSettingsItem(b => ({ ...b, size : x  }));}} />
            </Col>
        </Row>

        <Row gutter={[3,6]} > 
            <Col span={10}>Display property</Col>
            <Col span={14}>
                
                <Input defaultValue={settingsItem.displayProperty } id="displayProperty" style={{width:'100%'}} onBlur={x =>{console.log(x); setSettingsItem(b => ({ ...b, displayProperty : x.target.value  }));}} />
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