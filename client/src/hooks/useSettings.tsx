import { Settings, SettingsItem } from "../models";

export const useSettings = () => {
    let def: Settings  = {nodeSettings:new Map<string,SettingsItem>(),edgeSettings:new Map<string,SettingsItem>()}
    const settings : Settings = JSON.parse(localStorage.getItem('settings') || JSON.stringify(def) );
    const setNode = (label: string, SettingsItem, ifNotExistsOnly: boolean) => {
        if((!ifNotExistsOnly && settings.nodeSettings[label] !== null)){
            settings.nodeSettings[label] = SettingsItem;
            write();
        }
        
    }

    const randomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

    const getOrCreate = (type: 'edge' | 'node', label: string) : SettingsItem => {
        var toReturn = settings?.edgeSettings[label] || settings?.nodeSettings[label];
        if(!toReturn){
            if(type == 'edge'){
                toReturn = settings.edgeSettings[label] = {borderColor: randomColor(),fillColor: randomColor(), size: 30, opacity: 1}
            }else{
                toReturn = settings.nodeSettings[label] = {borderColor: randomColor(),fillColor: randomColor(), size: 30, opacity: 1}
            }
        }
        write();
        return toReturn;
    }

    const setEdge = (label: string, SettingsItem, ifNotExistsOnly: boolean) => {
        settings.edgeSettings[label] = SettingsItem;
        write();
    }

    const write = () => {
        localStorage.setItem('settings', JSON.stringify(settings));
    }
    return {setEdge, setNode, getOrCreate}
} 