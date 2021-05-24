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
import { Visibility, Edit, AddBox, Delete } from "@material-ui/icons";
import { Link } from "react-router-dom";
import ContextService from "../services/context.service";
import LineItemsService from "../services/lineItems.service";
import AnswersService from "../services/answers.service";
import RolesUtils from "../utils/roles.utils";
import StorageUtils from "../utils/storage.utils";

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

class LineItemPage extends React.Component {

    constructor(props) {
        super(props);

        const { match: { params: { id } } } = props;

        this.state = {
            id,
            context: undefined,
            lineItem: undefined,
            tabSelected: 0,
            selectedAnswer: {},
            answerModal: false,
            answerModalInputFeedback: '',
            answerModalInputGrade: '',
            addAnswerModal: false,
            addAnswerModalInputFile: '',
            deleteLineItemModal: false,
        }
    }

    componentDidMount() {
        this.loadLineItemData();
    }

    loadLineItemData = async () => {
        const { id } = this.state;
        const lineItem = await LineItemsService.getById(id);
        const contextId = StorageUtils.getCurrentContextId();
        const context = await ContextService.getById(contextId);
        this.setState({ lineItem, context });
    }

    isContextInstructor = () => {
        const { context } = this.state;
        return RolesUtils.isContextInstructor(context);
    }

    getCurrentLearnerAnswer = () => {
        const { lineItem: { answers } } = this.state;
        const userData = StorageUtils.getUserData();
        return answers.find(answers => answers.learner._id === userData.id);
    }

    renderLearnerAnswer = () => {
        const answer = this.getCurrentLearnerAnswer();

        if (answer) {
            const { file, grade, feedback } = answer;

            return (
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography><b>Arquivo enviado:</b> { file }</Typography>
                        <Typography><b>Nota:</b> { grade ? grade : 'Sem nota' }</Typography>
                        <Typography><b>Feedback:</b> { feedback ? feedback : 'Sem feedback' }</Typography>
                    </Grid>
                </Grid>
            )
        }

        return (
            <Typography>Nenhuma resposta enviada</Typography>
        );
    }

    openAnswerFile = (url) => {
        window.open(url, '_blank');
    }

    renderAnswersTable = () => {
        const { lineItem } = this.state;
        const { answers } = lineItem;

        const columns = [
            { field: 'learner', headerName: 'Estudante', width: 230 },
            { field: 'grade', headerName: 'Nota', width: 100 },
            { field: 'feedback', headerName: 'Feedback', width: 150 },
            {
                field: "file",
                headerName: "Arquivo",
                width: 150,
                disableClickEventBubbling: true,
                renderCell: (params) => {
                    const { formattedValue } = params;
                    return <Button onClick={() => this.openAnswerFile(formattedValue)}><Visibility /></Button>;
                }
            },
            {
                field: "",
                headerName: "Ações",
                width: 150,
                disableClickEventBubbling: true,
                renderCell: (params) => {
                    const { row } = params;
                    return (
                        <>
                            <Button onClick={() => this.toggleModalEditAnswer(row)}><Edit /></Button>
                        </>
                    );
                }
            },
        ];

        const rows = answers.map(lineItem => {
            const { _id, file, feedback, grade, learner, instructor } = lineItem;
            return {
                id: _id,
                file,
                feedback,
                grade: grade ? grade : 'Sem nota',
                learner: learner.name,
                instructor,
            }
        });

        return (
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={rows} columns={columns} pageSize={10} />
            </div>
        );
    }

