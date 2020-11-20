import React, { Component,Fragment,useState  } from 'react'
import {
  Button, Card, CardBody, CardGroup, Col, Container, Form, Input,
  InputGroup, InputGroupAddon, InputGroupText, Row, FormFeedback, Alert
} from 'reactstrap';
import { UncontrolledTooltip  } from 'reactstrap';
import * as constants from "../../../constants";
import axios from "axios";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom'
import {forgotPasswordAction} from "./../../../redux/actions/home"
import Popup from "./Popup";
import queryString from 'query-string'
import { AppFooter } from "@coreui/react";
const DefaultHeader = React.lazy(() => import("./header"));
const DefaultFooter = React.lazy(() =>
  import("../../../containers/Layout/Footer")
);

export default class ResetPassword extends Component {
  
   constructor(props){
        super(props);
        this.state = {
            password:"",
            confirmedPassword:"",
            redirect:false,
            invalidPassword:false,
            error: 'none'
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.closeSucess = this.closeSucess.bind(this);
    }

    componentWillUnmount(){
      this.setState({
        invalidPassword:false
      })
    }

    onSubmit(event){
        event.preventDefault();
        let password = this.state.password;
        let confirmedPassword = this.state.confirmedPassword;
        const values = queryString.parse(this.props.location.search)
        const token = values.token
        if(password !== confirmedPassword || password === "" || confirmedPassword === ""){
            this.setState({
                invalidPassword:true
            })
        }
        else{
            this.setState({
                password:password
            })
                
        const object = {
            token : token,
            password : this.state.password
        }

        axios.post(constants.BASE_URL + '/api/auth/user/resetPassword', object)
        .then(res => {
          console.log(res)
           this.setState({
                 redirect:true
             })
            if(res.status === 200){
              console.log(res.data.message)
            this.setState({
              message:res.data.message
            })
        }
      })
      .catch(error => {
       this.setState({
         redirect:true,
         message:error.response.data.message
       })
      }
    );
        }
    
    }
    closeSucess = () => {
    this.setState({
      sucessMsg: !this.state.sucessMsg
    });
  };
    
  
  
    render() {
         return (
            <Fragment>
        <DefaultHeader />

      <div className="app flex-row align-items-center">
          {this.state.redirect && (
          <Popup close={this.closeSucess} message={this.state.message} />
        )}
    <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup style={{ width: "60%", marginLeft: "18%"}}>

                <Card className="p-4">

                  <CardBody>
                    <Form onSubmit={this.onSubmit}>
                      <h1>Reset Your Password</h1>
                      <p className="text-muted">Enter your new password below</p>
                        <UncontrolledTooltip placement="right" target="helpMessage">
                        Your password must be at least 6 characters long and include a character and a number.
                        </UncontrolledTooltip> 
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                        
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password"
                          placeholder="New Password" autoComplete="password"
                          invalid={this.state.invalidPassword}

                          value={this.state.password} onChange={(event) => {
                            this.setState({
                              password: event.target.value,
                              invalidPassword: false,
                              error: 'none'
                            })
                          }}
                        />
                        
                        <p><span style={{textDecoration: "underline", color:"black", marginLeft: "15px"}} href="#" id="helpMessage">
                        <i class="fa fa-question-circle" aria-hidden="true"></i>
                        </span></p>
                        <UncontrolledTooltip placement="right" target="helpMessage">
                        Your password must be at least 6 characters long and include a character and a number.
                        </UncontrolledTooltip> 
                      </InputGroup>
                    <InputGroup className="mb-4"> 
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input  type="password"
                        style={{ marginRight: "25px"}}
                          placeholder="Confirm New Password" 
                          invalid={this.state.invalidPassword}
                          value={this.state.confirmedPassword} onChange={(event) => {
                            this.setState({
                              confirmedPassword: event.target.value,
                              invalidPassword: false,
                              error: 'none'
                            })
                          }}
                        />
                        <FormFeedback invalid={this.state.invalidPassword.toString()}>Please enter same password</FormFeedback>

                        </InputGroup>
                      <Row>
                      <Col xs="3"></Col>
                        <Col xs="6">
                          <Button color="primary" className="px-4">Reset Password</Button>
                        </Col> 
                      <Col xs="3"></Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
        
      </div>
         <AppFooter className="customFooter">
          <DefaultFooter />
        </AppFooter>
      </Fragment>
    );
    }
}
