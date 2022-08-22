import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { InputSwitch } from 'primereact/inputswitch';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext';
import Axios from 'axios'

const Users = () => {

    const [users, setUsers] = useState(null)
    const [updateDialog, setUpdateDialog] = useState(false)

    const [name, setName] = useState(null)
    const [address, setAddress] = useState(null)
    const [mobile, setMobile] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [updateId, setUpdateId] = useState(null)

    const allUsers = async () => {
        await Axios.get(`http://localhost:3000/allusers`).then((res) => {
            // console.log(res.data.details);
            setUsers(res.data.details)
        })
    }

    const usertDeleteHandler = async (value, id) => {
        await Axios.post(`http://localhost:3000/deleteuser?id=${id}`, { value }).then(async (res) => {
            await allUsers()
        }).catch((e) => {
            console.log(e);
        })
    }

    const deleteBodyTemplate = (details) => {
        return (
            <div>
                <InputSwitch checked={details.status} onChange={(e) => usertDeleteHandler(e.value, details._id)} />
            </div>
        )
    }

    const showUpdateDialog = (details) => {
        setUpdateDialog(true)
        setAddress(details.address)
        setEmail(details.email)
        setMobile(details.mobile)
        setName(details.name)
        setPassword(details.password)
        setUpdateId(details._id)
    }

    const updateBodyTemplate = (details) => {
        return (
            <div>
                <Button className='p-button-outlined p-button-warning' onClick={() => showUpdateDialog(details)}>Update</Button>
            </div>
        )
    }
    
    const hideUpdateDialog = () => {
        setUpdateDialog(false)
        setAddress(null)
        setEmail(null)
        setMobile(null)
        setName(null)
        setUpdateId(null)
        setPassword(null)
    }

    const updateHandler = async () => {
        await Axios.post(`http://localhost:3000/updateuser?id=${updateId}`, {email, address, mobile, name}).then(async () => {
           await allUsers()
           await hideUpdateDialog()
        }).catch((e) => {
            console.log(e);
        })
    }

    useEffect(() => {
        allUsers()
    }, [])


    return (
        <div className='card'>
            <h2>All Users</h2>
            <DataTable value={users} dataKey="id" paginator rows={10} cols={4} className="datatable-responsive p-datatable-gridlines p-3" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" emptyMessage="no orders found." responsiveLayout="scroll">
                <Column header='name' field='name' />
                <Column header='Address' field='address' />
                <Column header='Email' field='email' />
                <Column header='Mobile No.' field='mobile' />
                <Column header='Password' field='password' />
                <Column header='Orders' field={(details) => details.order.length} />
                <Column header='Delete' body={deleteBodyTemplate} />
                <Column header='Update' body={updateBodyTemplate} />
            </DataTable>

            <Dialog visible={updateDialog} modal onHide={hideUpdateDialog} style={{width: '50vw'}}>
            <div className='my-5 flex justify-content-center flex-column align-items-center'>
                    {/* <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText id="inputtext" value={company} onChange={(e) => setCompany(e.target.value)} />
                            <label htmlFor="inputtext">Company</label>
                        </span>
                    </div> */}
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText id="inputtext" value={name} onChange={(e) => setName(e.target.value)} />
                            <label htmlFor="inputtext">Name</label>
                        </span>
                    </div>
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText id="inputtext" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <label htmlFor="inputtext">Email</label>
                        </span>
                    </div>
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText id="inputtext" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                            <label htmlFor="inputtext">Mobile No.</label>
                        </span>
                    </div>
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText id="inputtext" value={address} onChange={(e) => setAddress(e.target.value)} />
                            <label htmlFor="inputtext">Address</label>
                        </span>
                    </div>
                </div>
                <div className='flex justify-content-between'>
                    <Button className='p-button-outlined p-button-danger' onClick={hideUpdateDialog}>Discard</Button>
                    <Button className='p-button-outlined p-button-info' onClick={updateHandler}>Update</Button>
                </div>
            </Dialog>
        </div>
    )
}

export default Users