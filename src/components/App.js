// 本文件是界面UI的根目录

import React from 'react';
import clsx from "clsx";
import {makeStyles} from "@material-ui/core";
import AssistView from "./AssistView";
import ControlPanel from "./ControlPanel";
import DetailView from "./DetailView";
import MapView from "./MapView";

// 这是JSS的写法，相当于声明了一些css的类
const useStyles = makeStyles(theme => ({
    root: {
        background: 'linear-gradient(45deg, #DDDDDD 30%, #FF8E53 90%)',
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
    },
    view: {
        border: '1px solid black',
        borderRadius: '5px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        padding: '0 30px',
        background: '#FFFFFF',
    },
    controlPanel: {
        position: 'absolute',
        top: 70,
        bottom: 70,
        left: 70,
        width: 100,
    },
    detailView: {
        position: 'absolute',
        top: 20,
        left: 950,
        bottom: 50,
        width: 350,
    },
    assistView: {
        position: 'absolute',
        top: 20,
        height: 230,
        left: 100,
        width: 750,
    },
    mapView: {
        position: 'absolute',
        top: 270,
        bottom: 50,
        left: 100,
        width: 750,
    },
}))

// App组件
function App() {
    // 使用上述的css样式
    const classes = useStyles();

    // 使用classes.root使用样式中定义的root类
    // 可视化项目中，若干视图一般采用绝对布局，方便后续调整各个视图的位置与大小
    return(
        <div className={classes.root}>
            {/* <div className={clsx(classes.view, classes.controlPanel)}><ControlPanel/></div> */}
            <div className={clsx(classes.view, classes.detailView)}><DetailView/></div>  
            <div className={clsx(classes.view, classes.assistView)}><AssistView/></div>
            <div className={clsx(classes.view, classes.mapView)}><MapView/></div>
        </div>
    );
}

export default App;
