import React from 'react';
import Card from "react-bootstrap/Card";
import {HomeNavBarPage} from './HomeNavBarBootstrap';
import StartLogin from './merch_components/StartLogin';

export class HomePage extends React.Component {

    render () {
        return(
            <div>
                <HomeNavBarPage />
                <Card className="card_border-none">
                  <Card.Body className="ml-4">This is some text within a card body.</Card.Body>
                  <Card className="card_center" style={{ width: '25rem' }}>
                    <Card.Header >
                        <h3 className="card_header">Login</h3>
                    </Card.Header>
                    <Card.Body>
                        <Card.Title className="card_title-header"></Card.Title>
                        <StartLogin />
                    </Card.Body>
                   </Card>
                </Card>
            </div>
        );
    }
}