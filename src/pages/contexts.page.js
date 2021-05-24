import React from "react";
import { DataGrid } from '@material-ui/data-grid';
import {
    Box,
    Button,
    Container,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Grid,
    TextField,
    Typography
} from "@material-ui/core";
import { Visibility, Edit, AddBox, Delete } from '@material-ui/icons';
import { Link } from "react-router-dom";
import ContextService from "../services/context.service";
import RolesUtils from "../utils/roles.utils";

class ContextsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isModerator: RolesUtils.hasModeratorRole(),
            rows: [],
            addContextModal: false,
            addContextModalInputName: '',
            addContextModalInputType: '',
            selectedContext: {},
            editContextModal: false,
            editContextModalInputName: '',
            editContextModalInputType: '',
            deleteContextModal: false,
        }
    }

    componentDidMount() {
        this.loadContextsList();
    }

    async loadContextsList() {
        const contexts = await ContextService.getAll();
        this.setState({ rows: contexts });
    }

    onChangeModalField = (event) => {
        const { target: { id, value } } = event;
        this.setState({[id]: value});
    }

    toggleModalAddContext = () => {
        const { addContextModal } = this.state;

        if (addContextModal) {
            this.setState({
                addContextModal: !addContextModal,
                addContextModalInputName: '',
                addContextModalInputType: '',
            });
        } else {
            this.setState({
                addContextModal: !addContextModal,
            });
        }
    }

    insertModalAddContextFields = async () => {
        const {
            addContextModalInputName,
            addContextModalInputType,
        } = this.state;

        const data = {
            name: addContextModalInputName,
            type: addContextModalInputType,
        };

        const contextMsg = await ContextService.insert(data);
        this.toggleModalAddContext();
        this.loadContextsList();
        alert(contextMsg);
    }

    renderModalAddContext = () => {
        const { addContextModal, addContextModalInputName, addContextModalInputType } = this.state;

        return (
            <Dialog open={ addContextModal } onClose={this.toggleModalAddLineItem} aria-labelledby="form-dialog-title">
                <DialogTitle id="add-line-item-modal">
                    Cadastrar Contexto
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Preencha os campos abaixo para cadastrar um novo contexto
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="addContextModalInputName"
                        label="Name"
                        fullWidth
                        value={ addContextModalInputName }
                        onChange={this.onChangeModalField}
                    />
                    <TextField
                        margin="dense"
                        id="addContextModalInputType"
                        label="Tipo"
                        fullWidth
                        value={ addContextModalInputType }
                        onChange={this.onChangeModalField}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.toggleModalAddContext}>Cancelar</Button>
                    <Button onClick={this.insertModalAddContextFields} color="primary">Cadastrar</Button>
                </DialogActions>
            </Dialog>
        );
    }

    toggleModalEditContext = (selectedContext) => {
        const { editContextModal } = this.state;

        if (editContextModal) {
            this.setState({
                editContextModal: !editContextModal,
            });
        } else {
            const { name, type } = selectedContext;
            this.setState({
                editContextModal: !editContextModal,
                selectedContext: selectedContext,
                editContextModalInputName: name,
                editContextModalInputType: type,
            });
        }
    }

    updateModalEditContextFields = async () => {
        const {
            editContextModalInputName,
            editContextModalInputType,
            selectedContext
        } = this.state;

        const { id } = selectedContext;

        console.log('selectedContexto', selectedContext);

        const data = {
            id,
            name: editContextModalInputName,
            type: editContextModalInputType,
        };

        const contextMsg = await ContextService.update(data);
        this.toggleModalEditContext();
        this.loadContextsList();
        alert(contextMsg);
    }

    renderModalEditContext = () => {
        const { editContextModal, editContextModalInputName, editContextModalInputType, selectedContext } = this.state;
        const { name } = selectedContext;

        return (
            <Dialog open={ editContextModal } onClose={this.toggleModalEditContext} aria-labelledby="form-dialog-title">
                <DialogTitle id="edit-context-modal">
                    Editar Contexto: { name }
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Edite os dados informativos do contexto: { name }
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="editContextModalInputName"
                        label="Name"
                        fullWidth
                        value={ editContextModalInputName }
                        onChange={this.onChangeModalField}
                    />
                    <TextField
                        margin="dense"
                        id="editContextModalInputType"
                        label="Tipo"
                        fullWidth
                        value={ editContextModalInputType }
                        onChange={this.onChangeModalField}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.toggleModalEditContext}>Cancelar</Button>
                    <Button onClick={this.updateModalEditContextFields} color="primary">Editar</Button>
                </DialogActions>
            </Dialog>
        );
    }

    toggleModalDeleteContext = (selectedContext) => {
        const { deleteContextModal } = this.state;

        if (deleteContextModal) {
            this.setState({
                deleteContextModal: !deleteContextModal,
            });
        } else {
            const { name, type } = selectedContext;
            this.setState({
                deleteContextModal: !deleteContextModal,
                selectedContext: selectedContext,
            });
        }
    }

    updateModalDeleteContextFields = async () => {
        const { selectedContext: { id } } = this.state;

        const contextMsg = await ContextService.deleteById(id);
        this.toggleModalDeleteContext();
        this.loadContextsList();
        alert(contextMsg);
    }

    renderModalDeleteContext = () => {
        const { deleteContextModal, selectedContext } = this.state;
        const { name } = selectedContext;

        return (
            <Dialog
                open={deleteContextModal}
                onClose={this.toggleModalDeleteContext}
                aria-labelledby="delete-context-modal"
                aria-describedby="delete-context-modal"
            >
                <DialogTitle id="delete-context-modal-title">Tem certeza que deseja remover: { name }?</DialogTitle>
                <DialogActions>
                    <Button onClick={this.toggleModalDeleteContext} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={this.updateModalDeleteContextFields} color="primary" autoFocus>
                        Deletar
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    render() {
        const { rows, isModerator } = this.state;

        const columns = [
            { field: 'name', headerName: 'Nome', width: 230 },
            { field: 'type', headerName: 'Tipo', width: 130 },
            { field: 'qtdUsers', headerName: 'Usuários', width: 120 },
            { field: 'qtdLineItems', headerName: 'Atividades', width: 120 },
            {
                field: '',
                headerName: 'Ações',
                width: 230,
                disableClickEventBubbling: true,
                renderCell: (params) => {
                    const { id, row } = params;
                    return (
                        <>
                            <Button component={ Link } to={`/context/${id}`}><Visibility /></Button>
                            { isModerator && <Button onClick={() => this.toggleModalEditContext(row)}><Edit /></Button> }
                            { isModerator && <Button onClick={() => this.toggleModalDeleteContext(row)}><Delete /></Button> }
                        </>
                    )
                },
            },
        ];

        return (
            <Container style={{height: 400}}>
                <Grid style={{marginTop: 20, marginBottom: 20}} container spacing={3}>
                    <Grid item xs={6}>
                        <Typography variant="h2">Cursos</Typography>
                    </Grid>
                    {
                        isModerator &&
                            <Grid item xs={6}>
                                <Button onClick={this.toggleModalAddContext}>
                                    <AddBox />
                                </Button>
                            </Grid>
                    }
                </Grid>
                <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
                { this.renderModalAddContext() }
                { this.renderModalEditContext() }
                { this.renderModalDeleteContext() }
            </Container>
        );
    }
}

export default ContextsPage;
