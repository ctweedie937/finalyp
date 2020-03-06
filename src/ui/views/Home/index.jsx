import React, { Component } from "react";
import { Grid, GridColumn, Header, Menu, Container, List } from "semantic-ui-react";
import { Link } from "react-router-dom";
import cookie from "react-cookies";
import { auth } from "../../../firebase";


class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeItem: "home",
            loggedIn: false,
            user: {},
        }
        this.signOut = this.signOut.bind(this);
        console.log("Home user: ", this.state.user)
    }

    componentDidMount() {
        let getUID = cookie.load('user')
        this.state =  { user: getUID }

        if((this.state.user)!== null) {
            this.setState({loggedIn: true})
        }

        console.log("login mount user:", this.state.user )
    }

    componentWillUnmount() {
        this.loggedIn = this.state.loggedIn;
    }

    signOut = () => {
        auth.signOut()
            .then(() => {
                console.log("Sign out successful")
                this.setState({loggedIn: false})
                cookie.remove('user', { path: '/' })
                
                console.log("signout user: ", this.state.user)
            }).catch(() => {
                console.log("Sign out unsuccessful")
            })
    }


    render() {

        const { activeItem } = this.state;
        let signInStatus, prevArticles;

        let cookieUser = cookie.load('user')
        console.log("home cookieUser: ", cookieUser)

        if(cookieUser) {
            signInStatus = <Menu.Item
                name="Logout"
                active={activeItem === "homepage"}
                as={Link} to="/login"
                onClick={this.signOut}
            />

            prevArticles = 
            <div>
                <Header textAlign="center">Previous articles</Header>
            <Menu secondary fluid vertical style={{overflow: 'auto', maxHeight: 100 }}>
                <List bulleted>
                    <List.Item>hi</List.Item>
                    <List.Item>hi</List.Item>
                    <List.Item>hi</List.Item>
                    <List.Item>hi</List.Item>
                    <List.Item>hi</List.Item>
                    <List.Item>hi</List.Item>
                    <List.Item>hi</List.Item>
                    <List.Item>hi</List.Item>
                    <List.Item>hi</List.Item>
                    <List.Item>hi</List.Item>
                </List>
            </Menu>
            </div>
            

        } else {
            signInStatus = <Menu.Item
                name="login"
                active={activeItem === "login"}
                as={Link} to="/login"
            />
        }

        return (
            <Grid celled divided>
                {/* Title */}
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Header size="huge" textAlign="center"></Header>
                    </Grid.Column>
                    <Grid.Column width={13}>
                        <Header size="huge" textAlign="center">Fake News Detector</Header>
                    </Grid.Column>
                </Grid.Row>               

                {/* Menu */}
                <Grid.Row>
                    <GridColumn width={2}>
                            {prevArticles}
                        <Menu secondary fluid vertical>
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

                            {/* Conditional sign in -- either login or logout appears as an option */}
                            {signInStatus}

                            <Menu.Item
                                name="help"
                                active={activeItem === "help"}
                                as={Link} to="/help"
                            />
                        </Menu>
                    </GridColumn>

                    {/* Page content */}
                    <GridColumn width={13}>
                        <Grid padded>
                            <Grid.Row>
                                <Header as="h1">Welcome!</Header>
                            </Grid.Row>

                            <Grid.Row>
                                <p>
                                    Welcome to the Fake News Detector. This tool is aimed to help you determine whether a news article is fake or is telling 
                                    you trustworthy information.
                                    Click tbe Analyse option in the menu to see what the verdict is on your article.
                                </p>
                            </Grid.Row>

                            <p></p>
                            <br></br>
                            
                            <Grid.Row>
                                <Header as="h3">About</Header>
                            </Grid.Row>
                            <Grid.Row>
                                <p>
                                    The Fake News Detector is an attempt to make sense of all of the news articles in the world. The news has became inundated
                                    with so-called "fake news" due to the internet giving people millions of news stories available to its users.
                                </p>
                            </Grid.Row>
                            

                            <Grid.Row>
                                Please note: it is not possible to view previous articles if you are not logged in.
                            </Grid.Row>
                        </Grid>
                    </GridColumn>
                </Grid.Row>
            </Grid>
        )
    }
}

export default Home