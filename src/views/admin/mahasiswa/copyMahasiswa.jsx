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

class Mahasiswa extends React.Component {
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

    setDafaultFormMahasiswa = () => {
        this.setState({
            formMahasiswa : {
                nama: '',
                nim: '',
                alamat: ''
            },
            tambahDataModal: false
        })
    }

    //get data mahasiswa from api
    getDataApi = () => {
        Axios.get(this.state.baseHost+'/api/mahasiswa').then((res) => {
            // console.log(res)
            this.setState({
                dataMahasiswa: res.data
            })
        })
    }

    //post data mahasiswa to api
    postDataApi = () => {
        Axios.post(this.state.baseHost+'/api/mahasiswa/store', this.state.formMahasiswa).then((res) => {
            console.log(res)
            this.getDataApi()
            this.setDafaultFormMahasiswa()
            this.notification({
                title: 'Succes!',
                message: 'Data berhasil ditambahkan',
                type: 'success'
            })
        })
    }

    //update data mahasiswa to api
    updateDataApi = () => {
        let data = this.state.formMahasiswa
        Axios.put(this.state.baseHost+'/api/mahasiswa/update/'+data.id, data).then((res)=>{
            console.log(res)
            this.getDataApi()
            this.setDafaultFormMahasiswa()
            this.notification({
                title: 'Succes!',
                message: 'Data berhasil diubah',
                type: 'success'
            })
        })
    }

    //delete data mahasista to api
    deleteDataApi = (id) => {
        Axios.delete(this.state.baseHost+'/api/mahasiswa/delete/'+id).then((res)=>{
            console.log(res)
            this.getDataApi()
            this.notification({
                title: 'Succes!',
                message: 'Data berhasil dihapus',
                type: 'success'
            })
        })
    }

    handleTombolTambah = () => {
        // console.log('tombol tambah')
        this.toggleModal("tambahDataModal")
    }

    handleTombolSimpan = () => {
        console.log('simpan')
        if (this.state.isUpdate) {
            this.updateDataApi()
        } else {
            this.postDataApi()
        }
    }

    handleUpdate = (data) => {
        // console.log(data)
        this.setState({
            formMahasiswa:data,
            isUpdate: true
        })
        this.toggleModal("tambahDataModal")
    }

    handleDelete = (id) => {
        console.log('remove', id)
        let yes = window.confirm("hapus data?")
        if (yes) {
            console.log('data akan di hapus')
            this.deleteDataApi(id)
        }
    }

    handleFormChange = (event) => {
        // console.log(event)
        let formNew = {...this.state.formMahasiswa}
        formNew[event.target.name] = event.target.value

        this.setState({
            formMahasiswa: formNew
        })
    }

    toggleModal = state => {
        console.log(state)
        this.setState({
            [state]: !this.state[state]
        });
    };

