import React, { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap';
import request from '../../service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
    let [count, setCount] = useState({ active: 0, inactive: 0 });

    let getCount = () => {
        request('/admin/user/questions/dashboard', 'GET', {}).then(res => {
            if (res && res.data && +res.data.status === 1) {
                setCount({
                    ...count, active: res.data.response && res.data.response.active ? res.data.response.active : 0,
                    inactive: res.data.response && res.data.response.inactive ? res.data.response.inactive : 0
                });
            } else if (res && res.data && res.data.status === '00') {
                localStorage.removeItem('userAuthToken')
                return window.location = '/login';
            }
        }).catch(err => {
            console.log('err in dashboard', err);
            toast.error('Something went wrong');
        });
    };

    useEffect(() => {
        getCount();
    }, []);

    return (
        <div>
            <h2> Dashboard </h2>
            <ToastContainer autoClose={2000} closeOnClick={true} />
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>
                        Active
                    </Card.Title>
                    <Card.Text>
                        {count.active}
                    </Card.Text>
                </Card.Body>
            </Card>
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>
                        In  Active
                    </Card.Title>
                    <Card.Text>
                        {count.inactive}
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Dashboard
