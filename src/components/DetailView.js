//treemap
import React, {useContext} from 'react';
import ReactEcharts from 'echarts-for-react';
import {store} from "../store";
import { ArrowBackSharp } from '@material-ui/icons';

function convertData(state) {
    let res = [];
    // console.log("length of state: ", state.data.length);
    var state_name_last = "";
    let date = state.date;
    // 遍历state
    for(let i=0; i<state.data.length-1; i++) {   
        //得到当前state
        let state_name = state.data[i].province_name;
        //与上一个state重复则跳过
        if (state_name !== state_name_last){
            let state_children = [];
            let state_value = 0;
            let county_value = 0;
            //遍历state
            state.data.forEach(function(item, index, arr){  
                if(item.province_name === state_name){   
                    //遍历该state下的county
                    //console.log(state.date);
                    county_value = (state.mode==='deaths' ? item.deaths_data[date] : item.confirmed_data[date]);
                    state_value += county_value;
                    var child = {
                        name: item.county_name,
                        value: county_value
                    };
                    state_children.push(child);
                }
            })
            // note 出来这个forEach循环之后，state_children里面已经包含所有child：{children: { [name: county_name, value: ], [], [], ...}}
    
            // note 构造完整的州的数据并push到res里面
            res.push({
                name: state_name,   // 州名
                value: state_value,
                children: state_children    // 州children
            })
            state_name_last = state_name;
        }
    }
    // note: 出来这个for循环之后，res里面已经包含每个州的数据
    console.log("res:",res);
    // return {
    //     name: 'USA',
    //     children: res
    // };
    return res;

}

function DetailView() {

    const {state, dispatch} = useContext(store);
    const getOption = () => {     
        var option = {

            title: {
                text: 'Treemap for COVID cases in USA',
                subtext: '2020/3/18 to 4/30',
                subtextStyle:{fontSize: '15'},
                left: 'left',
                top:'3%'
            },
            tooltip: {},
            series: [{
                name: 'USA',
                type: 'treemap',
                visibleMin: 500,
                data: convertData(state),
                leafDepth: 3,
                breadcrumb: {
                    height: 30,
                    itemStyle: {
                      textStyle: {
                        fontSize: 25
                      }
                    }
                },
                levels: [
                    {
                        itemStyle: {
                            borderColor: '#777',
                            borderWidth: 0,
                            gapWidth: 3
                        }
                    },
                    {
                        colorSaturation: [0.3, 0.6],
                        itemStyle: {
                            borderColor: '#555',
                            borderWidth: 4,
                            gapWidth: 3
                        },
                        emphasis: {
                            itemStyle: {
                                borderColor: '#ddd'
                            },
                            upperLabel: {
                                position: 'inside',
                                color:'#000',
                                fontWeight:'bold'
                            }
                        },
                        upperLabel: {
                            show: true,
                            position: 'inside',
                            fontSize: 12
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
             style={{height: '95%', width: '100%'}}
             onEvents={onEvents} />;

}

export default DetailView;
