import React,  {Component} from "react";
import { Grid } from "semantic-ui-react";

const websiteLayout = () => {
    <Grid celled>
        <Grid.Row>
            <Grid.Column width={3}>
                <h1>"Logo"</h1>
            </Grid.Column>
            <Grid.Column width={15}/>
        </Grid.Row>
    </Grid>
}