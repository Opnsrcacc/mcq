import React from 'react';
import { Col, Button } from 'react-bootstrap';
import request from '../service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Header() {
    let logoutfun = () => {
        request('/admin/user/logout', 'patch', {}).then(res => {
            if (res && res.data && +res.data.status === 1) {
                localStorage.removeItem('userAuthToken');
                toast.success(res.data.response);
                setTimeout(() => {
                    return window.location = '/login';
                }, 500);
            } else if (res && res.data && res.data.status === '00') {
                localStorage.removeItem('userAuthToken');
                return window.location = '/login';
            } else {
                toast.error(res.data.response);
            }
        }).catch(err => {
            console.log("err /admin/user/logout", err);
            toast.error('Something went wrong');
        })
    };

    return (
        <div className="header">
            <ToastContainer autoClose={2000} closeOnClick={true} />
            <Col xs={12} className='logout-button' >
                <Button title='Logout' variant='info' onClick={e => { e.preventDefault(); logoutfun(); }}  >Logout</Button>
            </Col>
        </div>
    )
}

export default Header
