// 本文件处理数据逻辑

//import React, {createContext, useReducer, useEffect} from 'react';
import React, {createContext, useReducer, useEffect} from 'react';
import {fetchCsvData } from "./api";

// 初始数据
const initialState = {
    count: 0,
    province: null,
    date: 0,
    time_play:false,
    mode: "confirmed",      // YRH 显示确诊或死亡
    inLine: [],             // YRH 折线图里面应该显示的州的名字
    data: [],
};

// 不同请求的处理
const reducer = (state, action) => {
    console.log("action: ", action);
    if(action.type === 'increment'){
        return {
            ...state,
            count: state.count + 1
        };
    } 
    else if(action.type === 'Init')
    {
        const payload = action.payload;
        var newData = payload;
        newData.forEach(function(item, index, arr) {
            item.score = []
            // console.log(item);
            item.county_name = item.Admin2
            item.province_name = item.Province_State
            item.population = item.Population
            item.confirmed_data = []; 
            item.deaths_data = [];
            for(let attr in item) 
                if (attr.split('_')[0] === 'confirmed')
                    item.confirmed_data.push(item[attr]);
                else if (attr.split('_')[0] === 'deaths')
                    item.deaths_data.push(item[attr]);       
            item.score[1] = payload.score1
            item.score[2] = payload.score2
            item.score[3] = payload.score3
            item.score[4] = payload.score4
            item.coord = []
            item.coord[0] = payload.Long
            item.coord[1] = payload.Lat
        })
        console.log("newData: ", newData)
        return {
            ...state,
            data: newData,
            weight: [1,1,1,1,1],
            count: 0,
            inRadar: [],
            province: null
        };
    } 
    var add = action.type.split('_')
    if(add[0] === 'addState'){ // YRH 加入一个州
        let newLine = state.inLine;  // YRH 更行折线图inLine变量
        let i;
        for(i=0; i<newLine.length; i++)
            if(newLine[i] === add[1])
                return {
                    ...state,
                };

        newLine.push(add[1]);
        return {
            ...state,
            inLine: newLine
        };
    }
    else if(add[0] === 'changeMode'){
        return {
            ...state,
            mode: add[1]
        }
    }
    else if(add[0] === 'changeDate'){
        return {
            ...state,
            date: parseInt(add[1])
        }
    }
    else if(add[0] === 'changeTimePlay'){
        if(add[1] === 'true')
        return {
            ...state,
            time_play:true
        }
        return {
            ...state,
            time_play:false
        }
    }
    else
        throw new Error();

}
// 创建数据中心的这样一个上下文，一般称为store
const store = createContext();
// 包装成数据组件

function StateProvider({children}) {
    // 绑定数据以及数据处理方法
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        fetchCsvData('./USA_data.csv')
          .then(res => {
              dispatch({
                  type: 'Init',
                  payload: res
              })
          })
    }, [])
    console.log("State: ", state)
    // 为子元素包裹上数据的上下文环境，方便所有子元素读取
    return <store.Provider value={{state, dispatch}}>
        {children}
    </store.Provider>
}

export {store, StateProvider}
