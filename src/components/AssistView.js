// 本文件是一个子视图

import React, {useContext} from 'react';
import {store} from "../store";
import ReactEcharts from "echarts-for-react";

function convertData(state) {
    let res = [];

    for(let i=0; i<state.inLine.length; i++) {   // YRH 对每一个需要加入的省份
        let state_name = state.inLine[i];

        let this_state_data = new Array(45).fill(0);

        state.data.forEach(function(item, index, arr){  // YRH 遍历所有数据列表
            if(item.province_name === state_name){   // YRH 如果为当前省份的某数据列表

                let former = this_state_data;
                let to_add = (state.mode==='deaths' ? item.deaths_data : item.confirmed_data);
                former.forEach(function(v, index){
                    this_state_data[index] = v + to_add[index];
                })
            }
        })

        // 每个county的都加完了，push到res里面
        res.push({
            name: state_name,
            type: 'line',
            data: this_state_data,  // YRH 是一个30天的数组
        });
    }
    console.log(res);
    return res;
}

function AssistView() {
    // 使用StateProvider提供的数据环境
    const {state, dispatch} = useContext(store);
    const getOption = () => {
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    animation: false,
                    label: {
                        backgroundColor: '#ccc',
                        borderColor: '#aaa',
                        borderWidth: 1,
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        color: '#222'
                    }
                },
                // formatter: function (params) {
                //     return params[2].name + '<br />' + ((params[2].value - base) * 100).toFixed(1) + '%';
                // }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '40%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: [],   // TODO 横轴数据
                // data.map(function (item) {
                //     return item.date;
                // }),
                axisLabel: {
                    formatter: function (value, idx) {
                        var date = new Date(idx);
                        return idx;
                    }
                },
                splitLine: {
                    show: false
                },
                boundaryGap: false
            },

            yAxis: {
                axisLabel: {
                    // formatter: function (val) {
                    //     return (val - base) * 100 + '%';
                    // }
                },
                axisPointer: {
                    // label: {
                    //     formatter: function (params) {
                    //         return ((params.value - base) * 100).toFixed(1) + '%';
                    //     }
                    // }
                },
                splitNumber: 3,
                splitLine: {
                    show: false
                }
            },
            series: convertData(state)
        };
        return option
    };

    let onEvents = {
    }

    return <ReactEcharts option={getOption()}
             style={{height: '300px', width: '100%'}}
             onEvents={onEvents} />;
}

export default AssistView;
