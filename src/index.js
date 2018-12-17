
import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import './index.css';
import Map from './Map.jsx'

import * as serviceWorker from './serviceWorker';


function fin(){
  console.log("fin")
  
}

class Mapp extends Component {
  render() {
    return (
      <div className="App">

        <Map/>

      </div>
    );
  }
}

ReactDOM.render(
    <Mapp className="app" />, 
    document.getElementById('root'),
    fin()
    
);



serviceWorker.unregister();

