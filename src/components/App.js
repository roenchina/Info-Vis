import React from 'react';
import clsx from "clsx";
import {makeStyles} from "@material-ui/core";

import LineChart from "./LineChart";
import Treemap from "./Treemap";
import MapView from "./MapView";

const useStyles = makeStyles(theme => ({
    root: {
        background: 'linear-gradient(35deg, #deebf7 30%, #3182bd 95%)',
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
    },
    view: {
        border: '1px solid black',
        borderRadius: '5px',
        boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)',
        padding: '0 30px',
        background: '#FFFFFF',
    },
    Treemap: {
        position: 'absolute',
        top: 20,
        left: 950,
        bottom: 50,
        width: 700,
    },
    LineChart: {
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

function App() {
    const classes = useStyles();
    return(
        <div className={classes.root}>
            <div className={clsx(classes.view, classes.Treemap)}><Treemap/></div>  
            <div className={clsx(classes.view, classes.LineChart)}><LineChart/></div>
            <div className={clsx(classes.view, classes.mapView)}><MapView/></div>
        </div>
    );
}

export default App;
