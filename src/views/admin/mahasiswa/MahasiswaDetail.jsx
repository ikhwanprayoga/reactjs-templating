import React, {Fragment} from 'react';
import CustomHeader from 'components/Headers/CustomHeader';
// reactstrap components
import {
    Card,
    CardHeader,
    Container,
    Row,
    Col,
    CardBody,
    Button,
  } from "reactstrap";
import Axios from 'axios';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import './MahasiswaStyle.css'

class MahasiswaDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            baseHost: 'http://localhost:8080',
            tambahDataModal: false,
            foto: '',
            dataMahasiswa: [],
            formMahasiswa : {
                nama: '',
                nim: '',
                alamat: ''
            }
        }
    }

    componentDidMount () {
        // console.log(this.props.match.params.id)
        const id = this.props.match.params.id
        Axios.get(this.state.baseHost+'/api/mahasiswa/'+id).then((res)=>{
            // console.log(res)
            this.setState({
                dataMahasiswa: res.data,
                foto: this.state.baseHost+'/mahasiswa/'+res.data.foto
            })
        })
    }

    render() { 
        return (
            <Fragment>
                    <ReactNotification/>
                <CustomHeader/>
                {/* page content */}
                <Container className="mt--7" fluid>
                    <Row>
                        <Col className="order-xl-2 mb-6 mb-xl-0" xl="6">
                        <Card className="card-profile shadow">
                            <Row className="justify-content-center">
                                <Col className="order-lg-2" lg="3">
                                    <div className="card-profile-image">
                                    <a href="#pablo" onClick={e => e.preventDefault()}>
                                        <img
                                        alt="..."
                                        className="rounded-circle"
                                        // src={require("assets/img/theme/team-4-800x800.jpg")}
                                        src={this.state.foto}
                                        />
                                    </a>
                                    </div>
                                </Col>
                            </Row>
                            <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                            {/* <div className="d-flex justify-content-between">
                                <Button
                                className="mr-4"
                                color="info"
                                href="#pablo"
                                onClick={e => e.preventDefault()}
                                size="sm"
                                >
                                Connect
                                </Button>
                                <Button
                                className="float-right"
                                color="default"
                                href="#pablo"
                                onClick={e => e.preventDefault()}
                                size="sm"
                                >
                                Message
                                </Button>
                            </div> */}
                            </CardHeader>
                            <CardBody className="pt-0 pt-md-4" style={{marginTop:"15%"}}>
                            <div className="text-center">
                                <h3>
                                    {this.state.dataMahasiswa.nama}
                                </h3>
                                <div className="h5 font-weight-300">
                                <i className="ni location_pin mr-2" />
                                    {this.state.dataMahasiswa.nim}
                                </div>
                                <div className="h5 mt-4">
                                <i className="ni business_briefcase-24 mr-2" />
                                    {this.state.dataMahasiswa.alamat}
                                </div>
                                <div>
                                <i className="ni education_hat mr-2" />
                                    Universitas Tanjungpura
                                </div>
                                <hr className="my-4" />
                                <p>
                                    Ryan — the name taken by Melbourne-raised, Brooklyn-based
                                    Nick Murphy — writes, performs and records all of his own
                                    music.
                                </p>
                            </div>
                            </CardBody>
                        </Card>
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        );
    }
}
 
export default MahasiswaDetail;