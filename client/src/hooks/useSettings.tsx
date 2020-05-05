import { Settings, SettingsItem } from "../models";

export const useSettings = () => {
    let def: Settings = { nodeSettings: new Map<string, SettingsItem>(), edgeSettings: new Map<string, SettingsItem>() }

    const getSettings = () => { return JSON.parse(localStorage.getItem('settings') || JSON.stringify(def)) as Settings };

    const setNode = (label: string, SettingsItem, ifNotExistsOnly: boolean) => {
        var settings = getSettings();
        if (!ifNotExistsOnly && settings.nodeSettings[label] !== null) {
            settings.nodeSettings[label] = SettingsItem;
            write(settings);
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

    const getOrCreate = (type: 'edge' | 'node', itemType: string): SettingsItem => {
        var settings = getSettings();
        var toReturn: SettingsItem = {};
        if (type == 'edge') {
            toReturn = settings.edgeSettings[itemType];
            if (!toReturn) {
                settings.edgeSettings[itemType] = { borderColor: randomColor(), fillColor: randomColor(), size: 30, opacity: 1, displayProperty: '', itemType: itemType }
                toReturn = settings.edgeSettings[itemType];
                write(settings);
            }
        } else {
            toReturn = settings.nodeSettings[itemType]
            if (!toReturn) {
                settings.nodeSettings[itemType] = { borderColor: randomColor(), fillColor: randomColor(), size: 30, opacity: 1, displayProperty: '' }
                toReturn = settings.nodeSettings[itemType];
                write(settings);
            }
        }
        return toReturn;
    }

    const setEdge = (label: string, SettingsItem, ifNotExistsOnly: boolean) => {
        let settings = getSettings();
        settings.edgeSettings[label] = SettingsItem;
        write(settings);
    }

    const write = (write) => {
        localStorage.setItem('settings', JSON.stringify(write));
    }
    return { setEdge, setNode, getOrCreate }
} 