//treemap
import React, {useContext} from 'react';
import ReactEcharts from 'echarts-for-react';
import {store} from "../store";

function convertData(state) {
    let res = [];
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
                    if(state.mode === 'deaths')
                        county_value = item.deaths_data[date];
                    else if (state.mode === 'deathsRate' || state.mode == 'confirmedRate')
                        county_value = item.Population;
                    else county_value = item.confirmed_data[date];
                    state_value += county_value;
                    var child = {
                        name: item.county_name,
                        value: county_value
                    };
                    state_children.push(child);
                }
            })
            //console.log(stae.clickone[0])
            if(state.clickone.length > 0 && state.clickone === state_name){ // 被点击的省高亮
                res.push(
                {
                    name: state_name,   // 州名
                    value: state_value,
                    children: state_children,    // 州children
                    itemStyle: {
                        borderColor: '#ddd'
                    },
                    upperLabel: {
                        position: 'inside',
                        color:'#000',
                        fontWeight:'bold'
                    }
                })
            }
            else{
                res.push({
                name: state_name,   // 州名
                value: state_value,
                children: state_children    // 州children
            })}   
            state_name_last = state_name;
        }
    }
    console.log("res:",res);
    return res;

}

function DetailView() {

    const {state, dispatch} = useContext(store);
    const getOption = () => {     
        var option = {

            title: {
                text: 'Treemap for COVID cases in USA',
                subtext: function(){
                    //'2020/3/18 to 4/30'
                    if(state.mode === "confirmedRate" || state.mode === "deathsRate")
                        return 'Population';
                    if(state.date<14)
                        return  '2020/3/' + (state.date+18).toString();
                    return  '2020/4/' + (state.date-13).toString();
                }(),
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
                    height: 35,
                    top : 'bottom',
                    itemStyle: {
                      textStyle: {
                        fontSize: 18,
                        verticalAlign: 'bottom',
                      },
                      color: function(){
                            console.log(state.mode)
                            if(state.mode === 'confirmed' || state.mode === "confirmedRate")
                                return '#3182bd';
                            else return '#e6550d';
                        }(),
                      borderColor:'#bdbdbd',
                      borderWidth:1.5
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
