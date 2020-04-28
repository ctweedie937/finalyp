import React, { Component } from "react";
import { Grid, GridColumn, Header, Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import cookie from "react-cookies";
import { db, auth } from "../../../firebase";
import { ArticlesList } from "../../components/ArticlesList"


class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeItem: "home",
            loggedIn: false,
            user: {},
            articles: [],
            other_articles: [],
        }
        this.signOut = this.signOut.bind(this);
    }

    componentDidMount() {
        let getUID = cookie.load('user')
        this.setState({ user: getUID })

        if (getUID !== undefined) {
            this.setState({ loggedIn: true })
            if (getUID.email !== undefined) {
                this.unsubscribeArticles = db.collection("analysedArticles").where("owner", "==", getUID.email).onSnapshot(this.articles_update)
            }
        }
    }

    componentWillUnmount() {
        this.loggedIn = this.state.loggedIn;
        if (this.unsubscribeArticles) {
            this.unsubscribeArticles();
        }
    }

    // updates article list
    articles_update = (snapshot) => {
        console.log("articles update")
        const articles = snapshot.docs.map(docSnapshot => {
            const docData = docSnapshot.data();
            console.log(docData)
            return ({
                content: docSnapshot.content,
                headline: docData.headline,
                url: docData.url,
                fake: docData.fake,
                users: docData.users,
                key: docSnapshot.id,
            })
        });
        this.setState({
            articles: articles
        })
    };

    // signs user out
    signOut = () => {
        auth.signOut()
            .then(() => {
                console.log("Sign out successful")
                this.setState({ loggedIn: false })
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

        if (cookieUser) {
            signInStatus = <Menu.Item
                name="Logout"
                active={activeItem === "homepage"}
                as={Link} to="/login"
                onClick={this.signOut}
            />

            prevArticles =
                <div>
                    <Header textAlign="center" name="prevArticles">Previous articles</Header>
                    <Menu secondary fluid vertical style={{ overflow: 'auto', maxHeight: 100 }}>
                    <ArticlesList articles={this.state.articles}/>
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
                        <Header name="mainTitle" size="huge" textAlign="center">Fake News Detector</Header>
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