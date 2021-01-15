// 本文件处理数据逻辑

//import React, {createContext, useReducer, useEffect} from 'react';
import React, {createContext, useReducer, useEffect} from 'react';
import {fetchCsvData } from "./api";

// 初始数据
const initialState = {
    count: 0,
    weight: [1,1,1,1,1],    // 5个维度的权重
    inRadar: [],            // 雷达图中应该显示的学校名称
    province: null,
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
    } else if(action.type === 'init'){
        var payload = action.payload;
        console.log("payload: ", payload)
        var newData = payload
        newData.forEach(function(item, index, arr) {
            item.score = []
            item.score[0] = item.score0
            item.score[1] = item.score1
            item.score[2] = item.score2
            item.score[3] = item.score3
            item.score[4] = item.score4
            item.coord = []
            item.coord[0] = item.Long
            item.coord[1] = item.Lat
        })
        console.log("newData: ", payload)
        return {
            ...state,
            data: newData,
            weight: [1,1,1,1,1],
            count: 0,
            inRadar: [],
            province: null
        };
    } else if(action.type === 'reset'){
        return {
            ...state,
            weight: [1,1,1,1,1]
        };
    }
    var add = action.type.split('_')
    if(add[0] === 'incWeight'){
        let idx = parseInt(add[1])
        let newW = state.weight
        newW[idx] = newW[idx]+1 > 10 ? 10:newW[idx]+1
        return {
            ...state,
            weight: newW
        };
    } else if (add[0] === 'decWeight'){
        let idx = parseInt(add[1])
        let newW = state.weight
        newW[idx] = newW[idx]-1 < 0 ? 0:newW[idx]-1
        return {
            ...state,
            weight: newW
        };
        
    } else if(add[0] === 'addRadar'){
        let college = add[1]
        let newR = state.inRadar
        newR.push(college)
        return {
            ...state,
            inRadar: newR
        };
    } else if(add[0] === 'rvmRadar'){
        let college = add[1]
        let newR = state.inRadar
        // 从newR中删除=college的元素
        newR.forEach(
            function(item, index, arr) {
                if(item === college)
                    arr.splice(index, 1);
        });
        return {
            ...state,
            inRadar: newR
        };
    } else if(add[0] === 'changeProvince'){
        if (state.province === add[1])
        {
            return {
                ...state,
                province: null               
            }
        }
        return { // 更换为另一个省份
            ...state,
            province: add[1]
        };
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
        fetchCsvData('./data.csv')
          .then(res => {
              dispatch({
                  type: 'init',
                  payload: res
              })
          })
    }, [])

    // 为子元素包裹上数据的上下文环境，方便所有子元素读取
    return <store.Provider value={{state, dispatch}}>
        {children}
    </store.Provider>
}

export {store, StateProvider}
