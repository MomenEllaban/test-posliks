import { useEffect, useState } from "react";
import { Button, ButtonGroup, Card, Spinner, Table } from 'react-bootstrap'
import { apiFetchCtr } from "src/libs/dbUtils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faFolderOpen, faGear } from '@fortawesome/free-solid-svg-icons'
import { getmyUsername } from '../../../libs/loginlib'
import { OwnerAdminLayout } from "@layout";
import Link from "next/link"
import { verifayTokens } from "src/pages/api/checkUtils";
import { ITokenVerfy } from "@models/common-model";
import * as cookie from 'cookie'
import { useRouter } from "next/router";

const Mybusinesses = ({ username }: any) => {
    const router = useRouter()
    const [locations, setLocations] = useState<{ id: number, name: string }[]>([])
    async function initDataPage() {
        const { success, newdata } = await apiFetchCtr({ fetch: 'owner', subType: 'getBusiness' })
        if (!success) {

            return
        }
        var buss: any = [];
        var _newdata = newdata;
        
        for (let j = 0; j < newdata.length; j++) {
            var bid = newdata[j].business_id;
            if (buss.findIndex((pp: any) => pp == bid) == -1) {
                buss.push(bid)
                _newdata.splice(j, 0, { isHead: true, data: newdata[j], });
            }
        }
        console.log('hhhhhhhhhhhhhhhhhh', newdata);
        
        setLocations(_newdata)

    }
    useEffect(() => {
        initDataPage();
        console.log('dddddddddddd', locations);
        
    }, [])

    return (
        <>
            <OwnerAdminLayout>
                <div className="row">
                    <div className="col-md-12">
                        <Link href={'/' + username + '/business/create'} className='btn btn-primary p-3 mb-3'><FontAwesomeIcon icon={faPlus} /> Add New Business </Link>
                        <Card >
                            <Card.Header className="p-3 bg-white">
                                <h5>My Business</h5>
                            </Card.Header>
                            <Card.Body >
                                {locations.length > 0 ? <Table className="table table-hover" responsive>
                                    <thead className="thead-dark">
                                        <tr>
                                            <th style={{ width: '6%' }} >#</th>
                                            <th>Name</th>
                                            <th>type</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            locations.map((busi: any, i: number) => {
                                                if (busi.isHead) {
                                                    return (
                                                        <tr key={i} style={{ background: '#e4edec' }}>
                                                            <th scope="row">{busi.data.business_id}</th>
                                                            <td>{busi.data.business_name}</td>
                                                            <td>{busi.data.business_type}</td>
                                                            <td><ButtonGroup className="mb-2 m-buttons-style">
                                                                <Button onClick={() => {
                                                                    router.push('/' + username + '/business/' + busi.data.business_id + '/settings')
                                                                }}><FontAwesomeIcon icon={faGear} /></Button>
                                                                <Button onClick={() => router.push('/' + username + '/business/' + busi.data.business_id + '/add')}><FontAwesomeIcon icon={faPlus} /> Add New Location</Button>
                                                            </ButtonGroup></td>
                                                        </tr>
                                                    )
                                                }
                                                return (
                                                    <tr key={i}>
                                                        <th scope="row"></th>
                                                        <td>{busi.loc_name}</td>
                                                        <td>{busi.state}</td>
                                                        <td><ButtonGroup className="mb-2 m-buttons-style">
                                                            <Button onClick={() => { router.push('/shop/' + busi.loc_id + '/products/') }}><FontAwesomeIcon icon={faFolderOpen} />
                                                            </Button>
                                                        </ButtonGroup></td>
                                                    </tr>
                                                )
                                            })

                                        }
                                    </tbody>
                                </Table>
                                    : <div className='d-flex justify-content-around' ><Spinner animation="grow" /></div>}
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </OwnerAdminLayout>
        </>
    )
}
export default Mybusinesses;
export async function getServerSideProps(context: any) {
    if (context.query.username == undefined) {
        return {
            redirect: {
                permanent: false, destination: "/user/login"
            }
        }
    }
    //check token
    let _isOk = true
    const parsedCookies = cookie.parse(context.req.headers.cookie || '[]');
    await verifayTokens({ headers: { authorization: 'Bearer ' + parsedCookies.tokend } }, (repo: ITokenVerfy) => {
        _isOk = repo.status;
    })
    if (!_isOk) return { redirect: { permanent: false, destination: "/user/login" } }
    //end

    let username = getmyUsername(context.query);
    return {
        props: { username },
    };
}