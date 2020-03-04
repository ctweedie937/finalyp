import React, { Component } from "react";
import { Grid, GridColumn, Header, Segment, Button, Menu, Icon, Form, Popup, Modal, Input, Container } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { auth, provider, db } from "../../../firebase";
import cookie from "react-cookies";
// import history from "../../history";

// TODO: Fix logincheck being fired on load

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeItem: "login",
            loggedIn: false,
            email: "",
            password: "",
            displayName: "",
            user: {},
        }

        if((this.state.user)!== null) {
            this.setState({loggedIn: true})
        } else {
            this.setState({loggedIn: false})
        }

        this.handleChange = this.handleChange.bind(this);

        this.logInCheck = this.logInCheck.bind(this);
        this.logInGoogle = this.logInGoogle.bind(this);
        this.addUserToDB = this.addUserToDB.bind(this);
        this.signUp = this.signUp.bind(this);
        this.signInEmail = this.signInEmail.bind(this);

        console.log(this.state.user)
    }

    handleChange(e, type) {
        console.log(type)
        this.setState({
            [type]: e.value,
        });
    }

    componentDidMount() {
        let getUID = cookie.load('user')
        this.state =  { user: getUID }
    }

    componentWillUnmount() {
        this.loggedIn = this.state.loggedIn;
    }

    // adds user to db
    addUserToDB = (user) => {
        const uid = user.uid;

        // logs userID
        console.log("uid: ", uid)

        // adds to db
        db.collection("users").doc(uid).set({
            id: uid,
            email: user.email,
            displayName: user.displayName,
        }).then(() => {
            console.log("added")
        }).catch((err) => {
            console.error(err)
        });
    }

    // checks if login is successful
    logInCheck = () => {
        const user = this.state.user;
        console.log("check user: ", user)

        auth.onAuthStateChanged((user) => {
            if(user) {
                console.log("Sign in successful")
                this.setState({loggedIn: true})
                cookie.save('user', user, {path: '/'})
                this.props.history.push({pathname:'/', state: {loggedIn: this.state.loggedIn}})
                this.addUserToDB(user);
                
                return true
            } else {
                console.log("Sign in unsuccessful")
                return false
            }
        })
    }

    // google log in
    logInGoogle = () => {
        auth.signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                this.setState({user: user})               
                this.logInCheck();
            })
    }

    // email sign up
    signUp = () => {
        const email = this.state.email
        const password = this.state.password
        console.log("email: ", email)

        auth.createUserWithEmailAndPassword(email, password)
            .then((result) => {
                const user = result.user;
                this.setState({user: user})               
                this.logInCheck();
            })
    }

    // email sign in
    signInEmail = () => {
        const email = this.state.email
        const password = this.state.password

        console.log("email: ", email)

        auth.signInWithEmailAndPassword(email, password)
            .then((result) => {
                const user = result.user
                this.setState({user: user})
            })
    }

    signOut = () => {
        auth.signOut()
            .then(() => {
                console.log("Sign out successful")
            }).catch(() => {
                console.log("Sign out unsuccessful")
            })
    }


    render() {

        const { activeItem, loggedIn, email, password } = this.state;
        let prevArticle, signInStatus;

        if(loggedIn) {
            signInStatus = <Menu.Item
                name="Logout"
                active={activeItem === "homepage"}
                as={Link} to="/login"
                onClick={this.signOut.bind(this)}
            />

            prevArticle = <Container><Header>Previous articles</Header></Container>

        } else {
            signInStatus = <Menu.Item
                name="login"
                active={activeItem === "login"}
                as={Link} to="/login"
            />
        }

        return (
            <Grid celled divided>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Header size="huge" textAlign="center"></Header>
                    </Grid.Column>
                    <Grid.Column width={13}>
                        <Header size="huge" textAlign="center">Fake News Detector</Header>
                    </Grid.Column>
                </Grid.Row>

                {/* Nav */}
                <Grid.Row>
                    <GridColumn width={2}>

                        <Grid.Row>
                            <Menu fluid vertical>
                                <Menu.Item
                                    name="homepage"
                                    active={activeItem === "homepage"}
                                    as={Link} to="/"
                                />
                                <Menu.Item
                                    name="analyse"
                                    active={activeItem === "analyse"}
                                    as={Link} to="/analyse"
                                />

                                {signInStatus}
                                
                                <Menu.Item
                                    name="help"
                                    active={activeItem === "help"}
                                    as={Link} to="/help"
                                />
                            </Menu>
                        </Grid.Row>
                        
                        <Grid.Row>
                            {prevArticle}
                        </Grid.Row>

                    </GridColumn>

                    {/* Main */}
                    <GridColumn width={13}>
                        <Grid padded centered>

                            <Grid.Row>
                                <Grid padded centered>
                                    <Segment>
                                        <Form>
                                            <Grid.Row>
                                                <Header as="h1">Login</Header>
                                            </Grid.Row>

                                            <p></p>
                                            <Form.Field padded="true">
                                                <label>Email:</label>
                                                <input name="lEmail" onChange={this.handleChange}/>
                                            </Form.Field>

                                            {/* Google sign in */}
                                            <Button onClick={() => this.logInGoogle()}>Sign in with Google</Button>
                                            
                                            {/* Email sign up */}
                                            <Modal trigger={<Button>Sign up with your email</Button>} name="emailSignUp">
                                                <Modal.Header>Sign Up</Modal.Header>
                                                <Modal.Content>
                                                    <Form>
                                                        <Form.Field>
                                                            <label>Email:</label>
                                                            <Input name={email} placeholder="Email" onChange={(e, value) => this.handleChange(e.target.value, "email")}/>
                                                        </Form.Field>
                                                        <Form.Field>
                                                            <label>Password:</label>
                                                            <Input name={password} type="password" onChange={(e, value) => this.handleChange(value, "password")}/>
                                                        </Form.Field>

                                                        <Button 
                                                        type="submit"
                                                        // onClick={Link} to="/home"
                                                        onClick={this.signUp}
                                                        >
                                                            Login
                                                        </Button>
                                                    </Form>
                                                </Modal.Content>
                                            </Modal>

                                            <p></p>

                                            <Form.Field>
                                                <label>Password:</label>
                                                <input name="password" type="password" onChange={this.handleChange}/>
                                            </Form.Field>

                                            <Button type="submit" onClick={this.signInEmail}>
                                                Login
                                            </Button>

                                        </Form>
                                    </Segment>
                                </Grid>
                            </Grid.Row>

                            <Grid.Row>
                                Or, click Analyse to get started!&nbsp;<Popup trigger={<Icon name="info circle"></Icon>} content="Please note: it is not possible to view previous articles if you are not logged in" />
                            </Grid.Row>
                        </Grid>
                    </GridColumn>
                </Grid.Row>
            </Grid>
        )
    }
}

export default Login 