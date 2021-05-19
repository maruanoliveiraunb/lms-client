import React from "react";
import {
    Container,
    Typography,
    Grid,
    Paper,
    Box,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,
    TextField,
    Button,
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { Visibility, Edit, AddBox } from "@material-ui/icons";
import { Link } from "react-router-dom";
import ContextService from "../services/context.service";
import LineItemsService from "../services/lineItems.service";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

class ContextPage extends React.Component {

    constructor(props) {
        super(props);

        const { match: { params: { id } } } = props;

        this.state = {
            id,
            context: undefined,
            tabSelected: 0,
            selectedLineItem: {},
            lineItemModal: false,
            lineItemModalInputTitle: '',
            lineItemModalInputDescription: '',
            addLineItemModal: false,
            addLineItemModalInputTitle: '',
            addLineItemModalInputDescription: '',
        }
    }

    componentDidMount() {
        this.loadContextData();
    }

    loadContextData = async () => {
        const { id } = this.state;
        const context = await ContextService.getById(id);
        this.setState({ context });
    }

    renderLineItemsTable = () => {
        const { context } = this.state;
        const { lineItems } = context;

        const columns = [
            { field: 'title', headerName: 'Título', width: 230 },
            { field: 'description', headerName: 'Descrição', width: 230 },
            {
                field: "",
                headerName: "Ações",
                disableClickEventBubbling: true,
                renderCell: (params) => {
                    const { row } = params;
                    return <Button onClick={() => this.toggleModalEditLineItem(row)}>
                        <Edit />
                    </Button>
                }
            },
        ];

        const rows = lineItems.map(lineItem => {
            const { _id, title, description } = lineItem;
            return {
                id: _id,
                title,
                description
            }
        });

        return (
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={rows} columns={columns} pageSize={10} />
            </div>
        );
    }

    renderLineItems = () => {

        return (
            <Grid style={{marginTop: 20, marginBottom: 20}} container spacing={3}>
                <Grid item xs={6}>
                    <Typography style={{marginBottom: 10}} variant={"h6"}>
                        <Box fontWeight="fontWeightMedium">
                            ATIVIDADES
                        </Box>
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Button onClick={this.toggleModalAddLineItem}>
                        <AddBox />
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    { this.renderLineItemsTable() }
                </Grid>
            </Grid>
        )
    }

    handleTabChange = (event, tabSelected) => {
        this.setState({ tabSelected });
    }

    onChangeModalField = (event) => {
        const { target: { id, value } } = event;
        this.setState({[id]: value});
    }

    toggleModalEditLineItem = (selectedLineItem) => {
        const { lineItemModal } = this.state;

        if (lineItemModal) {
            this.setState({
                lineItemModal: !lineItemModal,
            });
        } else {
            const { title, description } = selectedLineItem;
            this.setState({
                lineItemModal: !lineItemModal,
                selectedLineItem: selectedLineItem,
                lineItemModalInputTitle: title,
                lineItemModalInputDescription: description,
            });
        }
    }

    updateModalLineItemFields = async () => {
        const {
            selectedLineItem,
            lineItemModalInputTitle,
            lineItemModalInputDescription
        } = this.state;

        const { id } = selectedLineItem;

        const data = {
            id,
            title: lineItemModalInputTitle,
            description: lineItemModalInputDescription,
        }

        const lineItemMsg = await LineItemsService.update(data);
        this.toggleModalEditLineItem(selectedLineItem);
        this.loadContextData();
        alert(lineItemMsg);
    }

    renderModalEditLineItem = () => {
        const { lineItemModal, selectedLineItem, lineItemModalInputTitle, lineItemModalInputDescription } = this.state;
        const { title } = selectedLineItem;

        return (
            <Dialog open={ lineItemModal } onClose={this.toggleModalEditLineItem} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    Editar: { title }
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Edite os dados informativos da atividade: { title }
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="lineItemModalInputTitle"
                        label="Título"
                        fullWidth
                        value={ lineItemModalInputTitle }
                        onChange={this.onChangeModalField}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="lineItemModalInputDescription"
                        label="Descrição"
                        fullWidth
                        value={ lineItemModalInputDescription }
                        onChange={this.onChangeModalField}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.toggleModalEditLineItem}>Cancelar</Button>
                    <Button onClick={this.updateModalLineItemFields} color="primary">Editar</Button>
                </DialogActions>
            </Dialog>
        );
    }

    toggleModalAddLineItem = () => {
        const { addLineItemModal } = this.state;

        if (addLineItemModal) {
            this.setState({
                addLineItemModal: !addLineItemModal,
                lineItemModalInputTitle: '',
                lineItemModalInputDescription: '',
            });
        } else {
            this.setState({
                addLineItemModal: !addLineItemModal,
            });
        }
    }

    updateModalAddLineItemFields = async () => {
        const {
            id,
            addLineItemModalInputTitle,
            addLineItemModalInputDescription
        } = this.state;

        const data = {
            contextId: id,
            title: addLineItemModalInputTitle,
            description: addLineItemModalInputDescription,
        }

        const lineItemMsg = await LineItemsService.insert(data);
        this.toggleModalAddLineItem();
        this.loadContextData();
        alert(lineItemMsg);
    }

    renderModalAddLineItem = () => {
        const { addLineItemModal, addLineItemModalInputTitle, addLineItemModalInputDescription } = this.state;

        return (
            <Dialog open={ addLineItemModal } onClose={this.toggleModalAddLineItem} aria-labelledby="form-dialog-title">
                <DialogTitle id="add-line-item-modal">
                    Cadastrar Atividade
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Preencha os campos abaixo para cadastrar uma nova atividade
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="addLineItemModalInputTitle"
                        label="Título"
                        fullWidth
                        value={ addLineItemModalInputTitle }
                        onChange={this.onChangeModalField}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="addLineItemModalInputDescription"
                        label="Descrição"
                        fullWidth
                        value={ addLineItemModalInputDescription }
                        onChange={this.onChangeModalField}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.toggleModalAddLineItem}>Cancelar</Button>
                    <Button onClick={this.updateModalAddLineItemFields} color="primary">Cadastrar</Button>
                </DialogActions>
            </Dialog>
        );
    }

    renderTabsData = () => {
        const { context, tabSelected } = this.state;
        const { name, type, users } = context;

        return (
            <Paper>
                <Tabs value={tabSelected} onChange={this.handleTabChange} aria-label="simple tabs example">
                    <Tab label="DADOS" />
                    <Tab label="USUÁRIOS" />
                </Tabs>
                <TabPanel value={tabSelected} index={0}>
                    <Grid spacing={3}>
                        <Grid item xs={12}>
                            <Typography>Nome: { name }</Typography>
                            <Typography>Tipo: { type }</Typography>
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={tabSelected} index={1}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <ul>
                                { users.map(item => (<li key={item.user._id}><Typography>{item.user.name}</Typography></li>)) }
                            </ul>
                        </Grid>
                    </Grid>
                </TabPanel>
            </Paper>
        )
    }

    render() {
        const { context } = this.state;

        if (!context) return null;

        return (
            <Container>
                <Typography variant="h2">
                    Context
                </Typography>

                { this.renderTabsData() }
                { this.renderLineItems() }
                { this.renderModalAddLineItem() }
                { this.renderModalEditLineItem() }
            </Container>
        );
    }
}

export default ContextPage;
