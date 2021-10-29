import React, { useState, useEffect } from 'react';
import { Table, Col, Row, Button, Form, FormGroup, FormControl, FormLabel, Card } from 'react-bootstrap';
import request from '../../service';
import { Modal, ModalBody, ModalFooter, ModalHeader, Popover, PopoverHeader, PopoverBody, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let asc = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-up" viewBox="0 0 16 16">
    <path d="M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707V12.5zm3.5-9a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z" />
</svg>;

let desc = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-down" viewBox="0 0 16 16">
    <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z" />
</svg>;

function QuestionsList() {
    let [questionsList, setquestionsList] = useState([]),
        [pages, setpages] = useState(0),
        [activePage, setactivePage] = useState(1),
        [addeditQuestions, setaddeditQuestions] = useState({
            name: '', _id: '', status: '',
            options: [{ key: 'Choice 1', value: '' }, { key: 'Choice 2', value: '' }, { key: 'Choice 3', value: '' }],
            nameError: false, statusError: false
        }),
        [openAddEditpop, setopenAddEditpop] = useState(false),
        [delete_pop_id, setdelete_pop_id] = useState(''),
        [DeletePopOver, setDeletePopOver] = useState(false),
        [tableOptions, settableOptions] = useState({
            skip: 0,
            limit: 5,
            search: '',
            filed: 'createdAt',
            order: -1
        }),
        [buttonprocessing, setbuttonprocessing] = useState(false);

    let GetQuestionsList = () => {
        request(`/admin/user/questions/list?skip=${tableOptions.skip}&limit=${tableOptions.limit}&filed=${tableOptions.filed}&order=${tableOptions.order}&search=${tableOptions.search}`, 'get', {}).
            then(res => {
                if (res && res.data && +res.data.status === 1) {
                    setquestionsList(res.data.response && res.data.response.data && Array.isArray(res.data.response.data) ? res.data.response.data : []);
                    setpages(res.data.response && res.data.response.overallcount ? Math.ceil(Number(res.data.response.overallcount) / Number(tableOptions.limit)) : 0);
                } else if (res && res.data && res.data.status === '00') {
                    localStorage.removeItem('userAuthToken')
                    return window.location = '/login';
                }
            }).catch(err => {
                console.log("err in GetQuestionsList", err)
                toast.error('Something went wrong');
            });
    };

    let searchfun = (value = '') => {
        setDeletePopOver(false); setdelete_pop_id('');
        settableOptions({ ...tableOptions, search: value });
    };

    let sortQstn = (filed = '', order = -1) => {
        setDeletePopOver(false); setdelete_pop_id('');
        settableOptions({ ...tableOptions, filed: filed, order: order });
    };

    let onchange = e => {
        let { name, value } = e.target;
        setaddeditQuestions({ ...addeditQuestions, [name]: value, [`${name}Error`]: value ? false : true });
    };

    let clickAddMcq = (val = false) => {
        setDeletePopOver(false); setdelete_pop_id('');
        if (!val) {
            setaddeditQuestions({
                name: '', _id: '',
                options: [{ key: 'Choice 1', value: '' }, { key: 'Choice 2', value: '' }, { key: 'Choice 3', value: '' }],
                status: '', nameError: false, statusError: false
            });
        }
        setopenAddEditpop(val);
    };

    let saveQuestions = e => {
        e.preventDefault();
        let { name = '', status = '', _id = '', options = [] } = addeditQuestions;
        if (!name) {
            toast.error('Name is required');
            setaddeditQuestions({ ...addeditQuestions, nameError: true });
            return;
        }
        if (!status) {
            toast.error('Status is required');
            setaddeditQuestions({ ...addeditQuestions, statusError: true });
            return;
        }
        let filtered = [...options].filter(e => !e.value);
        if (filtered && filtered.length > 0) {
            toast.error(`${filtered[0].key} is require1`)
            return;
        }
        setbuttonprocessing(true);
        request('/admin/user/questions/add', 'post', { name, status, _id, options }).then(res => {
            if (res && res.data && +res.data.status === 1) {
                toast.success(res.data.response);
                setTimeout(() => {
                    GetQuestionsList();
                    clickAddMcq(false);
                }, 1000);
            } else if (res && res.data && res.data.status === '00') {
                localStorage.removeItem('userAuthToken')
                return window.location = '/login';
            } else {
                toast.error(res.data.response);
            }
        }).catch(err => {
            console.log("err in saveQuestions", err);
            toast.error('Something went wrong');
        }).finally(() => {
            setbuttonprocessing(false);
        });
    };

    let deleteQuestions = () => {
        if (delete_pop_id) {
            request(`/admin/user/questions/delete?_id=${delete_pop_id}`, 'delete', {}).then(res => {
                if (res && res.data && +res.data.status === 1) {
                    toast.success(res.data.response);
                    setTimeout(() => {
                        GetQuestionsList();
                    }, 1000);
                } else if (res && res.data && res.data.status === '00') {
                    localStorage.removeItem('userAuthToken')
                    return window.location = '/login';
                } else {
                    toast.error(res.data.response);
                }
            }).catch(err => {
                console.log("err in deleteQuestions", err);
                toast.error('Something went wrong');
            })
        }
    };

    let deletePop = (_id = '') => {
        setDeletePopOver(true);
        setdelete_pop_id(_id);
    };

    let paginate = (e, data) => {
        e.preventDefault();
        setactivePage(data);
        settableOptions({ ...tableOptions, skip: data * tableOptions.limit - tableOptions.limit });
    };

    let editdata = (_id = '') => {
        request(`/admin/user/questions/edit?_id=${_id}`, 'get', {}).then(res => {
            if (res && res.data && +res.data.status === 1) {
                setaddeditQuestions({
                    ...addeditQuestions,
                    _id: res.data.response && res.data.response._id ? res.data.response._id : _id,
                    name: res.data.response && res.data.response.name ? res.data.response.name : '',
                    options: res.data.response && res.data.response.options && Array.isArray(res.data.response.options) ? res.data.response.options : '',
                    status: res.data.response && res.data.response.status ? res.data.response.status : ''
                });
            } else if (res && res.data && res.data.status === '00') {
                localStorage.removeItem('userAuthToken')
                return window.location = '/login';
            }
        }).catch(err => {
            console.log("err in editdata", err);
            toast.error('Something went wrong');
        }).finally(() => {
            setopenAddEditpop(true);
        });
    };

    let onchangeArr = (val = '', index = 0) => {
        let optionsdata = [...addeditQuestions.options];
        optionsdata[index] = { ...optionsdata[index], value: val };
        setaddeditQuestions(
            {
                ...addeditQuestions,
                options: [...optionsdata]
            }
        );
    };

    useEffect(() => {
        GetQuestionsList();
    }, [tableOptions]);

    return (
        <div>
            <h2> MCQ </h2>
            <ToastContainer autoClose={2000} closeOnClick={true} />
            <Card style={{ width: '70%' }} >
                <Row className='searchbar'>
                    <Col xs={12} md={6} >
                        <input type='text' name='search' onChange={e => searchfun(e.target.value)} placeholder='Search here...' value={tableOptions.search} />
                    </Col>
                    <Col xs={12} md={6} >
                        <Button title='Add MCQ' onClick={e => { e.preventDefault(); clickAddMcq(true) }} >Add MCQ</Button>
                    </Col>
                </Row>
                <Col xs={12} md={8} className='tablealign-lftrgt' >
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Created On {' '}
                                    {tableOptions.filed === 'createdAt' ?
                                        tableOptions.order === -1 ?
                                            <img style={{ cursor: 'pointer' }} onClick={e => sortQstn('createdAt', 1)} src={`${process.env.PUBLIC_URL}/sort-down.svg`} alt='sort-down' />
                                            :
                                            <img style={{ cursor: 'pointer' }} onClick={e => sortQstn('createdAt', -1)} src={`${process.env.PUBLIC_URL}/sort-up.svg`} alt='sort-up' />
                                        : <img style={{ cursor: 'pointer' }} onClick={e => sortQstn('createdAt', 1)} src={`${process.env.PUBLIC_URL}/sort-down.svg`} alt='sort-down' />
                                    }
                                </th>
                                <th>Name
                                {tableOptions.filed === 'name' ?
                                        tableOptions.order === -1 ?
                                            <img style={{ cursor: 'pointer' }} onClick={e => sortQstn('name', 1)} src={`${process.env.PUBLIC_URL}/sort-down.svg`} alt='sort-down' />
                                            :
                                            <img style={{ cursor: 'pointer' }} onClick={e => sortQstn('name', -1)} src={`${process.env.PUBLIC_URL}/sort-up.svg`} alt='sort-up' />
                                        : <img style={{ cursor: 'pointer' }} onClick={e => sortQstn('name', 1)} src={`${process.env.PUBLIC_URL}/sort-down.svg`} alt='sort-down' />
                                    }

                                </th>
                                <th>Options</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                questionsList && questionsList.length > 0 ? questionsList.map((item, index) => {
                                    let { createdAt = '', name = '', status = 1, options = [] } = item;
                                    return (
                                        <tr key={index} >
                                            <td>{createdAt ? createdAt : null}</td>
                                            <td>{name ? name : null}</td>
                                            <td>
                                                <ul style={{ listStyleType: 'circle' }}>
                                                    {
                                                        [...options].map((itemdata, idx) => {
                                                            return (
                                                                <li key={idx}>{itemdata.value ? itemdata.value : ''} </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </td>
                                            <td>{status ? +status === 1 ? 'Active' : 'In-active' : null}</td>
                                            <td>
                                                <Button title='Edit' onClick={e => { e.preventDefault(); editdata(item._id); }} >Edit  </Button> {' '}
                                                <Button title='Delete' id={`deletequestions${item._id}`} onClick={e => { e.preventDefault(); deletePop(item._id) }} >Delete </Button>
                                                {String(delete_pop_id) === String(item._id) ?
                                                    <Popover placement='right' isOpen={DeletePopOver && delete_pop_id} target={`deletequestions${item._id}`} >
                                                        <PopoverHeader>{" "}Confirmation{" "}</PopoverHeader>
                                                        <PopoverBody>
                                                            <h6>{" "}Are You Sure, You Want To Delete?{" "}</h6>
                                                            <Button variant='danger' title='yes' onClick={e => { e.preventDefault(); deleteQuestions() }} >Yes</Button>{' '}
                                                            <Button variant='light' title='No' onClick={e => { e.preventDefault(); setDeletePopOver(false); setdelete_pop_id(''); }}  >No</Button>
                                                        </PopoverBody>
                                                    </Popover>
                                                    : null
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                                    :
                                    <tr className="text-center" >
                                        <td colSpan={12}> No records available </td>
                                    </tr>
                            }
                        </tbody>
                        <Col>
                            {
                                questionsList && questionsList.length > 0 ?
                                    <Pagination aria-label="Page navigation example"
                                        className="pagination-primary cus-page"  >
                                        <PaginationItem disabled>
                                            <PaginationLink first className="h-first" />
                                        </PaginationItem>
                                        <PaginationItem disabled>
                                            <PaginationLink previous className="v-prev" />
                                        </PaginationItem>
                                        {
                                            [...Array(pages)].map((item, i) => {
                                                return (
                                                    <PaginationItem active={Number(i + 1) === activePage} key={i}>
                                                        <PaginationLink onClick={e => paginate(e, i + 1)}>
                                                            {i + 1}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                )
                                            })
                                        }
                                        <PaginationItem disabled>
                                            <PaginationLink next className="v-next" />
                                        </PaginationItem>
                                        <PaginationItem disabled>
                                            <PaginationLink last className="h-last" />
                                        </PaginationItem>
                                    </Pagination>
                                    : null
                            }
                        </Col>
                    </Table>
                </Col>
                <Modal isOpen={openAddEditpop} toggle={e => clickAddMcq(false)}>
                    <ModalHeader toggle={e => clickAddMcq(false)} >{addeditQuestions && addeditQuestions._id ? 'Edit MCQ' : 'Add MCQ'}</ModalHeader>
                    <ToastContainer autoClose={2000} closeOnClick={true} />
                    <ModalBody>
                        <Form style={{ overflow: 'auto', height: '500px' }} >
                            <FormGroup>
                                <FormLabel>Name <span style={{ color: 'red' }} >*</span>  </FormLabel>
                                <Col sm={12} md={12} >
                                    <textarea id='questionnMW' type="textarea" name="name" value={addeditQuestions.name}
                                        maxLength={250} className='form-control' onChange={e => onchange(e)} placeholder="Enter Question Name" />
                                    {String(addeditQuestions.name).length} / {250}
                                    {addeditQuestions.nameError ? <FormControl.Feedback type='invalid' > Name is required </FormControl.Feedback> : null}
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>Choice <span style={{ color: 'red' }} >*</span>  </FormLabel>
                                <Col sm={6} md={12}>
                                    {
                                        addeditQuestions.options.map((item, index) => {
                                            return (
                                                <ul key={index}>
                                                    <li>
                                                        <FormLabel>{item.key} <span style={{ color: 'red' }} >*</span> </FormLabel>
                                                        <Col md={12} xs={12} >
                                                            <textarea style={{ width: '100%' }} name={`choice${index}`} required={true} value={item.value} onChange={e => onchangeArr(e.target.value, index)} />
                                                        </Col>
                                                    </li>
                                                </ul>
                                            )
                                        })
                                    }
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>Select Status <span style={{ color: 'red' }} >*</span>  </FormLabel>
                                <Col sm={6} md={12} >
                                    <select size="lg" name='status' className='form-control' onChange={e => onchange(e)} value={addeditQuestions.status} >
                                        <option value='' >Select...</option>
                                        <option value={1}> Active</option>
                                        <option value={2} >In-Active</option>
                                    </select>
                                    {addeditQuestions.statusError ? <FormControl.Feedback type='invalid' > Status is required </FormControl.Feedback> : null}
                                </Col>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        {
                            buttonprocessing ?
                                <>
                                    <Button variant="success" disabled={true} style={{ cursor: 'progress' }} >{addeditQuestions._id ? 'Update' : 'Save'}</Button>
                                    <Button variant="light" disabled={true} style={{ cursor: 'progress' }} > Cancel</Button>
                                </>
                                :
                                <>
                                    <Button variant="success" onClick={e => saveQuestions(e)} >{addeditQuestions._id ? 'Update' : 'Save'}</Button>
                                    <Button variant="light" onClick={e => { e.preventDefault(); clickAddMcq(false) }} > Cancel</Button>
                                </>
                        }
                    </ModalFooter>
                </Modal>
            </Card>
        </div>
    )
}

export default QuestionsList