    notification = (option) => {
        store.addNotification({
            title: option.title,
            message: option.message,
            type: option.type,
            insert: "top",
            container: "top-left",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true
            }
          });
    }

    componentDidMount () {
        this.getDataApi()
    }

    render() { 
        return (
            <Fragment>
                    <ReactNotification/>
                <CustomHeader/>
                {/* page content */}
                <Container className="mt--7" fluid>
                    <Row>
                        <div className="col">
                            <Card className="shadow">
                                <CardHeader className="border-0">
                                    <Row className="align-items-center">
                                        <Col xs="8">
                                            <h3 className="mb-0">Data Mahasiswa</h3>
                                        </Col>
                                        <Col className="text-right" xs="4">
                                            <Button 
                                                color="primary"
                                                size=""
                                                onClick={this.handleTombolTambah}
                                            >Tambah Data</Button>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <Table className="alig-items-center table-flush" responsive>
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col">NO</th>
                                            <th scope="col">NIM</th>
                                            <th scope="col">Nama</th>
                                            <th scope="col">Alamat</th>
                                            <th scope="col">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.dataMahasiswa.map((data, i) => {
                                                return (
                                                    <tr key={data.id}>
                                                        <td>{i+1}</td>
                                                        <td>{data.nim}</td>
                                                        <td>{data.nama}</td>
                                                        <td>{data.alamat}</td>
                                                        <td>
                                                            <UncontrolledDropdown>
                                                                <DropdownToggle
                                                                    className="btn-icon-only text-light"
                                                                    href="#pablo"
                                                                    role="button"
                                                                    size="sm"
                                                                    color=""
                                                                    onClick={e => e.preventDefault()}
                                                                >
                                                                    <i className="fas fa-ellipsis-v" />
                                                                </DropdownToggle>
                                                                <DropdownMenu className="dropdown-menu-arrow" right>
                                                                    <DropdownItem
                                                                        href="#pablo"
                                                                        onClick={() => {this.handleUpdate(data)}}
                                                                    >
                                                                        Ubah
                                                                    </DropdownItem>
                                                                    <DropdownItem
                                                                        href="#pablo"
                                                                        onClick={() => {this.handleDelete(data.id)}}
                                                                    >
                                                                        Hapus
                                                                    </DropdownItem>
                                                                </DropdownMenu>
                                                            </UncontrolledDropdown>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <CardFooter className="py-4">
                                    <nav aria-label="...">
                                        <Pagination
                                        className="pagination justify-content-end mb-0"
                                        listClassName="justify-content-end mb-0"
                                        >
                                        <PaginationItem className="disabled">
                                            <PaginationLink
                                            href="#pablo"
                                            onClick={e => e.preventDefault()}
                                            tabIndex="-1"
                                            >
                                            <i className="fas fa-angle-left" />
                                            <span className="sr-only">Previous</span>
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem className="active">
                                            <PaginationLink
                                            href="#pablo"
                                            onClick={e => e.preventDefault()}
                                            >
                                            1
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink
                                            href="#pablo"
                                            onClick={e => e.preventDefault()}
                                            >
                                            2 <span className="sr-only">(current)</span>
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink
                                            href="#pablo"
                                            onClick={e => e.preventDefault()}
                                            >
                                            3
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink
                                            href="#pablo"
                                            onClick={e => e.preventDefault()}
                                            >
                                            <i className="fas fa-angle-right" />
                                            <span className="sr-only">Next</span>
                                            </PaginationLink>
                                        </PaginationItem>
                                        </Pagination>
                                    </nav>
                                </CardFooter>
                            </Card>
                        </div>
                    </Row>
                </Container>
                {/* modal */}
                <Modal
                    className="modal-dialog-centered"
                    isOpen={this.state.tambahDataModal}
                    toggle={() => this.toggleModal("tambahDataModal")}
                    >
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                        Form Mahasiswa
                        </h5>
                        <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => this.toggleModal("tambahDataModal")}
                        >
                        <span aria-hidden={true}>×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <Form role="form">
                            <FormGroup>
                                <Label>Nama Mahasiswa</Label>
                                <Input
                                    type="text"
                                    name="nama"
                                    value={this.state.formMahasiswa.nama}
                                    onChange={this.handleFormChange}
                                    placeholder="Masukkan Nama Mahasiswa"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>NIM Mahasiswa</Label>
                                <Input
                                    type="text"
                                    name="nim"
                                    value={this.state.formMahasiswa.nim}
                                    onChange={this.handleFormChange}
                                    placeholder="Masukkan NIM Mahasiswa"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Alamat Mahasiswa</Label>
                                <Input
                                    type="text"
                                    name="alamat"
                                    value={this.state.formMahasiswa.alamat}
                                    onChange={this.handleFormChange}
                                    placeholder="Masukkan Alamat Mahasiswa"
                                />
                            </FormGroup>
                        </Form>
                    </div>
                    <div className="modal-footer">
                        <Button
                        color="secondary"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => this.toggleModal("tambahDataModal")}
                        >
                        Tutup
                        </Button>
                        <Button color="primary" type="button" onClick={this.handleTombolSimpan}>
                        Simpan
                        </Button>
                    </div>
                </Modal>
            </Fragment>
        );
    }
}
 
export default Mahasiswa;