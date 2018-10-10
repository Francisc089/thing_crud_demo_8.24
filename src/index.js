import React, { Component } from 'react';
import { render } from 'react-dom';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import axios from 'axios';

class ThingCreate extends Component {
  constructor () {
    super();
    this.state = {
      name : '', 
      error : false
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  handleChange(ev) {
    const change = {};
    change[ev.target.name] = ev.target.value;
    console.log(change);
    this.setState(change);
  }

  onSave(ev) {
    ev.preventDefault() //prevents form from submitting - page refreshing
    this.props.createThing(this.state)
      .then(() => this.props.history.push('/things'))
      .catch(() => this.setState({ error : true }))
  }

  render () {
    console.log(this.props);
    return (
      <form onSubmit={this.onSave}>
        <div>
          <input name='name' value={this.state.name} onChange={ this.handleChange }/>
        </div>
        <button type='submit' disabled={!this.state.name}>Save</button>
        {
          this.state.error ? ('Error: Name already entered') : (null)
        }
      </form>
    )
  }
}
const Things = ({ things }) => {
  return (
    <ul>
      {
        things.map( thing => <li key={thing.id}>{thing.name}</li>)
      }
    </ul>
  )
}

class App extends Component {
  constructor () {
    super();
    this.state={
      things : []
    };
    this.createThing = this.createThing.bind(this);
  }

  createThing (thing) {
    return axios.post('/api/things', thing)
      .then( response => response.data )
      .then( thing => this.setState({ things : [...this.state.things, thing]}))
  }

  componentDidMount() {
    axios.get('/api/things')
      .then( response => response.data )
      .then( things => this.setState({ things }))
  }
  render () {
    const { things } = this.state;
    return (
      <Router>
        <div>
          <ul>
            <li><Link to='/things'>Users ({ things.length })</Link></li>
            <li><Link to='/things/create'>Create a Thing</Link></li>
          </ul>
          <Route exact path='/things' render={() => <Things things={things} />} />
          <Route exact path='/things/create' render={({ history }) => <ThingCreate createThing={this.createThing} history={history}/>} />
        </div>

      </Router>
    );
  }
}
//history object allows me to change the path, which changes the route
const root = document.getElementById('root');
render(<App />, root);