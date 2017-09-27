import React, { Component } from 'react';
import 'bulma/css/bulma.css';
import 'font-awesome/css/font-awesome.css';
import map from 'lodash/map';
import Card from './components/Card';
import SiteHeader from './components/SiteHeader';
import UserProfile from './components/UserProfile';
import PostQuestion from './components/PostQuestion';
import VoteScore from './components/VoteScore';
import {
  database,
} from './firebase';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPostMode: false,
      questions: [],
      currentUser: {},
    }
    this.onQuestionChange = database.ref('/questions').on('value', (snapshot) => {
      this.setState({
        questions: map(snapshot.val(), (question, id) => ({ id: id, ...question }))
      })
    })
  }

  togglePostingMode = () => this.setState({ isPostMode: !this.state.isPostMode })

  render() {
    return (
      <div>
        <SiteHeader
          togglePostingMode={this.togglePostingMode}
        />
        {this.state.isPostMode ? (
          <PostQuestion
            onClose={this.togglePostingMode}
          />
        ) : null}
        <div className="container">
          {this.state.questions.map((question) => {
            return (
              <div
                className="columns"
                key={question.id}
              >
                <div className="column">
                  <Card
                    firstOption={question.firstOption}
                    secondOption={question.secondOption}
                    firstOptionImage={question.firstOptionImage}
                    secondOptionImage={question.secondOptionImage}
                  />
                </div>
                <div className="column is-one-third">
                  <UserProfile
                    userImage={question.posted_by.photoUrl}
                    name={question.posted_by.name}
                    email={question.posted_by.email}
                  />
                  <VoteScore
                    questionId={question.id}
                    firstOptionVoteList={question.firstOptionVoteList || {}}
                    secondOptionVoteList={question.secondOptionVoteList || {}}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}
