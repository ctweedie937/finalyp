import React, {Component} from "react";
import { Grid, GridColumn, Header, Menu, Divider } from "semantic-ui-react";
import { Link } from "react-router-dom"
import cookie from "react-cookies";
import { auth } from "../../../firebase";
import { db } from "../../../firebase.js";
import { ArticlesList } from "../../components/ArticlesList"

class Help extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeItem: "help",
            loggedIn: false,
            user: {},
        }
    }

    componentDidMount() {
        let getUID = cookie.load('user')
        this.setState({user: getUID})

        if (getUID !== undefined) {
            this.setState({ loggedIn: true })
            if (getUID.email !== undefined) {
                this.unsubscribeArticles = db.collection("analysedArticles").where("owner", "==", getUID.email).onSnapshot(this.articles_update)
            }
        }

        this.signOut = this.signOut.bind(this);
    }

    componentWillUnmount() {
        this.loggedIn = this.state.loggedIn;
    }

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

    signOut = () => {
        auth.signOut()
            .then(() => {
                console.log("Sign out successful")
                this.setState({loggedIn: false})
                cookie.remove('user', { path: '/' })
            }).catch(() => {
                console.log("Sign out unsuccessful")
            })
    }

    render() {

        const { activeItem } = this.state;
        let prevArticles, signInStatus;

        let cookieUser = cookie.load('user')

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
                <Menu secondary fluid vertical style={{ overflow: 'auto', maxHeight: 100 }}>
                <ArticlesList articles={this.state.articles}/>
                </Menu>
                <Divider />
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
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Header size="huge" textAlign="center"></Header>
                    </Grid.Column>
                    <Grid.Column width={13}>
                        <Header size="huge" textAlign="center">Fake News Detector</Header>
                    </Grid.Column>
                </Grid.Row>

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
                    <GridColumn width={13}>
                        <Grid padded>
                            <Grid.Row>
                                <Header as="h1">Help</Header>
                            </Grid.Row>

                            <Grid.Row>
                                <Header as="h3">Not sure how to use the tool? See below for some common questions about it.</Header>
                            </Grid.Row>

                            <p></p>

                            <Grid.Row>
                                <Header as="h5">How do I analyse an article?</Header>
                            </Grid.Row>
                            <Grid.Row>
                                <p>To analyse an article, click Analyse in the menu bar.</p>
                            </Grid.Row>

                            <p></p>
                            <br></br>
                            
                            <Grid.Row>
                                <Header as="h5">How accurate is the analysis?</Header>
                            </Grid.Row>
                            <Grid.Row>
                                <p>
                                    The tool makes use of Machinebox's Fakebox to estimate the "fakeness" of the article, which uses AI to classify keywords from
                                    the text. It analyses keywords that may sway the score one way or another (such as the use of emotive language), and gives the
                                    words for each section (Title and Content) a score between 0.1 and 1 based on these keywords. This website then averages these
                                    scores to give the result displayed.

                                    <br/>
                                    <br/>

                                    Unfortunately due to the nature of detecting fake news, it's hard to be completely accurate. Some articles are more suceptible to
                                    this, such as articles that are:
                                    <ul>
                                        <li>
                                            satirical or parody
                                        </li>
                                        <li>
                                            opinion pieces
                                        </li>
                                    </ul>
                                    

                                    This means that although it may not be totally accurate, it should give the user a good idea on whether to trust the article or not (~95% of the time).
                                </p>
                            </Grid.Row>
                            
                            <p></p>
                            <br></br>
                            
                            <Grid.Row>
                                <Header as="h5">Why does the domain name (URL) not factor into the result?</Header>
                            </Grid.Row>
                            <Grid.Row>
                                <p>
                                    It is hard to guess what the chances of the website is writing fake news is. This is because a website could write both opinion
                                    and news pieces. Also, it is hard to not factor bias into what domain is "fake news"-oriented and what news sites are foused on
                                    providing facts, for example, some left-wing news sites might see right-wing news sites as "fake news". 
                                    Therefore, it is easiest to just give a verbal description of what the website is about.
                                </p>
                            </Grid.Row>
                            
                        </Grid>
                    </GridColumn>
                </Grid.Row>
            </Grid>
        )
    }
}

export default Help