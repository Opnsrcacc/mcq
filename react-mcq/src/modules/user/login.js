import React, { useState, useEffect } from 'react';
import { FormGroup, Form, Col, Button, FormLabel, FormControl } from 'react-bootstrap';
import request from '../../service';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    let [namepass, setnamepass] = useState({ name: '', password: '', nameError: false, passwordError: false }),
        [buttonprocessing, setbuttonprocessing] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('userAuthToken')) {
            return window.location = '/dashboard'
        }
    }, []);

    let onchange = e => {
        let { name, value } = e.target;
        setnamepass({ ...namepass, [name]: value, [`${name}Error`]: value ? false : true });
    }, submitlogin = () => {
        let { name = '', password = '' } = namepass;
        if (!name) {
            toast.error('Name is required');
            return setnamepass({ ...namepass, nameError: true });
        }
        if (!password) {
            toast.error('Password is required');
            return setnamepass({ ...namepass, passwordError: true });
        }
        setbuttonprocessing(true);
        request('/admin/user/login', 'POST', { name, password }
        ).then(res => {
            if (res && res.data && +res.data.status === 1) {
                localStorage.setItem('userAuthToken', res.data.authToken);
                toast.success(res.data.response);
                setTimeout(() => {
                    return window.location = '/dashboard';
                }, 1000);
            } else {
                toast.error(res.data.response);
            }
        }).catch(err => {
            console.log("err /admin/user/login", err);
            toast.error('Something went wrong');
        }).finally(() => {
            setbuttonprocessing(false);
        });
    };

    return (
        <div className="signin">
            <h2>Sign In</h2>
            <ToastContainer autoClose={2000} closeOnClick={true} />
            <Form>
                <FormGroup>
                    <FormLabel for="exampleEmail" >Username Or Email <span style={{ color: 'red' }} >*</span> </FormLabel>
                    <Col sm={10} >
                        <FormControl
                            id='exampleEmail'
                            type="name"
                            name="name"
                            value={namepass.name}
                            onChange={e => onchange(e)}
                            placeholder="Enter your Username or Email"
                        />
                        {namepass.nameError ? <FormControl.Feedback type='invalid' > Username is required </FormControl.Feedback> : null}
                    </Col>
                </FormGroup>
                <FormGroup>
                    <FormLabel for="password" >Password <span style={{ color: 'red' }} >*</span> </FormLabel>
                    <Col sm={10}>
                        <FormControl
                            value={namepass.password}
                            id='password'
                            type="password"
                            name="password"
                            onChange={e => onchange(e)}
                            placeholder='Enter your password'
                        />
                        {namepass.passwordError ? <FormControl.Feedback type='invalid' > Password is required </FormControl.Feedback> : null}
                    </Col>
                </FormGroup>
                <FormGroup>
                    {
                        buttonprocessing ?
                            <Button title='Submit' style={{ cursor: 'progress' }} disabled >Submit</Button>
                            :
                            <Button title='Submit' onClick={e => { e.preventDefault(); submitlogin() }}  >Submit</Button>
                    }
                </FormGroup>
            </Form>
            <div style={{ textAlign: 'center' }}>
                <Link to='/register'> Register </Link>
            </div>
        </div>
    )
}

export default Login
