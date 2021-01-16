
import React, {useContext} from 'react';
import ReactEcharts from 'echarts-for-react';
import {store} from "../store";
import '../index.css';
import echarts from 'echarts';
import usaJson from '../USA.json'; // 使用中国地图数据
// import { provienceData } from '../store/geoData';


// 把index中的数据转化为视图所需要的数据


function convertData(state,mode) {
    let data = state.data
    if (data.length === 0)
        return;
    let date = state.date;
    const res = [];
    let temp={};
    console.log(state);
    temp.name = data[0].province_name;
    temp.value = 0;
    if(mode === 0){ // confirmed_data
        for (let i = 0; i < data.length; i++) {
        if(data[i].province_name === temp.name)
            temp.value += data[i].confirmed_data[date];
        else{
            res.push({
                name: temp.name,
                value: temp.value,
            });
            temp.name = data[i].province_name;
            temp.value = data[i].confirmed_data[date];
            }   
        }
    }
    else{ // deaths_data
        for (let i = 0; i < data.length; i++) {
            if(data[i].province_name === temp.name)
                temp.value += data[i].deaths_data[date];
            else{
                res.push({
                    name: temp.name,
                    value: temp.value,
                });
                temp.name = data[i].province_name;
                temp.value = data[i].deaths_data[date];
                }   
            }
        }
    console.log(res);
    return res;
}

function MapView(){
    const {state, dispatch} = useContext(store);
    echarts.registerMap('USA', usaJson, {
        // 部分区域调整位置
        Alaska: {              // 阿拉斯加
            left: -140,
            top: 23,
            width: 25
        },
        Hawaii: {
            left: -110,        // 夏威夷
            top: 22,
            width: 10
        },
        'Puerto Rico': {       // 波多黎各国自治区
            left: -76,
            top: 26,
            width: 5
        }
    });
    const getOption = () => {
        var option = {
            
            animation:false,
            title: {
                text: 'USA confirmed cases and deaths (2020)',
                subtext: 'Data from CSSEGISandData',
                subtextStyle:{fontSize: '15'},
                left: 'left',
                top:'5%'
            },
            tooltip: {
                trigger: 'item',
                showDelay: 0,
                transitionDuration: 0.2,
                enterable: true,
                formatter: function (params) {
                    var value = (params.value + '').split('.');
                    value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
                    return params.seriesName + '<br/>' + params.name + ': ' + value;
                },
                textStyle:{
                    fontWeight:'bold',
                    textBorderColor:'black',
                    textBorderWidth:'2',
                    fontSize:'16',
                }
            },
            visualMap: [
            {
                type: 'continuous',
                left: '82%',
                top:'bottom',
                seriesIndex:0,
                inRange: {
                color: ['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c','#08306b']
                },
                text: ['High', 'Low'],           // 文本，默认为数值文本
                calculable: true,
                hoverLink:true
            },
            {
                type: 'continuous',
                left: 'right',
                top:'bottom',
                seriesIndex:1,
                inRange: {
                color: ['#ffffcc','#ffeda0','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#bd0026','#800026']
                },
                text: ['High', 'Low'],           // 文本，默认为数值文本
                calculable: true,
                hoverLink:true
            }
            ],
            color:['#08519c','#bd0026'], // 图例的颜色
            legend: {
                show: 'true',
                icon: 'roundRect',
                data: ['USA confirmed cases','USA deaths'],
                left: 'right',
                top: '5%',
                selectedMode:'single', // 设置为单选模式,或者是确诊,或者是死亡人数
                textStyle:{
                    fontWeight:'bold',
                    fontSize: 14,

                }
            },
            series: [
                {
                    type: 'map',
                    map:'USA',
                    name: 'USA confirmed cases',
                    showLegendSymbol:false,
                    layoutCenter: ['45%', '55%'],
                    layoutSize: 700,
                    roam: true,
                    scaleLimit:{min:0.6,max:5},
                    emphasis: {
                        label: {
                            show: true,
                            fontSize:18,
                        }
                    },
                    textFixed: {
                        Alaska: [50, -20]
                    },
                    data: convertData(state,0)
                },
                {
                    type: 'map',
                    map:'USA',
                    name:'USA deaths',
                    showLegendSymbol:false,
                    layoutCenter: ['45%', '55%'],
                    layoutSize: 700,
                    roam: true,
                    scaleLimit:{min:0.6,max:5},
                    emphasis: {
                        label: {
                            show: true,
                            fontSize:18,
                        }
                    },
                    textFixed: {
                        Alaska: [50, -20]
                    },
                    data: convertData(state,1)
                },
            ],
        }
        return option;
    };
    let onEvents = {
        // 'mouseover': function(params){        //鼠标放上颜色变红
        //     console.log("mouseover, ", params);
        //     if (params.componentType === 'series') {
        //         params.event.target.style.text = params.data.name + "\n\r分数" + params.data.score.toFixed(2); // 手动实现悬停显示
        //     }
        //     params.color = '#d50000';
        //     params.event.target.style.fill = '#d50000';
        // },

        'click': function(params){ // YRH 点击省份更换省份
            console.log("click");
            console.log(params);
            // 点击地图上的州，传给dispatch需要一个州的数据
            if (params.componentType === 'series'){
                let action = 'addState_' + params.name;
                dispatch({type: action});
            }
            // else if (params.componentType === 'series') {
            //     let action = 'addRadar_' + params.data.name;
            //     dispatch({type: action}); 
            // }
        },

        'legendselectchanged': function(params) {   // YRH 点击legend改变mode
            if(params.name === 'USA deaths'){
                console.log("death selected");
                let action = 'changeMode_deaths';
                dispatch({type: action});
            }
            else if (params.name === 'USA confirmed cases') {
                console.log("death confirmed");
                let action = 'changeMode_confirmed' + params.name;
                dispatch({type: action});
            }
        }
    }

    return <ReactEcharts option={getOption()}
             style={{
                width: '100%',
                height: '95%' // 无法调节垂直居中,待解决问题
               }}
             onEvents={onEvents} />;

}

export default MapView;
