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
    Select,
    MenuItem,
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { Visibility, Edit, AddBox, Delete } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { Line } from 'react-chartjs-2';
import TabPanel from "../components/tabpanel.component";
import Alert from "../components/alert.component";
import ContextService from "../services/context.service";
import LineItemsService from "../services/lineItems.service";
import RolesUtils from "../utils/roles.utils";
import StorageUtils from "../utils/storage.utils";
import RolesConstants from "../constants/roles.constants";

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
            deleteLineItemModal: false,
            selectGradeHistoryInputUser: '',
            alertProps: {
                open: false,
                msg: '',
                onClose: this.onCloseAlert,
                severity: 'success'
            }
        }
    }

    componentDidMount() {
        this.loadContextData();
    }

    loadContextData = async () => {
        const { id } = this.state;
        const context = await ContextService.getById(id);
        StorageUtils.setCurrentContextId(id);
        this.setState({ context });
    }

    openAlert = (msg, severity) => {
        const { alertProps } = this.state;
        const tempAlertProps = Object.assign({}, alertProps);
        tempAlertProps.msg = msg;
        tempAlertProps.severity = severity;
        tempAlertProps.open = true;
        this.setState({ alertProps: tempAlertProps });
    }

    onCloseAlert = () => {
        const { alertProps } = this.state;
        const tempAlertProps = Object.assign({}, alertProps);
        tempAlertProps.open = false;
        this.setState({ alertProps: tempAlertProps });
    }

    isContextInstructor = () => {
        const { context } = this.state;
        return RolesUtils.isContextInstructor(context);
    }

    renderLineItemsTable = () => {
        const { context } = this.state;
        const { lineItems } = context;

        const isContextInstructor = this.isContextInstructor();

        const columns = [
            { field: 'title', headerName: 'T??tulo', width: 230 },
            { field: 'description', headerName: 'Descri????o', width: 230 },
            {
                field: "",
                headerName: "A????es",
                width: 230,
                disableClickEventBubbling: true,
                renderCell: (params) => {
                    const { id, row } = params;
                    return (
                        <div>
                            <Button component={ Link } to={`/lineitem/${id}`}><Visibility /></Button>
                            { isContextInstructor && <Button onClick={() => this.toggleModalEditLineItem(row)}><Edit /></Button> }
                            { isContextInstructor && <Button onClick={() => this.toggleModalDeleteLineItem(row)}><Delete /></Button> }
                        </div>
                    );
                },
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
        const isSubscribed = this.isSubscribed();

        if (!isSubscribed) return null;

        const isContextInstructor = this.isContextInstructor();

        return (
            <Grid style={{marginTop: 20, marginBottom: 20}} container spacing={3}>
                <Grid item xs={6}>
                    <Typography style={{marginBottom: 10}} variant={"h6"}>
                        <Box fontWeight="fontWeightMedium">
                            ATIVIDADES
                        </Box>
                    </Typography>
                </Grid>
                {
                    isContextInstructor &&
                        <Grid item xs={6}>
                            <Button onClick={this.toggleModalAddLineItem}>
                                <AddBox />
                            </Button>
                        </Grid>
                }
                <Grid item xs={12}>
                    { this.renderLineItemsTable() }
                </Grid>
            </Grid>
        )
    }

    onChangeGradeSelectField = (event) => {
        const { target: { value } } = event;
        this.setState({ selectGradeHistoryInputUser: value })
    }

    renderGradesHistory = () => {
        const isSubscribed = this.isSubscribed();

        if (!isSubscribed) return null;

        const { context: { lineItems, users }, selectGradeHistoryInputUser } = this.state;

        const isContextInstructor = this.isContextInstructor();
        const userData = StorageUtils.getUserData();

        const userToShowGradeHistory = isContextInstructor ? selectGradeHistoryInputUser : userData.id;

        const labelsLineItemList = lineItems.map(lineItem => lineItem.title);
        const usersSelectList = users.filter(user => user.role === RolesConstants.LEARNER);

        const gradeDataList = lineItems.map(lineItem => {
            const { answers } = lineItem;
            const answer = answers.find(answer => answer.learner === userToShowGradeHistory);
            if (answer && answer.grade) {
                return answer.grade;
            }
            return 0;
        });

        const averageGradeList = gradeDataList.map((grade, index) => {
            const tempGradeList = gradeDataList.filter((grade, tempIndex) => tempIndex <= index);
            const sum = tempGradeList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            return sum / tempGradeList.length;
        });

        const minimumGradeList = labelsLineItemList.map(lineItem => 5);

        const data = {
            labels: labelsLineItemList,
            datasets: [
                {
                    label: 'Nota',
                    data: gradeDataList,
                    fill: false,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgba(255, 99, 132, 0.2)',
                    yAxisID: 'y-Axis-id',
                },
                {
                    label: 'M??nimo',
                    data: minimumGradeList,
                    fill: false,
                    backgroundColor: 'rgb(0, 0, 0)',
                    borderColor: 'rgba(0, 0, 0, 0.2)',
                    yAxisID: 'y-Axis-id',
                },
                {
                    label: 'M??dia',
                    data: averageGradeList,
                    fill: true,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 0.2)',
                    yAxisID: 'y-Axis-id',
                },
            ],
        };

        const options = {
            scales: {
                yAxes: [
                    {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        id: 'y-Axis-id',
                        ticks: {
                            min: 0,
                            steps: 1,
                            beginAtZero: true,
                            max: 10,
                        }
                    }
                ]
            },
        };

        return (
            <Grid container style={{marginTop: 30}}>
                <Grid item xs={6}>
                    <Typography style={{marginBottom: 10}} variant={"h6"}>
                        <Box fontWeight="fontWeightMedium">
                            HIST??RICO DE NOTAS
                        </Box>
                    </Typography>
                </Grid>
                {
                    isContextInstructor &&
                        <Grid item xs={6}>
                            <Select
                                labelId="demo-simple-select-label"
                                id="selectGradeHistoryInputUser"
                                value={selectGradeHistoryInputUser}
                                onChange={this.onChangeGradeSelectField}
                            >
                                {
                                    usersSelectList.map(item => <MenuItem value={item.user._id}>{item.user.name}</MenuItem>)
                                }
                            </Select>
                        </Grid>
                }
                <Grid item xs={12}>
                    <Line data={data} options={options} />
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
        this.openAlert(lineItemMsg, 'success');
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
                        label="T??tulo"
                        fullWidth
                        value={ lineItemModalInputTitle }
                        onChange={this.onChangeModalField}
                    />
                    <TextField
                        margin="dense"
                        id="lineItemModalInputDescription"
                        label="Descri????o"
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
        this.openAlert(lineItemMsg, 'success');
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
                        label="T??tulo"
                        fullWidth
                        value={ addLineItemModalInputTitle }
                        onChange={this.onChangeModalField}
                    />
                    <TextField
                        margin="dense"
                        id="addLineItemModalInputDescription"
                        label="Descri????o"
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

    toggleModalDeleteLineItem = (selectedLineItem) => {
        const { deleteLineItemModal } = this.state;

        if (deleteLineItemModal) {
            this.setState({
                deleteLineItemModal: !deleteLineItemModal,
            });
        } else {
            this.setState({
                deleteLineItemModal: !deleteLineItemModal,
                selectedLineItem: selectedLineItem,
            });
        }
    }

    updateModalDeleteLineItemFields = async () => {
        const { selectedLineItem: { id } } = this.state;

        const lineItemMsg = await LineItemsService.deleteById(id);
        this.toggleModalDeleteLineItem();
        this.loadContextData();
        this.openAlert(lineItemMsg, 'success');
    }

    renderModalDeleteLineItem = () => {
        const { deleteLineItemModal, selectedLineItem } = this.state;
        const { title } = selectedLineItem;

        return (
            <Dialog
                open={deleteLineItemModal}
                onClose={this.toggleModalDeleteLineItem}
                aria-labelledby="delete-context-modal"
                aria-describedby="delete-context-modal"
            >
                <DialogTitle id="delete-context-modal-title">Tem certeza que deseja remover: { title }?</DialogTitle>
                <DialogActions>
                    <Button onClick={this.toggleModalDeleteLineItem} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={this.updateModalDeleteLineItemFields} color="primary" autoFocus>
                        Deletar
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    renderTabsData = () => {
        const { context, tabSelected } = this.state;
        const { name, type, users } = context;

        return (
            <Paper>
                <Tabs value={tabSelected} onChange={this.handleTabChange} aria-label="simple tabs example">
                    <Tab label="DADOS" />
                    <Tab label="USU??RIOS" />
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
                                { users && users.map(item => (<li key={item.user._id}><Typography>{item.user.name} ({item.role})</Typography></li>)) }
                            </ul>
                        </Grid>
                    </Grid>
                </TabPanel>
            </Paper>
        )
    }

    subscribeContext = async () => {
        const { id: contextId } = this.state;
        const userData = StorageUtils.getUserData();
        const { id: userId } = userData;

        const data = { contextId, userId };

        const hasInstructorPermission = RolesUtils.hasModeratorRole();

        if (hasInstructorPermission) {
            const userMsg = await ContextService.updateInstructorUsers(data);
            this.openAlert(userMsg, 'success');
        } else {
            const userMsg = await ContextService.updateUsers(data);
            this.openAlert(userMsg, 'success');
        }
        this.loadContextData();
    }

    isSubscribed = () => {
        const userData = StorageUtils.getUserData();
        const { context: { users } } = this.state;

        const index = users.findIndex(item => item.user._id === userData.id);
        return index !== -1;
    }

    renderHeaderPage() {
        const isSubscribed = this.isSubscribed();

        return (
            <Grid container>
                <Grid item xs={6}>
                    <Typography variant="h2">Curso</Typography>
                </Grid>
                {
                    !isSubscribed &&
                        <Grid item xs={6}>
                            <Button onClick={this.subscribeContext}>Inscrever-se</Button>
                        </Grid>
                }
            </Grid>
        )
    }

    render() {
        const { context, alertProps } = this.state;

        if (!context) return null;

        return (
            <Container>
                { this.renderHeaderPage() }

                { this.renderTabsData() }
                { this.renderLineItems() }
                { this.renderGradesHistory() }

                { this.renderModalAddLineItem() }
                { this.renderModalEditLineItem() }
                { this.renderModalDeleteLineItem() }

                <Alert { ...alertProps } />
            </Container>
        );
    }
}

export default ContextPage;