    renderAnswers = () => {
        const isContextInstructor = this.isContextInstructor();
        const hasCurrentLearnerAnswer = this.getCurrentLearnerAnswer();

        return (
            <Grid style={{marginTop: 20, marginBottom: 20}} container spacing={3}>
                <Grid item xs={6}>
                    <Typography style={{marginBottom: 10}} variant={"h6"}>
                        <Box fontWeight="fontWeightMedium">
                            RESPOSTAS
                        </Box>
                    </Typography>
                </Grid>
                {
                    !isContextInstructor &&
                        <>
                            {
                                !hasCurrentLearnerAnswer &&
                                    <Grid item xs={6}>
                                        <Button onClick={this.toggleModalAddAnswer}>
                                            <AddBox />
                                        </Button>
                                    </Grid>
                            }
                            <Grid item xs={12}>
                                { this.renderLearnerAnswer() }
                            </Grid>
                        </>
                }
                {
                    isContextInstructor &&
                        <Grid item xs={12}>
                            { this.renderAnswersTable() }
                        </Grid>
                }
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

    toggleModalEditAnswer = (selectedAnswer) => {
        const { answerModal } = this.state;

        if (answerModal) {
            this.setState({
                answerModal: !answerModal,
            });
        } else {
            const { feedback, grade } = selectedAnswer;
            this.setState({
                answerModal: !answerModal,
                selectedAnswer: selectedAnswer,
                answerModalInputFeedback: feedback,
                answerModalInputGrade: grade,
            });
        }
    }

    updateModalAnswerFields = async () => {
        const {
            selectedAnswer,
            answerModalInputFeedback,
            answerModalInputGrade
        } = this.state;

        const { id } = selectedAnswer;

        const data = {
            id,
            feedback: answerModalInputFeedback,
            grade: answerModalInputGrade,
        }

        const answerMsg = await AnswersService.update(data);
        this.toggleModalEditAnswer(selectedAnswer);
        this.loadLineItemData();
        alert(answerMsg);
    }

    renderModalEditAnswer = () => {
        const { answerModal, selectedAnswer, answerModalInputFeedback, answerModalInputGrade } = this.state;

        return (
            <Dialog open={ answerModal } onClose={this.toggleModalEditLineItem} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    Editar
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Edite os dados da resposta da atividade
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="answerModalInputFeedback"
                        label="Feedback"
                        fullWidth
                        value={ answerModalInputFeedback }
                        onChange={this.onChangeModalField}
                    />
                    <TextField
                        margin="dense"
                        id="answerModalInputGrade"
                        label="Nota"
                        fullWidth
                        value={ answerModalInputGrade }
                        onChange={this.onChangeModalField}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.toggleModalEditAnswer}>Cancelar</Button>
                    <Button onClick={this.updateModalAnswerFields} color="primary">Editar</Button>
                </DialogActions>
            </Dialog>
        );
    }

    toggleModalAddAnswer = () => {
        const { addAnswerModal } = this.state;

        if (addAnswerModal) {
            this.setState({
                addAnswerModal: !addAnswerModal,
                answerModalInputFile: '',
            });
        } else {
            this.setState({
                addAnswerModal: !addAnswerModal,
            });
        }
    }

    updateModalAddAnswerFields = async () => {
        const {
            id,
            addAnswerModalInputFile,
        } = this.state;

        const userData = StorageUtils.getUserData();

        const data = {
            lineItemId: id,
            file: addAnswerModalInputFile,
            learner: userData.id,
        }

        const answerMsg = await AnswersService.insert(data);
        this.toggleModalAddAnswer();
        this.loadLineItemData();
        alert(answerMsg);
    }

    renderModalAddAnswer = () => {
        const { addAnswerModal, addAnswerModalInputFile } = this.state;

        return (
            <Dialog open={ addAnswerModal } onClose={this.toggleModalAddAnswer} aria-labelledby="form-dialog-title">
                <DialogTitle id="add-answer-modal">
                    Cadastrar Resposta
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Preencha o campo abaixo para cadastrar uma nova resposta
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="addAnswerModalInputFile"
                        label="Arquivo"
                        fullWidth
                        value={ addAnswerModalInputFile }
                        onChange={this.onChangeModalField}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.toggleModalAddAnswer}>Cancelar</Button>
                    <Button onClick={this.updateModalAddAnswerFields} color="primary">Cadastrar</Button>
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
        alert(lineItemMsg);
    }

    renderModalDeleteLineItem = () => {
        const { deleteLineItemModal, selectedAnswer } = this.state;
        const { title } = selectedAnswer;

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

    // renderTabsData = () => {
    //     const { context, tabSelected } = this.state;
    //     const { name, type, users } = context;
    //
    //     return (
    //         <Paper>
    //             <Tabs value={tabSelected} onChange={this.handleTabChange} aria-label="simple tabs example">
    //                 <Tab label="DADOS" />
    //                 <Tab label="USUÁRIOS" />
    //             </Tabs>
    //             <TabPanel value={tabSelected} index={0}>
    //                 <Grid spacing={3}>
    //                     <Grid item xs={12}>
    //                         <Typography>Nome: { name }</Typography>
    //                         <Typography>Tipo: { type }</Typography>
    //                     </Grid>
    //                 </Grid>
    //             </TabPanel>
    //             <TabPanel value={tabSelected} index={1}>
    //                 <Grid container spacing={3}>
    //                     <Grid item xs={12}>
    //                         <ul>
    //                             { users.map(item => (<li key={item.user._id}><Typography>{item.user.name}</Typography></li>)) }
    //                         </ul>
    //                     </Grid>
    //                 </Grid>
    //             </TabPanel>
    //         </Paper>
    //     )
    // }

    render() {
        const { lineItem } = this.state;

        if (!lineItem) return null;

        return (
            <Container>
                <Typography variant="h2">Atividade</Typography>

                {/*{ this.renderTabsData() }*/}
                { this.renderAnswers() }

                { this.renderModalAddAnswer() }
                { this.renderModalEditAnswer() }
                { this.renderModalDeleteLineItem() }
            </Container>
        );
    }
}

export default LineItemPage;
