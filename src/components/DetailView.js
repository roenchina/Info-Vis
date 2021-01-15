import React, {useContext} from 'react';
import ReactEcharts from 'echarts-for-react';
import {store} from "../store";

function DetailView() {

    const {state, dispatch} = useContext(store);

    const getOption = () => {
        console.log(state.data);        
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                backgroundColor: 'rgba(245, 245, 245, 0.8)',
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
                textStyle: {
                    color: '#000'
                },
                position: function (pos, params, el, elRect, size) {
                    var obj = {top: 10};
                    obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                    return obj;
                },
                extraCssText: 'width: 170px',
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: false
                    },
                }
            },
            dataZoom: [
                {
                    type: 'inside',
                    xAxisIndex: [0],
                    startValue: 50,
                    endValue: 100,
                    filterMode: 'weakFilter'
                },
                {
                    show: true,
                    filterMode: 'weakFilter',
                    showDataShadow: false,
                    xAxisIndex: [0],
                    type: 'slider',
                    top: '5%',
                    left: '20%',
                    height: 10,
                    width: 210,
                    startValue: 50,
                    endValue: 100,
                    handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
                    handleSize: 15,
                    handleStyle: {
                        shadowBlur: 6,
                        shadowOffsetX: 1,
                        shadowOffsetY: 2,
                        shadowColor: '#aaa'
                    },
                    labelFormatter: ''
                }
            ],
            dataset: {
                source: (function () {
                    let data = [];
                    // 无选中省份
                    let flag = state.province==null ? true : false

                    let weightSum = 0
                    for(let i=0; i<state.weight.length; i++)
                        weightSum += state.weight[i]
                    
                    for(let j=0; j<state.data.length; j++){
                        let tuple = state.data[j]
                        if( flag || tuple.prov === state.province){
                            console.log(tuple)
                            // 计算某校总分
                            let score = 0
                            for(let i=0; i<state.weight.length; i++){
                                score += state.weight[i] * tuple.score[i]
                            }
                            score /= weightSum
                            score = score.toFixed(3);
                            // push进echarts显示列表
                            data.push({
                                cutoff: tuple.cutoff,
                                score: score,
                                college: tuple.college,
                            })
                        }
                    }
                    return data.sort(function (a, b) { return b.score - a.score; });
                })()
            },
            grid: {containLabel: true},
            yAxis: {
                name: 'score',
                inverse: true
            },
            xAxis: {
                type: 'category',
                axisLabel:{
                    rotate:60,
                    inside:true,
                },  
            },
            visualMap: {
                orient: 'vertical',
                left: 0,
                top: 30,
                min: 500,
                max: 750,
                calculable : true,
                itemWidth: 15,
                itemHeight: 150,
                text: ['高分', '低分'],
                dimension: 0,
                inRange: {
                    color: ['#D7DA8B', '#E15457']
                }
            },
            series: [
                {
                    type: 'bar',
                    encode: {
                        y: 'score',
                        x: 'college'
                    }
                }
            ]
        };
        return option
    };
    let onEvents = {
        // 点击后把学校加入雷达图
        'click': function (params) {
            var action = 'addRadar_' + params.name
            dispatch({type: action})
        }
    }

    return <ReactEcharts option={getOption()}
             style={{height: '300px', width: '100%'}}
             onEvents={onEvents} />;

}

export default DetailView;
