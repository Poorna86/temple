import React from 'react';
import {Navbar, Nav} from 'react-bootstrap';
import { Link } from 'react-router-dom';

export class HomeNavBarPage extends React.Component {
    
    render() {
        return (
            <div>
                <Navbar className="Navbar-bg" bg="light" variant="light" expand="lg">
                    <Navbar.Brand>
                        <Nav.Link as={Link} to="/dashboard" className='nav_link-padding'>
                            <img src='/images/temple_png.png' height='30px' />
                        </Nav.Link>
                    </Navbar.Brand>
                    <Nav href="/" className="center-navbar adjust_home-header">Temple Management</Nav>
                </Navbar>
            </div>
        )
    }
}