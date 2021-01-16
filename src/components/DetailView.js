//treemap
import React, {useContext} from 'react';
import ReactEcharts from 'echarts-for-react';
import {store} from "../store";
import { ArrowBackSharp } from '@material-ui/icons';

function convertData(state) {

}

function DetailView() {

    const {state, dispatch} = useContext(store);

    const getOption = () => {     
        var option = {

            title: {
                text: 'Treemap for COVID cases in USA',
                subtext: '2020/02-2020/04',
                left: 'leafDepth'
            },
            tooltip: {},
            series: [{
                name: 'option',
                type: 'treemap',
                visibleMin: 300,
                data: convertData(state),
                leafDepth: 2,
                levels: [
                    {
                        itemStyle: {
                            borderColor: '#555',
                            borderWidth: 4,
                            gapWidth: 4
                        }
                    },
                    {
                        colorSaturation: [0.3, 0.6],
                        itemStyle: {
                            borderColorSaturation: 0.7,
                            gapWidth: 2,
                            borderWidth: 2
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
        // 点击后把学校加入雷达图
        'click': function (params) {
            var action = 'addRadar_' + params.name
            dispatch({type: action})
        }
    }

    return <ReactEcharts option={getOption()}
             style={{height: '700px', width: '100%'}}
             onEvents={onEvents} />;

}

export default DetailView;
