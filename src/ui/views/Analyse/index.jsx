import React, { Component } from "react";
import 'semantic-ui-css/semantic.min.css';
import { Grid, GridColumn, Header, Segment, Input, Button, Menu, Progress, Container, Label, List } from "semantic-ui-react";
import { Link } from "react-router-dom"
import cookie from "react-cookies";
import { auth } from "../../../firebase";
import { db } from "../../../firebase.js";



class Analyse extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: "",
            content: "",
            url: "",
            activeItem: "analyse",
            score: "",
            trusted: "unassigned domain",
            colour: "grey",
            verdict: "",
            displayTitle: "",
            displayContent: "",
            displayUrl: "",
            loggedIn: false,
            user: {},
        }
        this.handleChange = this.handleChange.bind(this)
        this.httpReq = this.httpReq.bind(this)
        this.signOut = this.signOut.bind(this);
        this.saveArticle = this.saveArticle.bind(this);
    }

    // input change
    handleChange(e, type = "") {
        this.setState({
            [type]: e.value,
        });
    }

    componentDidMount() {
        let getUID = cookie.load('user')
        this.setState({user: getUID})

        if((this.state.user)!== null) {
            this.setState({loggedIn: true})
        }

        console.log("analyse  mount user:", this.state.user )
    }

    componentWillUnmount() {
        this.loggedIn = this.state.loggedIn;
    }

    // displays certain colour bar depending on rating
    displayColour() {
        const labelScore = this.state.score

        if (labelScore > 0 && labelScore <= 0.2) {
            this.setState({ colour: "green" })
        } else if (labelScore > 0.2 && labelScore <= 0.4) {
            this.setState({ colour: "olive" })
        } else if (labelScore > 0.4 && labelScore <= 0.6) {
            this.setState({ colour: "yellow" })
        } else if (labelScore > 0.6 && labelScore <= 0.8) {
            this.setState({ colour: "orange" })
        } else if (labelScore > 0.8) {
            this.setState({ colour: "red" })
        } else {
            this.setState({ colour: "grey" })
        }
    }

    // displays the verdict
    displayVerdict() {
        const verdict = this.state.score

        if (verdict > 0 && verdict <= 0.2) {
            this.setState({ verdict: "Very unlikely to be fake" })
        } else if (verdict > 0.2 && verdict <= 0.4) {
            this.setState({ verdict: "Unikely to be fake" })
        } else if (verdict > 0.4 && verdict <= 0.6) {
            this.setState({ verdict: "Neutral" })
        } else if (verdict > 0.6 && verdict <= 0.8) {
            this.setState({ verdict: "Likely to be fake" })
        } else if (verdict > 0.8) {
            this.setState({ verdict: "Very likely to be fake" })
        } else {
            this.setState({ verdict: "Enter data into the Title or Content fields to get a score" })
        }
    }

    // post request to fakebox
    httpReq = () => {        
        const http = new XMLHttpRequest();
        const postUrl = "http://localhost:8080/fakebox/check/"
        const { title, url, content } = this.state;
        let titleScore;
        let contentScore;
        let totalScore;
        let res;

        // sets states to default 
        this.setState({ 
            score: 0, 
            color: "", 
            trusted: "unassigned domain",
            displayTitle: "",
            displayContent: "",
            displayUrl: "",  
        })


        http.open("POST", postUrl)

        http.setRequestHeader("Content-Type", "application/json")

        const body = {
            "url": url,
            "content": content,
            "title": title,
        };

        http.onreadystatechange = (e) => {
            if (http.readyState === 4) {
                console.log(http.response)
                res = JSON.parse(http.response)

                // checks if title/content/domain is empty and handles logic accordingly
                if (res["title"]["score"] != null) {
                    titleScore = parseFloat(1 - (res["title"]["score"]).toFixed(1))
                    console.log(titleScore)
                }
                if (res["content"]["score"] != null) {
                    contentScore = parseFloat(1 - (res["content"]["score"]).toFixed(1))
                    console.log(contentScore)
                }
                if (res["domain"]["domain"] != null) {
                    let trusted = res["domain"]["category"]
                    this.setState({ trusted: trusted })
                    console.log(trusted)
                }

                console.log(titleScore, " ", contentScore)

                // totalScore calculated regardless of what fields filled in
                if (titleScore !== undefined && contentScore !== undefined) {
                    totalScore = ((titleScore + contentScore) / 2).toFixed(1)
                    console.log(totalScore)
                } else if (titleScore === undefined && contentScore !== undefined) {
                    console.log(contentScore)
                    totalScore = (contentScore.toFixed(1))
                    console.log(totalScore)
                } else if (titleScore !== undefined && contentScore === undefined) {
                    totalScore = (titleScore.toFixed(1))
                    console.log(totalScore)
                } else {
                    totalScore = 0;
                }

                const displayUrl = res["domain"]["domain"]

                console.log("totalScore: ", totalScore)
                this.setState({ 
                    score: totalScore,
                    displayTitle: title,
                    displayContent: content,
                    displayUrl: displayUrl,
                })

                this.displayColour()
                this.displayVerdict()
            }
        }

        console.log(body);

        http.send(JSON.stringify(body))
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

    saveArticle = () => {
        console.log("in saveArticle")
        // db.collection("analysedArticles").add({
        //     headline: this.state.title,
        //     content: this.state.content,
        //     url: this.state.url,
        //     fake: this.state.verdict,
        // }).then(() => {
        //     console.log("added to analysed articles")
        // }).catch((err) => {
        //     console.error(err)
        // }).then(() => {

        // });
    }

    render() {

        const { title, content, url, activeItem, score, trusted, colour, verdict, displayTitle, displayContent, displayUrl } = this.state;
        let prevArticles, signInStatus, saveButton;

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
            if(title || content) {
                saveButton = 
                <Grid.Column>
                    <Button onClick={this.saveArticle}>
                        Save
                    </Button>
                </Grid.Column>

            }

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
                        <Segment>
                            <Grid centered padded>
                                <Grid.Row>
                                    <Grid.Column width={4}>
                                        <Input name={title} placeholder="Title" onChange={(e, value) => this.handleChange(value, "title")} />
                                    </Grid.Column>
                                    <Grid.Column width={4}>
                                        <Input name={content} placeholder="Content" onChange={(e, value) => this.handleChange(value, "content")} />
                                    </Grid.Column>
                                    <Grid.Column width={4}>
                                        <Input name={url} placeholder="URL" onChange={(e, value) => this.handleChange(value, "url")} />
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Button onClick={this.httpReq}>Analyse!</Button>
                                    </Grid.Column>
                                </Grid.Row>

                                <Grid.Row>
                                    <Grid.Column>
                                        <Container textAlign="center">
                                            <p>
                                                Enter the article fields above. Please note: the website URL will not contribute to a score.
                                            </p>
                                        </Container>
                                    </Grid.Column>
                                </Grid.Row>

                                <Grid.Row>
                                    <Grid.Column>
                                        <Progress value={score} total="1" progress="percent" label={verdict} color={colour} />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Container>
                                            <Header textAlign="center">{displayTitle}</Header>
                                            <Header as="h5" textAlign="center">Domain: {displayUrl} <Label>{trusted}</Label></Header>
                                            <p>
                                                {displayContent}
                                            </p>
                                        </Container>
                                    </Grid.Column>
                                </Grid.Row>
                                {saveButton}
                            </Grid>
                        </Segment>
                    </GridColumn>
                </Grid.Row>

                <Grid.Row>

                </Grid.Row>
            </Grid>
        )
    }
}

export default Analyse;
