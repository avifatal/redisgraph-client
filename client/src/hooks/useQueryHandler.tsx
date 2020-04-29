import { GraphData } from "../models";
import axios from 'axios';
import { useSettings } from "./useSettings";

const server = 'http://localhost:5003';

export const useQueryHandler = () => {
    const buildGraphData = (data) : GraphData => {
        let graphData: GraphData = {edges:[],nodes:[]};
        const addedNodes: any[] = [];
        for(let i of data){
            for(let b of i._values){
                if(b.destNode){
                    graphData.edges?.push({to: b.destNode, from: b.srcNode });
                }else{
                    if(!addedNodes.includes(b.id)){
                        addedNodes.push(b.id);
                        graphData.nodes?.push(b);
                    }
                }
            }
        }
        return graphData;
    }

    const run = (query): Promise<{graphData:any,jsonData:[{}]}> =>  {
        return axios.post(server + '/run', {query} ).then(x => {
            return {graphData: buildGraphData(x.data), jsonData: x.data }
        });
    }

    return {run};
}