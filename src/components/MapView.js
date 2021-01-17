
import React, {useContext} from 'react';
import ReactEcharts from 'echarts-for-react';
import {store} from "../store";
import '../index.css';
import echarts from 'echarts';
import usaJson from '../USA.json'; // 使用美国地图数据


// 按日期取出某一天confirmed/deaths的数据
function convertData(state,mode,date) {
    let data = state.data
    if (data.length === 0)
        return;
    const res = [];
    let temp={};
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
    //console.log(res);
    return res;
}

/* 读取所有日期的数据，直接传回给options */
function LoadFullData(state) {
    
    let FullData = [];
    let data = state.data;
    if (data.length === 0)
        return;
    for (let i = 0; i < data[0].confirmed_data.length-1; i++)
    {
        let name = '';
        if(i<14)
            name = 'USA confirmed cases and deaths (2020-3-' + (i+18).toString() + ')';
        else
            name = 'USA confirmed cases and deaths (2020-4-' + (i-13).toString() + ')';
        FullData.push(
        {
            title: { text: name},
            series: [{data:convertData(state,0,i)},{data:convertData(state,1,i)},]
        } 
        )
    }
    return FullData;
}

function MapView(){
    // const {state, changeState} = useState()
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
            baseOption: {
                timeline: {
                    left:'left',
                    right :'left',
                    loop: false,
                    autoPlay: function(){ 
                        console.log(state.time_play)
                        return state.time_play;}(),
                    currentIndex: state.date,
                    playInterval: 800,
                    tooltip: {
                        formatter: function(params) {
                        return params.name;
                        }
                    },
                    axisType: 'category',
                    label:{
                        color: '#000000',
                        formatter: function (value, index) {
                            // 格式化成月/日，只在第一个刻度显示年份
                            if(index === 0 || index === 14 || index === 43 || 
                                index<12&&index>3&&(index-1)%3===0 || index>14&&(index-12)%4===0)
                            {
                                var date = new Date(value);
                                var texts = [(date.getMonth() + 1), date.getDate()];
                                if (index === 0) {
                                    texts.unshift('2020');
                                }
                                return texts.join('/');
                            }
                            return '' 
                        },
                        interval: 0,
                    },
                    emphasis: { controlStyle:{color: '#800026',} },
                    data:[ 
                        {
                            value: '2020-03-18',
                            symbol: 'diamond',  // 此项的图形的特别设置。
                            symbolSize: 18,      // 此项的图形大小的特别设置。
                            tooltip: {
                                formatter: function(params) {
                                return params.name + '<br>' + '疫情开始爆发';
                                }
                            },
                        },    
                        '2020-03-19','2020-03-20','2020-03-21','2020-03-22','2020-03-23',
                        '2020-03-24','2020-03-25','2020-03-26','2020-03-27','2020-03-28','2020-03-29','2020-03-30',
                        '2020-03-31',
                        {
                            value: '2020-04-01',
                            symbol: 'diamond',  // 此项的图形的特别设置。
                            symbolSize: 18,      // 此项的图形大小的特别设置。
                            tooltip: {
                                formatter: function(params) {
                                return params.name + '<br>' + '感染人数剧增';
                                }
                            },
                        },
                        '2020-04-02','2020-04-03','2020-04-04','2020-04-05','2020-04-06','2020-04-07','2020-04-08','2020-04-09',
                        '2020-04-10','2020-04-11','2020-04-12','2020-04-13','2020-04-14','2020-04-15','2020-04-16','2020-04-17',
                        '2020-04-18','2020-04-19','2020-04-20','2020-04-21','2020-04-22','2020-04-23','2020-04-24','2020-04-25',
                        '2020-04-26','2020-04-27','2020-04-28','2020-04-29',
                        {
                            value: '2020-04-30',
                            symbol: 'diamond',
                            symbolSize: 18,
                            tooltip: {
                                formatter: function(params) {
                                return params.name + '<br>' + '形式一片危机';
                                }
                            },
                        },],
                },
                title: {
                    subtext: 'Data from CSSEGISandData',
                    subtextStyle:{fontSize: '15'},
                    left: 'left',
                    top:'5%'
                },
                animation:false,
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
                    left: '80%',
                    top:'53%',
                    seriesIndex:0,
                    inRange: {
                    color: ['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c','#08306b']
                    },
                    min:0,
                    max:10000,
                    text: ['High', 'Low'],           // 文本，默认为数值文本
                    calculable: true,
                    hoverLink:true
                },
                {
                    type: 'continuous',
                    left: 'right',
                    top:'53%',
                    seriesIndex:1,
                    inRange: {
                    color: ['#ffffcc','#ffeda0','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#bd0026','#800026']
                    },
                    min:0,
                    max:500,
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
                    selected: {
                        'USA confirmed cases': function(){ return state.mode === "confirmed";}(),
                        'USA deaths': function(){return state.mode === "deaths";}(),
                    },
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
                        layoutCenter: ['43%', '55%'],
                        layoutSize: 700,
                        roam: true,
                        scaleLimit:{min:0.6,max:5},
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 16,
                                color: '#111',
                            },
                            itemStyle: {
                                areaColor: '#FFF3B0',
                                borderWidth: 1.5,
                                borderColor: '#333',
                            }
                        },
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
                                fontSize: 16,
                                color: '#111',
                            },
                            itemStyle: {
                                areaColor: '#E9FAFF',
                                borderWidth: 1.5,
                                borderColor: '#333',
                            }
                        },
                    },
                ]
            },
            options:LoadFullData(state)
    }
        return option;
    };
    let onEvents = {
        
        'click': function(params){ // YRH 点击省份更换省份
            //console.log("click");
            console.log(params);
            // 点击地图上的州，传给dispatch需要一个州的数据
            if (params.componentType === 'series'){
                let action = 'addState_' + params.name;
                dispatch({type: action});
            }
        },

        'legendselectchanged': function(params) {   // YRH 点击legend改变mode

            if(params.name === 'USA deaths'){
                console.log("death selected");
                let action = 'changeMode_deaths';
                dispatch({type: action});
            }
            else if (params.name === 'USA confirmed cases') {
                console.log("death confirmed");
                let action = 'changeMode_confirmed';
                dispatch({type: action});
            }
        },

        'timelinechanged': function(params) {   // 时间轴刷新
            
            //console.log(params);
            //console.log('change the date:' + params.currentIndex.toString());
            let action = 'changeDate_' + params.currentIndex;
            dispatch({type: action});
        },
        'timelineplaychanged': function(params) {
            console.log(params.playState);   
            let action = 'changeTimePlay_' + params.playState;
            dispatch({type: action});
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
