import React from 'react';
import {Navbar, Nav, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
//import { withRouter} from 'react-router-dom';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import { history } from '../../routers/AppRouter';
import { merchantLogin } from '../../actions/auth';

class DashboardHeader extends React.Component {

    handleLogout = () => {
        //event.preventDefault()
        history.push("/logout")
        
        axios
            .post('http://localhost:3000/logout')
            .then((response) => {
                console.log('response: ', response)
                const loginStatus = false
        
                this.props.merchantLogin(loginStatus)
                history.push("/")
                //window.location.reload(true)
            })
            .catch(err => {
                console.log('err response data: ', err)
                const {merchantid} = err.response.data
            })
    }
    render () {
        
        return(
            <div>
                <Navbar bg="light" expand="lg" className='header_text-positioning'>
                    <Navbar.Brand>
                        <Nav.Link as={Link} to="/dashboard" className='nav_link-padding'>
                            <img src='/images/temple_png.png' height='30px' />
                        </Nav.Link>
                    </Navbar.Brand>
                    <Nav.Link as={Link} to="/dashboard">
                        <Nav className="mr-auto" > Merchant Temple Management </Nav>
                    </Nav.Link>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        {/* <Form inline >
                            <ul className="mr-sm-2">
                                <li className="mr-4">
                                    <div className="profile-section">
                                        <img src="images/user.png" height='28px' alt=""></img>
                                        <div className="profile-content">
                                            <Nav.Link as={Link} to="/createuser">Create User</Nav.Link>
                                            <Nav.Link as={Link} to="/createevent">Create Event</Nav.Link>
                                            {history.location.pathname === '/profileedit' ? '' :
                                              <Nav.Link as={Link} to="/profileedit">
                                                Profile Edit
                                              </Nav.Link>
                                            }
                                            <span className="logoutAll" onClick={this.handleLogout}>Logout</span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </Form> */}
                        <Nav className="mr-auto">
                            <Nav.Link as={Link} to="/dashboard">Home</Nav.Link>
                            <Nav.Link as={Link} to="/createuser">Create User</Nav.Link>
                            <Nav.Link as={Link} to="/createevent">Create Event</Nav.Link>
                            {history.location.pathname === '/profileedit' ? '' :
                                                            <Nav.Link as={Link} to="/profileedit">
                                                                Profile Edit
                                                            </Nav.Link>
                            }
                            <span className="logoutAll" onClick={this.handleLogout}>Logout</span>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
           </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    merchantLogin: (loginStatus) => dispatch(merchantLogin(loginStatus))
 })

export default connect(undefined, mapDispatchToProps)(DashboardHeader);
//export default withRouter(DashboardHeader);
