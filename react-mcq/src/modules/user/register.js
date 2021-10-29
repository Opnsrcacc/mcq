import React, { useState, useEffect } from 'react';
import { FormGroup, Form, Col, Button, FormLabel, FormControl } from 'react-bootstrap';
import request from '../../service';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

function Register(props = {}) {
    let [namepass, setnamepass] = useState({
        name: '', password: '', email: '',
        emailError: false, nameError: false, passwordError: false,
        confirmPassword: '', confirmPasswordError: false
    }), [buttonprocess, setbuttonprocess] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('userAuthToken')) {
            return window.location = '/dashboard'
        }
    }, []);

    let onchange = e => {
        let { name, value } = e.target;
        setnamepass({ ...namepass, [name]: value, [`${name}Error`]: value ? false : true });
    }, submitlogin = () => {
        let { name = '', password = '', email = '', confirmPassword = '' } = namepass;
        if (!name) {
            toast.error('Name is required');
            return setnamepass({ ...namepass, nameError: true });
        }
        if (!email) {
            toast.error('Email is required');
            return setnamepass({ ...namepass, emailError: true });
        }
        if (!validateEmail(email)) {
            toast.error('Valid email is required');
            return setnamepass({ ...namepass, emailError: true });
        }
        if (!password) {
            toast.error('Password is required')
            return setnamepass({ ...namepass, passwordError: true });
        }
        if (!confirmPassword) {
            toast.error('Confirm Password is required');
            return setnamepass({ ...namepass, confirmPasswordError: true });
        }
        if (String(password) !== String(confirmPassword)) {
            toast.error('Confirm Password and password should be same');
            return;
        }
        setbuttonprocess(true);
        request('/admin/user/add', 'POST', { name, password, email }
        ).then(res => {
            if (res && res.data && +res.data.status === 1) {
                toast.success(res.data.response);
                setTimeout(() => {
                    return props.history.push('/login');
                }, 1000);
            } else {
                toast.error(res.data.response);
            }
        }).catch(err => {
            console.log("err /admin/user/login", err);
            toast.error('Something went wrong');
        }).finally(() => {
            setbuttonprocess(false);
        });
    };

    return (
        <div className="signin">
            <h2>Sign Up</h2>
            <ToastContainer autoClose={2000} closeOnClick={true} />
            <Form>
                <FormGroup>
                    <FormLabel for="examplename" > Name <span style={{ color: 'red' }} >*</span> </FormLabel>
                    <Col sm={10} >
                        <FormControl
                            id='examplename'
                            type="name"
                            name="name"
                            value={namepass.name}
                            onChange={e => onchange(e)}
                            placeholder="Enter your name"
                        />
                        {namepass.nameError ? <FormControl.Feedback type='invalid' > Name is required </FormControl.Feedback> : null}
                    </Col>
                </FormGroup>
                <FormGroup>
                    <FormLabel for="exampleEmail" > Email <span style={{ color: 'red' }} >*</span> </FormLabel>
                    <Col sm={10} >
                        <FormControl
                            id='exampleEmail'
                            type="email"
                            name="email"
                            value={namepass.email}
                            onChange={e => onchange(e)}
                            placeholder="Enter your name"
                        />
                        {namepass.emailError ? <FormControl.Feedback type='invalid' > Email is required </FormControl.Feedback> : null}
                        {namepass.email && !validateEmail(namepass.email) ? <FormControl.Feedback type='invalid' > Email is required </FormControl.Feedback> : null}
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
                    <FormLabel for="confirmPassword" >Confirm Password <span style={{ color: 'red' }} >*</span> </FormLabel>
                    <Col sm={10}>
                        <FormControl
                            value={namepass.confirmPassword}
                            id='confirmPassword'
                            type="password"
                            name="confirmPassword"
                            onChange={e => onchange(e)}
                            placeholder='Enter your password'
                        />
                        {namepass.confirmPasswordError ? <FormControl.Feedback type='invalid' > Confirm Password is required </FormControl.Feedback> : null}
                        {namepass.password && namepass.confirmPassword && (namepass.password !== namepass.confirmPassword) ? <FormControl.Feedback type='invalid' > Password and Confirm Password should be same </FormControl.Feedback> : null}
                    </Col>
                </FormGroup>
                <FormGroup>
                    {
                        buttonprocess ?
                            <Button title='Submit' style={{ cursor: 'progress' }} disabled >Submit</Button>
                            :
                            <Button title='Submit' onClick={e => { e.preventDefault(); submitlogin() }}  >Submit</Button>
                    }
                </FormGroup>
            </Form>
            <div style={{ textAlign: 'center' }}>
                <Link to='/login'> Login </Link>
            </div>
        </div >
    )
}

export default Register;