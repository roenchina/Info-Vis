
import React, {useContext} from 'react';
import ReactEcharts from 'echarts-for-react';
import {store} from "../store";
import '../index.css';
import echarts from 'echarts';
import usaJson from '../USA.json'; // 使用中国地图数据
// import { provienceData } from '../store/geoData';


// 把index中的数据转化为视图所需要的数据


function convertData(state) {
    let data = state.data
    if (data.length === 0)
        return;
    let date = state.date;
    const res = [];
    let temp={};
    console.log(state);
    temp.name = data[0].province_name;
    temp.value = 0;
    for (let i = 0; i < data.length; i++) 
    {
        //console.log(date);
        //console.log(data[i].confirmed_data[0]);
        if(data[i].province_name === temp.name)
            temp.value += data[i].confirmed_data[date];
        else
        {
            res.push({
                name: temp.name,
                value: temp.value,
            });
            temp.name = data[i].province_name;
            temp.value = data[i].confirmed_data[date];
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
    // for (const item of provienceData) {

    //         item.itemStyle = {
    //             normal: {
    //                 areaColor: '#D009D9',
    //             },
    //             emphasis: {
    //                 areaColor: '#1119D9',
    //             }
    //         }
    // }
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
            visualMap: {
                left: 'right',
                top:'bottom',
                inRange: {
                    // color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                    color:['#006837','#1a9850','#66bd63','#a6d96a','#d9ef8b','#ffffbf','#fee08b','#fdae61','#f46d43','#d73027','#a50026']
                },
                text: ['High', 'Low'],           // 文本，默认为数值文本
                calculable: true,
                hoverLink:true
            },
            series: [
                {
                    type: 'map',
                    map:'USA',
                    name: function () {
                        if(state.mapview_mode === 0)
                            return 'USA confirmed cases';
                        else
                            return 'USA deaths';
                    }(),
                    layoutCenter: ['45%', '55%'],
                    layoutSize: 700,
                    roam: true,
                    scaleLimit:{min:0.6,max:5},
                    emphasis: {
                        label: {
                            show: true
                        }
                    },
                    data: convertData(state)
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

        // 'click': function(params){ // 点击省份更换省份
        //     if (params.componentType === 'geo'){
        //         let action = 'changeProvince_' + params.name;
        //         dispatch({type: action});
        //     } else if (params.componentType === 'series') {
        //         let action = 'addRadar_' + params.data.name;
        //         dispatch({type: action}); 
        //     }
        // }
    }

    return <ReactEcharts option={getOption()}
             style={{
                width: '95%',
                height: '95%' // 无法调节垂直居中,待解决问题
               }}
             onEvents={onEvents} />;

}

export default MapView;
