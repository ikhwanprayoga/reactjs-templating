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
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import PaginationBSTable from '../../../components/Paginations/PaginationBSTable'
import { BehaviorSubject } from 'rxjs'

const { SearchBar } = Search;
const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')))

class Dosen extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            baseHost: 'http://localhost:8080',
            tambahDataModal: false,
            isUpdate: false,
            dataJabatan: [],
            dataDosen: [],
            formDosen : {
                nama: '',
                pangkat: '',
                jabatanId: ''
            },
            // currentUser: currentUserSubject._value,
            configHeader: {
                headers: {
                    Authorization: 'Bearer '+currentUserSubject._value.token
                }
            }
        }
        // if (currentUserSubject._value) { 
        //     this.props.history.push('/');
        // } else {
        // this.props.history.push('/auth/login')
        // }
        
    }

    setDefaultFormDosen = () => {
        this.setState({
            formDosen : {
                nama: '',
                pangkat: '',
                jabatanId: ''
            },
            tambahDataModal: false,
            isUpdate: false,
        })
    }

    //get data from api
    getDataApi = () => {
        // const configHeader = ''
        // if (currentUserSubject._value) {
        //     this.configHeader = {
        //         headers: {
        //             Authorization: 'Bearer '+this.state.currentUser.token
        //         }
        //     }
        // }

        console.log(this.state.configHeader)

        Axios.get(this.state.baseHost+'/api/dosen', this.state.configHeader).then((res)=>{
            // console.log(res)
            this.setState({
                dataDosen: res.data
            })
        })
    }

    //get all data jabatan from api
    getDataJabatan = () => {
        Axios.get(this.state.baseHost+'/api/jabatan').then((res) => {
            // console.log(res)
            this.setState({
                dataJabatan: res.data
            })
        })
    }

    //post data to api
    postDataApi = () => {
        Axios.post(this.state.baseHost+'/api/dosen/store', this.state.formDosen)
            .then((res) => {
                // console.log(res)
                this.getDataApi()
                this.setDefaultFormDosen()
                this.notification({
                    title: 'Succes!',
                    message: 'Data berhasil disimpan',
                    type: 'success'
                })
            }).catch((err) => {
                // console.log(err)
                this.notification({
                    title: 'Error!',
                    message: 'Terdapat kesalahan',
                    type: 'danger'
                })
            });
    }

    //updata data to api
    updateDataApi = () => {
        let data = this.state.formDosen
        Axios.put(this.state.baseHost+'/api/dosen/update/'+data.id, data)
            .then((res) => {
                // console.log(res)
                this.getDataApi()
                this.setDefaultFormDosen()
                this.notification({
                    title: 'Succes!',
                    message: 'Data berhasil diubah',
                    type: 'success'
                })
            }).catch((err) => {
                // console.log(err)
                this.notification({
                    title: 'Error!',
                    message: 'Terdapat kesalahan',
                    type: 'danger'
                })
            });
    }

    //delete data to api
    deleteDataApi = (id) => {
        Axios.delete(this.state.baseHost+'/api/dosen/delete/'+id)
            .then((result) => {
                this.getDataApi()
                this.setDefaultFormDosen()
                this.notification({
                    title: 'Succes!',
                    message: 'Data berhasil diubah',
                    type: 'success'
                })
            }).catch((err) => {
                this.notification({
                    title: 'Error!',
                    message: 'Terdapat kesalahan',
                    type: 'danger'
                })
            });
    }

    handleTombolSimpan = () => {
        // console.log('simpan')
        if (this.state.isUpdate) {
            this.updateDataApi()
        } else {
            this.postDataApi()
        }
    }

    handleTombolTambah = () => {
        // console.log('tombol tambah')
        this.toggleModal("tambahDataModal")
    }

    handleUpdate = (data) => {
        // console.log(data)
        this.setState({
            formDosen: data,
            isUpdate: true
        })
        this.toggleModal("tambahDataModal")
    }

    handleDelete = (id) => {
        let confirm = window.confirm("Apakah anda yakin ingin menghapus?")
        if (confirm) {
            this.deleteDataApi(id)
        }
    }

    handleFormChange = (event) => {
        // console.log(event)
        let formNew = {...this.state.formDosen}
        formNew[event.target.name] = event.target.value

        this.setState({
            formDosen: formNew
        })
    }

    toggleModal = state => {
        // console.log(state)
        this.setState({
            [state]: !this.state[state]
        });
    };

    rowNumber = (cell, row, enumObject) => {
        return (
            enumObject + 1
        )
    }

    capitalize = (text) => {
        if (!text) return text;
        if (typeof text !== 'string') throw "invalid argument";

        return text.toLowerCase().split(' ').map(value => {
            return value.charAt(0).toUpperCase() + value.substring(1);
        }).join(' ');
    }

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
                        href="#pablo"
                        onClick={() => {this.handleUpdate(row)}}
                    >
                        Ubah
                    </DropdownItem>
                    <DropdownItem
                        href="#pablo"
                        onClick={() => {this.handleDelete(row.id)}}
                    >
                        Hapus
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        )

    }

    componentDidMount () {
        if (!currentUserSubject._value) {
            this.props.history.push('/auth/login')
        }
        this.getDataApi()
        this.getDataJabatan()
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
                                            <h3 className="mb-0">Data Dosen</h3>
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
                                <CardBody  className="pt-0 mt--3">
                                    <ToolkitProvider
                                        data={this.state.dataDosen}
                                        keyField="id"
                                        columns={[
                                            {
                                                dataField:"id",
                                                text:"no",
                                                sort: true,
                                                formatter: this.rowNumber
                                            },
                                            {
                                                dataField:"nama",
                                                text:"nama",
                                                sort: true,
                                            },
                                            {
                                                dataField:"pangkat",
                                                text:"pangkat",
                                                sort: true,
                                            },
                                            {
                                                dataField:"jabatan.nama",
                                                text:"jabatan",
                                                sort: true,
                                            },
                                            {
                                                dataField: "",
                                                text: "#",
                                                sort: false,
                                                formatter: this.addButtonAction,
                                            }
                                        ]}
                                    >
                                        {
                                            props => (
                                                <div className="py-4 table-responsive"
                                                >
                                                    <div
                                                        id="datatable-basic_filter"
                                                        className="dataTables_filter px-4 pb-1"
                                                    >
                                                        <label>
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
                                            )
                                        }
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
                        Form Dosen
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
                                <Label>Nama Dosen</Label>
                                <Input
                                    type="text"
                                    name="nama"
                                    value={this.state.formDosen.nama}
                                    onChange={this.handleFormChange}
                                    placeholder="Masukkan Nama Dosen"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Pangkat Dosen</Label>
                                <Input
                                    type="text"
                                    name="pangkat"
                                    value={this.state.formDosen.pangkat}
                                    onChange={this.handleFormChange}
                                    placeholder="Masukkan Pangkat Dosen"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="selectJabatan">Jabatan Dosen</Label>
                                <Input id="selectJabatan" type="select" name="jabatanId" onChange={this.handleFormChange}>
                                    <option value="">Pilih Jabatan</option>
                                    {
                                        this.state.dataJabatan.map((data, i) => {
                                            return (
                                                <option 
                                                    key={data.id} 
                                                    value={data.id}
                                                    selected={this.state.formDosen.jabatanId === data.id}
                                                >
                                                    {this.capitalize(data.nama)}
                                                </option>
                                            )
                                        })
                                    }
                                </Input>
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
 
export default Dosen;