import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import App from './App';
import Stock from './Show_Stock'
import Login from './UserLogin'
import reportWebVitals from './reportWebVitals';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(

  <React.StrictMode>
    <Container className="p-3">
      <Row>
        <Col>
          <Stock />
          <Login />
        </Col>
      </Row>
    </Container>
  </React.StrictMode>,
  document.getElementById('googleButton')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
