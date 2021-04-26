import Head from 'next/head'
import styles from '../../styles/Finalize.module.css'
import { useRouter } from 'next/router'
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import React, { useEffect } from 'react';
import { GetStaticPaths } from 'next';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import ChartComponent from 'react-chartjs-2';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Card from '@material-ui/core/Card';


// plora.xyz/finalize/dst-regr63

export default function Finalize({tableData}) {
	const router = useRouter()
	const tableId:string = router.query.tableId as string

    const [state, setState] = React.useState({
        chartType: "",
        chartTitle: tableData.text,
        xVar: "",
        xVal: [],
        yVar: "",
        yVal: "",
        dataVar: "",
        dataVal: [],
        chartData: {},
        dataHelpText: "",
    });

    const colorscheme = [[78,121,167],[242,142,43],[225,87,89],[118,183,178],[89,161,79],[237,201,72],[176,122,161],[255,157,167],[156,117,95],[186,176,172]];

    const chunkArray = (myArray, chunk_size) => {
        var index = 0;
        var arrayLength = myArray.length;
        var tempArray = [];
        
        for (index = 0; index < arrayLength; index += chunk_size) {
            let myChunk = myArray.slice(index, index+chunk_size);
            // Do something if you want with the group
            tempArray.push(myChunk);
        }
    
        return tempArray;
    }

    const handleChartTitleChange = (event) => {
        setState({ ...state, chartTitle: event.target.value});
    };

    const handleVarChange = (event) => {
        const name = event.target.name;
        setState({
          ...state,
          [name]: event.target.value,
          [name.slice(0,-3)+"Val"]: [],
        });
    };

    const handleChange = (event) => {
        const name = event.target.name;
        setState({
          ...state,
          [name]: event.target.value,
        });
    }

    const handleToggle = (value, variable) => () => {
        var checked = [...state[variable + "Val"]];
    
        if (!checked.includes(value)) {
            checked.push(value);
        } else {
            checked = checked.filter(function(ele){ 
                return ele != value; 
            });
        }
    
        setState({
            ...state,
            [variable + "Val"]: checked,
        });
    };

    const getCombn = (arr, pre?) => {
        pre = pre || '';
        if (!arr.length) {
            return pre;
        }
        var ans = arr[0].reduce(function(ans, value) {
            return ans.concat(getCombn(arr.slice(1), pre + value));
        }, []);
        return ans;
    }

    const getData = () => {
        if (state.xVal.length > 0 && state.yVal.length > 0) {
            let reqURL = "https://api.statbank.dk/v1/data/" + tableData.id + "/JSONSTAT?timeOrder=Ascending"
            let usedVars = [state.xVar, state.yVar]

            reqURL += "&" + tableData.variables[state.xVar].id + "(Head)=" + state.xVal.join(",")
            reqURL += "&" + tableData.variables[state.yVar].id + "(Stub)=" + state.yVal

            if (!!state.dataVar.length && state.dataVal.length > 0) {
                reqURL += "&" + tableData.variables[state.dataVar].id + "(Stub)=" + state.dataVal.join(",")
                usedVars.push(state.dataVar)
            }

            tableData.variables.forEach((element, index) => {
                if (!element.elimination && usedVars.indexOf(index + "") === -1) {
                    reqURL += "&" + element.id + "(Stub)=*"
                }
            });

            console.log("Fetching");
            setState({ ...state, dataHelpText: "Henter..."});
            fetch(reqURL)
                .then(res => {
                    if (!res.ok) {
                        throw Error(res.statusText);
                    }
                    return res.json();
                }).then(res => {
                    console.log("raw: ", res);
                    

                    let indholdIndex = res.dataset.dimension.id.indexOf("ContentsCode")
                    let xIndex = res.dataset.dimension.id.findIndex(el => el.toLowerCase() === tableData.variables[state.xVar].id.toLowerCase())
                    let yIndex = res.dataset.dimension.id.findIndex(el => el.toLowerCase() === tableData.variables[state.yVar].id.toLowerCase())
                    //console.log("ny:", indholdIndex, xIndex, yIndex)
                    //console.log("ny:", chunkArray(res.dataset.value, res.dataset.dimension.size[xIndex])) //virker
                    let unpollinated = res.dataset.dimension.id.filter((x,i) => i !== indholdIndex && i !== xIndex && i !== yIndex).map(id => Object.entries(res.dataset.dimension[id].category.index).sort((a: any[], b: any[]) => a[1] - b[1]).map(indx => res.dataset.dimension[id].category.label[indx[0]]))
                    let pollinated = unpollinated.reduce((a, b) => a.reduce((r, v) => r.concat(b.map(w => [].concat(v, w))), [])).map(arr => typeof arr === "object" ? arr.join(" / ") : arr)
                    
                    let chartData = {
                        labels: Object.values(res.dataset.dimension[res.dataset.dimension.id[xIndex]].category.label),
                        datasets: chunkArray(res.dataset.value, res.dataset.dimension.size[xIndex]).map((dset, i) => {
                            return {
                                label: pollinated[i],
                                data: dset,
                                fill: false,
                                backgroundColor: "rgb(" + colorscheme[i % 10].join(", ") + ")",
                                borderColor: "rgb(" + colorscheme[i % 10].join(", ") + ", 0.2)",
                            }
                        }),
                    }
                    console.log(chartData);
                    setState({ ...state, chartData: chartData, dataHelpText: "Færdig. Rul op for at se grafen."});
                    
                }).catch(err => {
                    console.log(err);
                });
        } else {
            alert("Du mangler at vælge værdier for en af de to akser.")
        }
    }

    const publishPlora = () => {
        let [provider, ...table] = tableId.split("-");
        fetch("/api/create", {
            body: JSON.stringify({
                title: state.chartTitle,
                tableId: tableData.id,
                providerId: provider,
                type: state.chartType,
                data: state.chartData,
                xLabel: tableData.variables[state.xVar].text.charAt(0).toUpperCase() + tableData.variables[state.xVar].text.slice(1),
                yLabel: tableData.variables[state.yVar].values.filter(x => x.id === state.yVal)[0].text,
            }),
            headers: {
                'Content-Type': 'application/json'
              },
            method: 'POST'
        })
            .then(res => {
                if (!res.ok) {
                    throw Error(res.statusText);
                }
                return res.json();
            }).then(res => {
                //console.log(res);
                router.push("/view/" + res.id)
            }).catch(err => {
                console.log(err);
            });
    }
	
	return (
        <Container maxWidth="lg" className={styles.container}>
            { !state.chartType.length ? (
                <Box className={styles.diagramTypeWrapper}>
                    <Typography variant="h4" className={styles.diagramTypeTitle}>Vælg en diagramtype</Typography>
                    <Box className={styles.diagramTypeButtonWrapper}>
                        <Button className={styles.diagramTypeButton} onClick={() => { setState({ ...state, chartType: "line"}); }} variant="contained" color="secondary">
                            Linjediagram
                        </Button>
                        <Button disabled className={styles.diagramTypeButton} onClick={() => { setState({ ...state, chartType: "bar"}); }} variant="contained" color="secondary">
                            Lodret søjlediagram
                        </Button>
                        <Button disabled className={styles.diagramTypeButton} onClick={() => { setState({ ...state, chartType: "horizontalBar"}); }} variant="contained" color="secondary">
                            Vandret søjlediagram
                        </Button>
                    </Box>
                </Box>
            ) : (
                <React.Fragment>
                    <Card className={styles.card}>
                        <ChartComponent
                            type={state.chartType}
                            data={state.chartData}
                            options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: state.chartTitle,
                                        font: {
                                            size: 24,
                                        },
                                    },
                                },
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: !!state.xVar.length ? tableData.variables[state.xVar].text.charAt(0).toUpperCase() + tableData.variables[state.xVar].text.slice(1) : ""
                                        }
                                    },
                                    y: {
                                        title: {
                                            display: true,
                                            text: !!state.yVar.length && !!state.yVal.length ? tableData.variables[state.yVar].values.filter(x => x.id === state.yVal)[0].text : ""
                                        }
                                    },
                                },
                                elements: {
                                    point: {
                                        radius: 4,
                                        hoverRadius: 5
                                    }
                                }
                            }}
                        />
                    </Card>
                    <Paper className={styles.main}>
                        <Typography variant="h5">Indstillinger</Typography>
                        <TextField className={styles.chartTitleInput} id="chart-title" label="Titlen på din plora." value={state.chartTitle} onChange={handleChartTitleChange} />
                        <Typography variant="h4">Vælg data til x-aksen</Typography>
                        <FormControl className={styles.formControl}>
                            <InputLabel htmlFor="x-var">Variabel på x-aksen</InputLabel>
                            <Select
                                native
                                value={state.xVar}
                                onChange={handleVarChange}
                                inputProps={{
                                    name: 'xVar',
                                    id: 'x-var',
                                }}
                            >
                                <option aria-label="None" value="" />
                                {tableData.variables.map((variable, index) => state.yVar !== index + "" ? <option value={index}>{variable.text.charAt(0).toUpperCase() + variable.text.slice(1)}</option> : "")}
                            </Select>
                        </FormControl>
                        { !state.xVar.length ? "" : (
                            <React.Fragment>
                                <br /><br />
                                <Typography variant="body2">Vælg hvilke data du ønsker at medtage.</Typography>
                                <List className={styles.valList}>
                                    {tableData.variables[state.xVar].values.map((value, index) => {
                                        const labelId = `checkbox-list-label-${value.id}`;

                                        return (
                                        <ListItem key={value.id} role={undefined} dense button onClick={handleToggle(value.id, "x")}>
                                            <ListItemIcon>
                                            <Checkbox
                                                edge="start"
                                                checked={state.xVal.includes(value.id)}
                                                tabIndex={-1}
                                                disableRipple
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                            </ListItemIcon>
                                            <ListItemText id={labelId} primary={value.text} />
                                        </ListItem>
                                        );
                                    })}
                                </List>
                            </React.Fragment>
                        ) }
                        <Typography variant="h4">Vælg data til y-aksen</Typography>
                        <FormControl className={styles.formControl}>
                            <InputLabel htmlFor="y-var">Variabel på y-aksen</InputLabel>
                            <Select
                                native
                                value={state.yVar}
                                onChange={handleVarChange}
                                inputProps={{
                                    name: 'yVar',
                                    id: 'y-var',
                                }}
                            >
                                <option aria-label="None" value="" />
                                {tableData.variables.map((variable, index) => state.xVar !== index + "" ? <option value={index}>{variable.text.charAt(0).toUpperCase() + variable.text.slice(1)}</option> : "")}
                            </Select>
                        </FormControl>
                        { !state.yVar.length ? "" : (
                            <React.Fragment>
                                <br /><br />
                                <Typography variant="body2">Vælg hvilke data du ønsker at medtage.</Typography>
                                <FormControl className={styles.formControl}>
                                    <InputLabel htmlFor="y-val">Vælg 1 værdi</InputLabel>
                                    <Select
                                        native
                                        value={!!state.yVal.length ? state.yVal : ""}
                                        onChange={e => setState({...state, yVal: e.target.value + ""})}
                                        inputProps={{
                                            name: 'yVal',
                                            id: 'y-val',
                                        }}
                                    >
                                        <option aria-label="None" value="" />
                                        {tableData.variables[state.yVar].values.map((value) => <option value={value.id}>{value.text}</option>)}
                                    </Select>
                                </FormControl>
                            </React.Fragment>
                        ) }
                        { !!state.xVar.length && !!state.yVar.length && tableData.variables.length > 2 ? (
                            <React.Fragment>
                                <Typography variant="h4">Yderligere variabler</Typography>
                                <Typography variant="body2">Der kan indtil videre kun angives 1 yderligere variabel. I en senere version vil det være muligt at vælge alle tilgængelige variabler.</Typography>
                                <FormControl className={styles.formControl}>
                                    <InputLabel htmlFor="data-var">Variabel</InputLabel>
                                    <Select
                                        native
                                        value={state.dataVar}
                                        onChange={handleVarChange}
                                        inputProps={{
                                            name: 'dataVar',
                                            id: 'data-var',
                                        }}
                                    >
                                        <option aria-label="None" value="" />
                                        {tableData.variables.map((variable, index) => state.xVar !== index + "" && state.yVar !== index + "" ? <option value={index}>{variable.text.charAt(0).toUpperCase() + variable.text.slice(1)}</option> : "")}
                                    </Select>
                                </FormControl>
                                { !state.dataVar.length ? "" : (
                                    <React.Fragment>
                                        <br /><br />
                                        <Typography variant="body2">Vælg hvilke data du ønsker at medtage.</Typography>
                                        <List className={styles.valList}>
                                            {tableData.variables[state.dataVar].values.map((value, index) => {
                                                const labelId = `checkbox-list-label-${value.id}`;

                                                return (
                                                <ListItem key={value.id} role={undefined} dense button onClick={handleToggle(value.id, "data")}>
                                                    <ListItemIcon>
                                                    <Checkbox
                                                        edge="start"
                                                        checked={state.dataVal.includes(value.id)}
                                                        tabIndex={-1}
                                                        disableRipple
                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                    />
                                                    </ListItemIcon>
                                                    <ListItemText id={labelId} primary={value.text} />
                                                </ListItem>
                                                );
                                            })}
                                        </List>
                                    </React.Fragment>
                                ) }
                            </React.Fragment>
                        ) : "" }
                        { !!state.xVar.length && !!state.yVar.length ? (
                            <React.Fragment>
                                <br />
                                <br />
                                <Button className={""} onClick={getData} variant="contained" color="secondary">
                                    Hent data
                                </Button>
                                <span hidden={!state.dataHelpText.length} style={{marginLeft: 16}}>{state.dataHelpText}</span>
                            </React.Fragment>
                        ) : "" }
                        { !!Object.keys(state.chartData).length ? (
                            <React.Fragment>
                                <br />
                                <br />
                                <Typography variant="h4">Udgiv din plora, så andre kan se den</Typography>
                                <Button className={styles.releaseBtn} onClick={publishPlora} variant="contained" color="secondary">
                                    Udgiv nu
                                </Button>
                            </React.Fragment>
                        ) : "" }
                    </Paper>
                </React.Fragment>
            )}
            

        </Container>
	)	
}

export async function getServerSideProps(context) {
    let [provider, ...table] = context.params.tableId.split("-")
    table = table.join(" ")

    if (provider === "dst") {
        const res = await fetch("https://api.statbank.dk/v1/tableinfo/" + table + "?format=JSON")
        const tableData = await res.json()
    
        if (!tableData) {
            return {
                notFound: true,
            }
        }
    
        return {
            props: { tableData }, // will be passed to the page component as props
        }
    }
}