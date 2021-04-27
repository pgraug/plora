import React from 'react';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import Link from 'next/link';

interface HandleSelectedInterface extends React.ChangeEvent<{}> {
    target: HTMLDivElement;
}

function renderTree(data, index?, array?) : any {
    //console.log("data: ", Array.isArray(data))
    if (Array.isArray(data)) {
        if (!data.length) {
            // Array is empty.
            return ""
        } else {
            // Array is not empty. Itterate tree
            return data.map(renderTree)
        }
    } else {
        // print element
        if (data.hasOwnProperty("description")) {
            // subject
            return (
                <TreeItem className={"treePicker-subject"} nodeId={data.id} label={data.description}>
                    {renderTree(data.subjects)}
                    {renderTree(data.tables)}
                </TreeItem>
            )
        } else {
            // table
            return (<TreeItem className={"treePicker-table"} nodeId={data.id} label={data.text + " efter " + data.variables.slice(0, -1).join(', ')+' og '+data.variables.slice(-1) + " (" + data.firstPeriod + "-" + data.latestPeriod + ")"} />)
        }
    }
}

export default function TreePicker({children, provider}) {
    const [state, setState] = React.useState({
        open: false,
        selected: "",
        selectedLabel: "",
    });

    const handleSelect = (event: HandleSelectedInterface, nodeId: string) => {
        if (event.target.parentElement.parentElement.classList.contains("treePicker-table")) {
            if (nodeId !== state.selected) {
                setState({ ...state, open: true, selected: nodeId, selectedLabel: event.target.innerText });
            } else {
                setState({ ...state, open: false, selected: ""});
            }
            
        }
    };

    return (
        <React.Fragment>
            <TreeView
                className={"treePicker"}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                selected={state.selected ? state.selected : ""}
                onNodeSelect={handleSelect}
            >
                {renderTree(children)}
            </TreeView>
            <Snackbar
                message={'Du har valgt tabellen "' + ((state.selectedLabel.length > 38) ? (state.selectedLabel.slice(0,37) + '..."') : (state.selectedLabel + '"'))}
                action={(
                    <Link
                        href={"/finalize/" + provider + "-" + state.selected.toLowerCase()}
                        passHref>
                        <Button variant="contained" color="secondary" size="small">
                            Benyt denne tabel
                        </Button>
                    </Link>
                )}
                open={state.open}
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
            />
        </React.Fragment>
    );
}