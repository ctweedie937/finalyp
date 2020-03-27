import React, { Component } from "react";
import 'semantic-ui-css/semantic.min.css';
import { List, Divider } from "semantic-ui-react";

export class ArticlesList extends Component {
    state = {
        articles: this.props.articles,
    };

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.articles !== prevProps.articles) {
            this.setState({ articles: this.props.articles })
        }
    }

    render_articles() {
        if(this.state.articles !== undefined) {
          return this.state.articles.map((article) => {
          return (<List.Item key={article.id} as="ul">{article.headline} - {(article.fake)*100}% fake</List.Item>)
        })  
        }
        
    }

    render() {
        return (
            <List bulleted>
                {this.render_articles()}
            </List>
        )
    }
}


export default ArticlesList;