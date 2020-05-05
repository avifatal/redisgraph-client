import { GraphData } from "../models";
import axios from 'axios';
import { useSettings } from "./useSettings";

const server = 'http://localhost:5003';

var lastData = {}

export const useQueryHandler = () => {
    var settings = useSettings();
    const buildGraphData = (data) : GraphData => {
       
        let graphData: GraphData = {edges:[],nodes:[]};
        const addedNodes: any[] = [];
        for(let i of data){
            for(let b of i._values){
                if(b.destNode){
                    var node: any = {};
                    var item = settings.getOrCreate('edge', b.relation)
                    node.from = b.srcNode;
                    node.to = b.destNode;
                    node.label = b.relation;
                    node.opacity = item.opacity;
                    node.color = {color: item.fillColor, opacity: item.opacity}
                    node.itemType = b.label;
                    node.label = b.relation + (item.displayProperty ? " - " +  b.properties[item.displayProperty] : '')
                    graphData.edges?.push(node);
                }else{
                    if(!addedNodes.includes(b.id)){
                        var edge: any = {};
                        var item = settings.getOrCreate('node',b.label)
                        edge.color = {border: item.borderColor, background : item.fillColor };
                        edge.opacity = item.opacity;
                        edge.font = {size: 15}
                        edge.size = item.size;
                        edge.shadow = item.shadow;
                        edge.id = b.id;
                        debugger;
                        edge.itemType = b.label;
                        edge.label = b.label + (item.displayProperty ? " - " +  b.properties[item.displayProperty] : '')
                        addedNodes.push(edge.id);
                        graphData.nodes?.push(edge);
                    }
                }
            }
        }
        return graphData;
    }

    
    const rebuildData = () => {
        return {graphData: buildGraphData(lastData), jsonData: lastData }
    }
    const run = (query): Promise<{graphData:any,jsonData:[{}]}> =>  {
        return axios.post(server + '/run', {query} ).then(x => {
            lastData = x.data;
            return {graphData: buildGraphData(x.data), jsonData: x.data }
        });
    }

    return {run, rebuildData};
}