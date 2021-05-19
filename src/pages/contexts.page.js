import React from "react";
import { DataGrid } from '@material-ui/data-grid';
import { Container, Typography } from "@material-ui/core";
import { Visibility, Edit } from '@material-ui/icons';
import { Link } from "react-router-dom";
import ContextService from "../services/context.service";

class ContextsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: [],
        }
    }

    async componentDidMount() {
        const contexts = await ContextService.getAll();
        this.setState({ rows: contexts });
    }

    render() {
        const { rows } = this.state;

        const columns = [
            { field: 'name', headerName: 'Nome', width: 230 },
            { field: 'type', headerName: 'Tipo', width: 130 },
            { field: 'qtdUsers', headerName: 'Usuários', width: 120 },
            { field: 'qtdLineItems', headerName: 'Atividades', width: 120 },
            {
                field: '',
                headerName: 'Ações',
                disableClickEventBubbling: true,
                renderCell: (params) => {
                    const { id } = params;
                    return <Link to={`/context/${id}`}><Visibility /></Link>
                }
            },
        ];

        return (
            <Container style={{height: 400}}>
                <Typography variant="h2">Contextos</Typography>
                <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
            </Container>
        );
    }
}

export default ContextsPage;
