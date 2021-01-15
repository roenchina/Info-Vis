import React, {useContext} from 'react';
import {store} from "../store";
//import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

function ControlPanel() {
    const {state, dispatch} = useContext(store);

    return <div>
        
        <h3 align='center'>权重控制</h3>
        <Divider />

        <h4 align='center'>师资力量: </h4>
        <p align='center'>
        <button onClick={() => dispatch({type: 'decWeight_0'})}>-</button>
        &nbsp;{state.weight[0]}&nbsp;
        <button onClick={() => dispatch({type: 'incWeight_0'})}>+</button>
        </p>

        <h4 align='center'>科研水平: </h4>
        <p align='center'>
        <button onClick={() => dispatch({type: 'decWeight_1'})}>-</button>
        &nbsp;{state.weight[1]}&nbsp;
        <button onClick={() => dispatch({type: 'incWeight_1'})}>+</button>
        </p>

        <h4 align='center'>科研经费: </h4>
        <p align='center'>
        <button onClick={() => dispatch({type: 'decWeight_2'})}>-</button>
        &nbsp;{state.weight[2]}&nbsp;
        <button onClick={() => dispatch({type: 'incWeight_2'})}>+</button>
        </p>

        <h4 align='center'>就业水平: </h4>
        <p align='center'>
        <button onClick={() => dispatch({type: 'decWeight_3'})}>-</button>
        &nbsp;{state.weight[3]}&nbsp;
        <button onClick={() => dispatch({type: 'incWeight_3'})}>+</button>
        </p>

        <h4 align='center'>国际化率: </h4>
        <p align='center'>
        <button onClick={() => dispatch({type: 'decWeight_4'})}>-</button>
        &nbsp;{state.weight[4]}&nbsp;
        <button onClick={() => dispatch({type: 'incWeight_4'})}>+</button>
        </p>

        <p align='center'>
        <Button variant="contained" color="secondary" size="small" onClick={() => dispatch({type: 'reset'})}>重置权重</Button>
        </p>

    </div>;
}

export default ControlPanel;
