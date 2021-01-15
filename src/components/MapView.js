
import React, {useContext} from 'react';
import ReactEcharts from 'echarts-for-react';
import {store} from "../store";
import '../index.css';
import echarts from 'echarts';
import 'echarts/map/js/china';
import geoJson from 'echarts/map/json/china.json'; // 使用中国地图数据
import { provienceData } from '../store/geoData';


// 把index中的数据转化为视图所需要的数据

const symbolMaxSize = 50;

function convertData(state) {
    let data = state.data;
    const res = [];
    for (let i = 0; i < data.length; i++) {
            let resScore = 0;
            let sumWeight = 0;
            for (let j = 0; j < 5; j++)
            {
                resScore += data[i].score[j] * state.weight[j];
                sumWeight += state.weight[j];
            }
            resScore /= sumWeight;
            res.push({
                name: data[i].college,
                value: [].concat(data[i].coord[0], data[i].coord[1], resScore),
                area: data[i].prov,
                score: resScore
            });
    }
    return res;
}

function MapView(){
    const {state, dispatch} = useContext(store);
    echarts.registerMap('china', geoJson);
    for (const item of provienceData) {

            item.itemStyle = {
                normal: {
                    areaColor: '#D9D9D9',
                },
                emphasis: {
                    areaColor: '#D9D9D9',
                }
            }
    }
    const getOption = () => {
        var option = {
            grid: {
                left: '1%',
                right: '1%',
                top: '1%',
                bottom: '1%',
                containLabel: true
            },
            geo: {
                map: 'china',
                roam: true,
                label: {
                    show: false, // 显示省份标签
                    position: 'top',
                    fontWeight: 'bolder',
                    fontSize: 30,
                    color: '#c71585'// 省份标签字体颜色
                },
                itemStyle: {
                        borderWidth: 0.5, // 区域边框宽度
                        borderColor: '#000', // 区域边框颜色
                        areaColor: '#F3F2D8',
                        label: { show: false }                    
                }
            },
            series: [
                {
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data: convertData(state),
                    roam: false,

                    symbolSize: function (val) {
                        return val[2] * symbolMaxSize / 100; // val[2] 为分数值
                    },
                    label: {
                        show: true,
                        color: "#000",
                        formatter: '',
                        position: 'top',
                        fontWeight: 'bolder',
                        fontSize: 30,
                    },

                    itemStyle: {
                        normal: {
                            color: function (val) {
                                if (val.data.area === state.province || state.province === null)
                                    return '#E15457'
                                else
                                    return '#D9B38B'
                            }
                        }
                    },
                },
            ],
        }
        return option;
    };
    let onEvents = {
        'mouseover': function(params){        //鼠标放上颜色变红
            console.log("mouseover, ", params);
            if (params.componentType === 'series') {
                params.event.target.style.text = params.data.name + "\n\r分数" + params.data.score.toFixed(2); // 手动实现悬停显示
            }
            params.color = '#d50000';
            params.event.target.style.fill = '#d50000';
        },

        'click': function(params){ // 点击省份更换省份
            if (params.componentType === 'geo'){
                let action = 'changeProvince_' + params.name;
                dispatch({type: action});
            } else if (params.componentType === 'series') {
                let action = 'addRadar_' + params.data.name;
                dispatch({type: action}); 
            }
        }
    }

    return <ReactEcharts option={getOption()}
             style={{height: '760px', width: '100%'}}
             onEvents={onEvents} />;

}

export default MapView;
