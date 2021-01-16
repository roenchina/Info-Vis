//treemap
import React, {useContext} from 'react';
import ReactEcharts from 'echarts-for-react';
import {store} from "../store";
import { ArrowBackSharp } from '@material-ui/icons';

function convertData(state) {
    let res = [];

    // TODO: 改成对所有州进行循环
    for(let i=0; i<state.inLine.length; i++) {   
        let state_name = state.inLine[i];

        let state_children = [];
        state.data.forEach(function(item, index, arr){  
            if(item.province_name === state_name){   
                //遍历county
                // res.children = res.children || [];

                var child = {   // note 构造某个county的数据
                    name: item.county_name,
                    value: item.confirmed_data
                };

                state_children.push(child); // note 把这个county的数据push到州里面
            }
        })
        // note 出来这个forEach循环之后，state_children里面已经包含所有child：{children: { [name: county_name, value: ], [], [], ...}}

        // note 构造完整的州的数据并push到res里面
        res.push({
            name: state_name,   // 州名
            children: state_children    // 州children
        })
    }
    // note: 出来这个for循环之后，res里面已经包含每个州的数据

    return {
        name: 'USA',
        children: res
    };
}

function DetailView() {

    const {state, dispatch} = useContext(store);

    const getOption = () => {     
        var option = {

            title: {
                text: 'Treemap for COVID cases in USA',
                subtext: '2020/02-2020/04',
                left: 'leafDepth'
            },
            tooltip: {},
            series: [{
                name: 'option',
                type: 'treemap',
                visibleMin: 300,
                data: convertData(state),
                leafDepth: 2,
                levels: [
                    {
                        itemStyle: {
                            borderColor: '#555',
                            borderWidth: 4,
                            gapWidth: 4
                        }
                    },
                    {
                        colorSaturation: [0.3, 0.6],
                        itemStyle: {
                            borderColorSaturation: 0.7,
                            gapWidth: 2,
                            borderWidth: 2
                        }
                    },
                    {
                        colorSaturation: [0.3, 0.5],
                        itemStyle: {
                            borderColorSaturation: 0.6,
                            gapWidth: 1
                        }
                    },
                    {
                        colorSaturation: [0.3, 0.5]
                    }
                ]
            }]
        };
        return option
    };
    let onEvents = {
    }

    return <ReactEcharts option={getOption()}
             style={{height: '700px', width: '100%'}}
             onEvents={onEvents} />;

}

export default DetailView;
