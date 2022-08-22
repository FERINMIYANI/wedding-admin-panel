import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button'

const Sellers = () => {


    const [company, setCompany] = useState(null)
    const [name, setName] = useState(null)
    const [email, setEmail] = useState(null)
    const [mobile, setMobile] = useState(null)
    const [address, setAddress] = useState(null)
    const [password, setPassword] = useState(null)
    const [updateId, setUpdateId] = useState(null)


    const [sellers, setSellers] = useState()
    const [updateDialog, setUpdateDialog] = useState(false)

    const allSeller = () => {
        Axios.get(`http://localhost:3000/allseller`).then((res) => {
            // console.log(res.data.details);
            setSellers(res.data.details)
        })
    }

    useEffect(() => {
        allSeller()
    }, [])

    const deleteHandler = (value, id) => {

        Axios.post(`http://localhost:3000/deleteseller?id=${id}`, { value }).then((res) => {
            allSeller()
        }).catch((e) => {
            console.log(e);
        })
    }

    const showUpdateDialog = (details) => {
        setUpdateDialog(true)
        setCompany(details.company)
        setAddress(details.address)
        setEmail(details.email)
        setMobile(details.mobile)
        setName(details.companyOwner)
        setPassword(details.password)
        setUpdateId(details._id)
    }

    const actionBodyTemplate = (details) => {
        return (
            <div className='flex align-items-center justify-content-between'>
                <Button className='p-button-outlined p-button-warning' onClick={() => showUpdateDialog(details)}>Update</Button>
                <InputSwitch style={{color: 'red'}} checked={details.status} onChange={(e) => deleteHandler(e.value, details._id)} />
            </div>
        )
    }

    const hideUpdateDialog = () => {
        setUpdateDialog(false)
        setCompany(null)
        setAddress(null)
        setEmail(null)
        setMobile(null)
        setName(null)
        setUpdateId(null)
        setPassword(null)
    }

    const updateHandler = async () => {
        await Axios.post(`http://localhost:3000/updateseller?id=${updateId}`, {company, address, email, mobile, companyOwner: name, password}).then(async (res) => {
            await allSeller()
            await hideUpdateDialog()

        }).catch((e) => {
            console.log('update Failed');
        })
    }


    return (
        <div className='card'>
            <h2>All Sellers</h2>
            <DataTable value={sellers} dataKey="id" paginator rows={10} cols={4} className="datatable-responsive p-datatable-gridlines p-3" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" emptyMessage="no orders found." responsiveLayout="scroll">
                <Column header='Company' field='company' />
                <Column header='Name' field='companyOwner' />
                <Column header='Email' field='email' />
                <Column header='Mobile No.' field='mobile' />
                <Column header='Address' field='address' />
                <Column header='Password' field='password' />
                <Column header='Products' field={(details) => details.products.length} />
                <Column header='Action' body={actionBodyTemplate} />
            </DataTable>

            <Dialog visible={updateDialog} modal style={{ width: '65vh' }} header='update Seller' onHide={hideUpdateDialog}>
                <div className='my-5 flex justify-content-center flex-column align-items-center'>
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText id="inputtext" value={company} onChange={(e) => setCompany(e.target.value)} />
                            <label htmlFor="inputtext">Company</label>
                        </span>
                    </div>
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

export default Sellers