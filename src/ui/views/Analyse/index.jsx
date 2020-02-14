import React,  {Component} from "react";
import 'semantic-ui-css/semantic.min.css';
import { Grid, GridColumn, Header, Segment, Input } from "semantic-ui-react";

const websiteLayout = () => {
    return (
        <Grid celled divided>
            <Grid.Row>
                <Grid.Column width={2}>
                    <Header size="huge" textAlign="center">Logo</Header>
                </Grid.Column>
                <Grid.Column width={13}>
                    <Header size="huge" textAlign="center">App name</Header>    
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                <GridColumn width={2}>
                    <Header size="medium" textAlign="center">Analyse</Header>
                    <Header size="medium" textAlign="center">Analyse</Header>
                    <Header size="medium" textAlign="center">Analyse</Header>
                    <Header size="medium" textAlign="center">Analyse</Header>
                </GridColumn>
            </Grid.Row>

            <Grid.Row>
               <GridColumn width={15}>
                    <Segment>
                        <Input action="Analyse" placeholder="Analyse..."/>
                    </Segment>
                </GridColumn>
            </Grid.Row>
        </Grid>
    )
}

export default websiteLayout;