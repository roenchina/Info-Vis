import React, {createContext, useReducer, useEffect} from 'react';
import {fetchCsvData } from "./api";

const initialState = {
    date: 0,
    time_play:false,
    mode: "confirmed",      // YRH 显示确诊或死亡
    inLine: [],             // YRH 折线图里面应该显示的州的名字
    data: [],
};

// 不同请求的处理
const reducer = (state, action) => {
    console.log("action: ", action);
    if(action.type === 'Init')
    {
        const payload = action.payload;
        var newData = payload;
        newData.forEach(function(item, index, arr) {
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
        })
        return {
            ...state,
            data: newData,
        };
    } 
    var keyword = action.type.split('_')
    if(keyword[0] === 'addState'){ // YRH 加入一个州
        let newLine = state.inLine;  // YRH 更行折线图inLine变量
        let i;
        for(i=0; i<newLine.length; i++)
            if(newLine[i] === keyword[1])
                return {
                    ...state,
                };
        newLine.push(keyword[1]);
        return {
            ...state,
            inLine: newLine
        };
    }
    else if(keyword[0] === 'changeMode'){
        return {
            ...state,
            mode: keyword[1]
        }
    }
    else if(keyword[0] === 'changeDate'){
        return {
            ...state,
            date: parseInt(keyword[1])
        }
    }
    else if(keyword[0] === 'changeTimePlay'){
        if(keyword[1] === 'true')
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

const store = createContext();
function StateProvider({children}) {
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
    return <store.Provider value={{state, dispatch}}>
        {children}
    </store.Provider>
}

export {store, StateProvider}
