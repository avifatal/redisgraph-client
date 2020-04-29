
export interface Edge{
    from?: any;
    to?: any;
}

export interface Node{
    id?: string;
}

export interface GraphData{
    edges?: Edge[];
    nodes?: Node[]
}

export interface Settings{
    nodeSettings: Map<string,SettingsItem>;
    edgeSettings: Map<string,SettingsItem>;
}

export interface SettingsItem{
    fillColor?: string;
    borderColor?: string;
    shadow?: boolean;
    size?: number;
    opacity?: number;
}