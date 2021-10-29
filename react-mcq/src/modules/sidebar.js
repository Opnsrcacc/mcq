import React from 'react'
import { Nav, NavItem, NavLink } from 'react-bootstrap';

function Sidebar(props = {}) {
    let gotopage = (path = '') => {
        return props.history.push(path)
    };
    return (
        <div className="side-bar">
            <Nav className="col-md-2 d-none d-md-block bg-light sidebar" activeKey="/dashboard">
                <div className="sidebar-sticky"></div>
                <NavItem>
                    <NavLink onClick={e => gotopage('/dashboard')} >Dashboard</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink onClick={e => gotopage('/questions')} >Questions</NavLink>
                </NavItem>
            </Nav>
        </div>
    )
}

export default Sidebar
