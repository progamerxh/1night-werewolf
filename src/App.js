import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import Signin from './component/signin';
import Home from './component/home';
import requireAuth from './component/requireAuth'
import './App.css'

class App extends Component {
 
  render() {
    return (
      <div className="Container">
        <Route path='/' component={Signin} />
        <Route path='/' component={requireAuth(Home)} />
      </div>
    );
  }
}

export default App;