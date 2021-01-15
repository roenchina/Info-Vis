// 本文件是一个子视图

import React, {useContext} from 'react';
import {store} from "../store";
import ReactEcharts from "echarts-for-react";

function AssistView() {
    // 使用StateProvider提供的数据环境
    const {state, dispatch} = useContext(store);
    const getOption = () => {
        console.log(state.data);
        var option = {
            tooltip:{},
            legend: {
                type: 'scroll',
                orient: 'vertical',
                top: 15,
                left: 0,
                data:(function (){
                    return state.inRadar
                })()
            },
            radar: {
                name: {
                    textStyle: {
                        color: '#fff',
                        backgroundColor: '#999',
                        borderRadius: 3,
                        padding: [3, 5]
                    }
                },
                indicator: [
                    { name: '师资力量', max: 100},
                    { name: '科研水平', max: 100},
                    { name: '科研经费', max: 100},
                    { name: '就业水平', max: 100},
                    { name: '国际化率', max: 100}
                ]
            },
            series: (function (){
                var series = [];
                console.log(series);
                // 遍历雷达列表
                for(let i=0; i<state.inRadar.length; i++){
                    let clgData = {score:[0,0,0,0,0]};
                    // 遍历数据列表
                    state.data.forEach(function(item, index, arr){
                        if(item.college===state.inRadar[i]){
                            clgData = item;
                            console.log(item);
                            return;
                        }
                    })
                    series.push({
                        name: 'College Data',
                        type: 'radar',
                        symbol: 'none',
                        areaStyle: {
                            normal: {}
                        },
                        data:[{
                            value: clgData.score,
                            name: state.inRadar[i]
                        }]
                    });
                }
                return series
            })()
        };
        return option
    };

    let onEvents = {
        // 点击后把学校从雷达图中去除
        'click': function (params) {
            var action = 'rvmRadar_' + params.name
            dispatch({type: action})
        }
    }

    return <ReactEcharts option={getOption()}
             style={{height: '300px', width: '100%'}}
             onEvents={onEvents} />;
}

export default AssistView;
