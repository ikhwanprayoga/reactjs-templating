import React, {Fragment} from 'react';
import CustomHeader from 'components/Headers/CustomHeader';
// reactstrap components
import {
    Badge,
    Card,
    CardHeader,
    CardFooter,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Media,
    Pagination,
    PaginationItem,
    PaginationLink,
    Progress,
    Table,
    Container,
    Row,
    Col,
    Modal,
    UncontrolledTooltip,
    Button,
    Form,
    FormGroup,
    Input,
    Label
  } from "reactstrap";
import Axios from 'axios';
import ReactNotification, { store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

class TemplateContoh extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            baseHost: 'http://localhost:8080',
            tambahDataModal: false,
            isUpdate: false,
            dataMahasiswa: [],
            formMahasiswa : {
                nama: '',
                nim: '',
                alamat: ''
            }
        }
    }

    render() { 
        return (
            <Fragment>
                    <ReactNotification/>
                <CustomHeader/>
                {/* page content */}
                <Container className="mt--7" fluid>
                    <Row>
                        
                    </Row>
                </Container>
            </Fragment>
        );
    }
}
 
export default TemplateContoh;