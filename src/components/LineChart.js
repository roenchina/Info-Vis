import React, {useContext} from 'react';
import {store} from "../store";
import ReactEcharts from "echarts-for-react";

function convertData(state) {
    let res = [];
    console.log("-------------------");
    console.log(state);
    for(let i=0; i<state.inLine.length; i++) {   // YRH 对每一个需要加入的省份
        let state_name = state.inLine[i];
        let this_state_data = new Array(45).fill(0);
        let tot_population = 0;

        state.data.forEach(function(item, index, arr){  // YRH 遍历所有数据列表
            if(item.province_name === state_name){   // YRH 如果为当前省份的某数据列表
                let former = this_state_data;
                let to_add = [];

                if(state.mode === 'deaths' || state.mode === 'deathsRate')
                    to_add = item.deaths_data;
                else if (state.mode === 'confirmed' || state.mode === 'confirmedRate')
                    to_add = item.confirmed_data;

                tot_population += item.Population;
                
                former.forEach(function(v, index){
                    this_state_data[index] = v + to_add[index];
                })
            }
        })

        if (state.mode === 'deathsRate' || state.mode === 'confirmedRate')
            this_state_data.forEach(function(v, index){
                this_state_data[index] = v / tot_population
            })


        // 每个county的都加完了，push到res里面
        res.push({
            name: state_name,
            type: 'line',
            data: this_state_data,  // YRH 是一个30天的数组
        });
    }
    return res;
}

function AssistView() {
    const {state, dispatch} = useContext(store);
    const getOption = () => {
        var option = {
            legend: {
                type: 'scroll',
                top: 15,
                left: 10,
                data:(function (){
                    return state.inLine
                })()
            },

            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    animation: false,
                },
            },

            grid: {
                left: '3%',
                right: '4%',
                bottom: '40%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: (function () {
                    var res=[];
                    var i;
                    for(i=0; i<45; i++) {
                        var month = i<15 ? '3' : '4';
                        var day = i<15 ? i+18 : i-14;
                        var date = '2020-' + month + "-" + day.toString(10);
                        res.push(date);
                    }
                    return res;
                })(),
                axisLabel: {
                    show: true,
                    interval: 'auto',
                    formatter: function (value, index) {
                        var date = new Date(value);
                        var texts = [(date.getMonth() + 1), date.getDate()];
                        return texts.join('-');
                    }
                },
                axisPointer: [],
                splitLine: {
                    show: false
                },
                boundaryGap: false,
            },

            yAxis: {
                axisLabel: {
                },
                axisPointer: {
                    snap: true,
                    label: {
                        precision: 0,
                    }
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
             style={{height: '350px', width: '100%'}}
             onEvents={onEvents} />;
}

export default AssistView;
