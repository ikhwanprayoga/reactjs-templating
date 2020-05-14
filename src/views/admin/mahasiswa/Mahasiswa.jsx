import React, {Fragment} from 'react';
import CustomHeader from 'components/Headers/CustomHeader';
// reactstrap components
import {
    Card,
    CardHeader,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Container,
    Row,
    Col,
    Modal,
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    CardBody
  } from "reactstrap";
import Axios from 'axios';
import ReactNotification, { store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
// react component for creating dynamic tables
import BootstrapTable from "react-bootstrap-table-next";
import PaginationBSTable from '../../../components/Paginations/PaginationBSTable'
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
  
const { SearchBar } = Search;

class Mahasiswa extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            baseHost: 'http://localhost:8080',
            // tambahDataModal: false,
            isUpdate: false,
            isFoto: false,
            dataMahasiswa: [],
            foto: null,
            formMahasiswa : {
                nama: '',
                nim: '',
                alamat: ''
            }
        }
    }

    setDefaultFormMahasiswa = () => {
        this.setState({
            formMahasiswa : {
                nama: '',
                nim: '',
                alamat: ''
            },
            tambahDataModal: false,
            isFoto: false,
            isUpdate: false,
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
        const formData = new FormData()
        formData.append('file', this.state.foto)
        formData.append('nama', this.state.formMahasiswa.nama)
        formData.append('nim', this.state.formMahasiswa.nim)
        formData.append('alamat', this.state.formMahasiswa.alamat)

        Axios.post(this.state.baseHost+'/api/mahasiswa/store', formData).then((res) => {
            // console.log(res.headers)
            this.getDataApi()
            this.setDefaultFormMahasiswa()
            this.notification({
                title: 'Succes!',
                message: 'Data berhasil ditambahkan',
                type: 'success'
            })
        })
        .catch(function (error) {
            // console.log(error.response);
            // console.log(error.response.status);

            if (error.response.status === 422) {
                error.response.data.errors.map((d, i)=>{
                    store.addNotification({
                        title: 'Error!',
                        message: d.msg,
                        type: 'danger',
                        insert: "top",
                        container: "top-left",
                        dismiss: {
                          duration: 5000,
                          onScreen: true
                        }
                    });
                })
            }
       })
    }

    //update data mahasiswa to api
    updateDataApi = () => {
        let data = this.state.formMahasiswa
        const formData = new FormData()
        formData.append('nama', data.nama)
        formData.append('nim', data.nim)
        formData.append('alamat', data.alamat)
        
        if (this.state.isFoto) {
            formData.append('file', this.state.foto)
        }

        Axios.put(this.state.baseHost+'/api/mahasiswa/update/'+data.id, formData).then((res)=>{
            console.log(res)
            this.getDataApi()
            this.setDefaultFormMahasiswa()
            this.notification({
                title: 'Succes!',
                message: 'Data berhasil diubah',
                type: 'success'
            })
        })
        .catch(function (error) {
            // console.log(error.response);
            // console.log(error.response.status);

            if (error.response.status === 422) {
                error.response.data.errors.map((d, i)=>{
                    store.addNotification({
                        title: 'Error!',
                        message: d.msg,
                        type: 'danger',
                        insert: "top",
                        container: "top-left",
                        dismiss: {
                          duration: 5000,
                          onScreen: true
                        }
                    });
                })
            }
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
        .catch(function (error) {
            console.log(error.response);
            console.log(error.response.status);
            
            if (error.response.status === 422) {
                error.response.data.errors.map((d, i)=>{
                    store.addNotification({
                        title: 'Error!',
                        message: d.msg,
                        type: 'danger',
                        insert: "top",
                        container: "top-left",
                        dismiss: {
                          duration: 5000,
                          onScreen: true
                        }
                    });
                })
            }
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

    handleDetail = (data) => {
        // console.log(data)
        this.props.history.push('/admin/mahasiswa/'+data.id)
    } 

    handleFormChange = (event) => {
        let formNew = {...this.state.formMahasiswa}
        formNew[event.target.name] = event.target.value

        if (event.target.files) {
            console.log(event.target.files[0])
            console.log('foto di lampirkan')
            this.setState({
                isFoto: true,
                foto: event.target.files[0]
            })
            // formNew['file'] = event.target.files[0]
        }

        this.setState({
            formMahasiswa: formNew
        }, ()=>{
            // console.log(this.state.formMahasiswa)
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

    addButtonAction = (cell, row) => {
        return (
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
                        href="#"
                        onClick={()=>{this.handleDetail(row)}}
                    >
                        Detail
                    </DropdownItem>
                    <DropdownItem
                        href="#"
                        onClick={() => {this.handleUpdate(row)}}
                    >
                        Ubah
                    </DropdownItem>
                    <DropdownItem
                        href="#"
                        onClick={() => {this.handleDelete(row.id)}}
                    >
                        Hapus
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        )

    }

    rowNumber = (cell, row, enumObject) => {
        return (
            enumObject + 1
        )
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
                            <Card>
                                <CardHeader className="border-0">
                                    <Row className="align-items-center">
                                        <Col xs="7">
                                            <h3 className="mb-0">Data Mahasiswa</h3>
                                        </Col>
                                        <Col className="text-right" xs="5">
                                            <Button 
                                                color="primary"
                                                size=""
                                                onClick={this.handleTombolTambah}
                                            >Tambah Data</Button>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody className="pt-0 mt--3">
                                    <ToolkitProvider
                                        data={this.state.dataMahasiswa}
                                        keyField="id"
                                        columns={[
                                            {
                                                dataField: "id",
                                                text: "no",
                                                sort: true,
                                                formatter: this.rowNumber
                                            },
                                            {
                                                dataField: "nim",
                                                text: "nim",
                                                sort: true
                                            },
                                            {
                                                dataField: "nama",
                                                text: "nama",
                                                sort: true
                                            },
                                            {
                                                dataField: "alamat",
                                                text: "alamat",
                                                sort: true
                                            },
                                            {
                                                dataField: "",
                                                text: "#",
                                                sort: false,
                                                formatter: this.addButtonAction,
                                            }
                                        ]}
                                        search
                                    >
                                        {props => (
                                            <div className="py-4 table-responsive">
                                                <div
                                                    id="datatable-basic_filter"
                                                    className="dataTables_filter px-4 pb-1"
                                                >
                                                    <label>
                                                        {/* Search: */}
                                                        <SearchBar
                                                            className="form-control-sm"
                                                            placeholder=""
                                                            {...props.searchProps}
                                                        />
                                                    </label>
                                                </div>
                                                <BootstrapTable
                                                    {...props.baseProps}
                                                    bootstrap4={true}
                                                    pagination={PaginationBSTable}
                                                    bordered={false}
                                                />
                                            </div>
                                        )}
                                    </ToolkitProvider>
                                </CardBody>
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
                            <FormGroup>
                                <Label>Foto Mahasiswa</Label>
                                <Input
                                    type="file"
                                    name="file"
                                    onChange={this.handleFormChange}
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