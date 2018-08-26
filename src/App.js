import React, { Component } from 'react';
import './App.css';

class App extends Component {

  initMap = () => {
    const map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    });
  }
  
  render() {
    return (
      <div className="App">
        <div id="map"></div>
      </div>
    );
  }
}

/*
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCdU03TvjRBVim4B5U3qa95CuwbVJN4Q2E&callback=initMap" async defer></script>
*/

export default App;
