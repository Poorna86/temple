import React from 'react';
import {Navbar, Nav, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import { history } from '../../routers/AppRouter';
import { userLogin } from '../../actions/auth';

const UserDashboardNavBar = (props) => {

    const handleLogout = () => {
        axios
            .post('http://localhost:3000/userlogout')
            .then((response) => {
                console.log('response: ', response)
                history.push("/")
            })
            .catch(err => {
                console.log('err response data: ', err)
                //const {merchantid} = err.response.data
            })
    }        
    return(
        <div>
            <Navbar bg="light" expand="lg" className='header_text-positioning'>
                <Navbar.Brand>
                    <Nav.Link as={Link} to="/dashboard" className='nav_link-padding'>
                        <img src='/images/temple_png.png' height='30px' />
                    </Nav.Link>
                </Navbar.Brand>
                <Nav.Link as={Link} to="/dashboard">
                    <Nav className="mr-auto" > User Temple Management </Nav>
                </Nav.Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/userdashboard">Home</Nav.Link>
                        <Nav.Link as={Link} to="/userdonorreceipt">Donation Form</Nav.Link>
                        {history.location.pathname === '/userprofileedit' ? '' :
                                                        <Nav.Link as={Link} to="/userprofileedit">
                                                            Profile Edit
                                                        </Nav.Link>
                        }
                        <span className="logoutAll" onClick={handleLogout}>Logout</span>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}

const mapDispatchToProps = (dispatch) => ({
    userLogin: (loginStatus) => dispatch(userLogin(loginStatus))
 })

export default connect(undefined, mapDispatchToProps)(UserDashboardNavBar);
