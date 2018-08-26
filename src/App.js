import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {

  componentDidMount() {
    this.loadMap();
  }

  loadMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyCdU03TvjRBVim4B5U3qa95CuwbVJN4Q2E&callback=initMap");
    window.initMap = this.initMap;
  }

  loadPlaces = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore";
  }

  initMap = () => {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 52.637106, lng: -1.139771},
      zoom: 13
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

export default App;

function loadScript(url) {
  // https://stackoverflow.com/questions/34779489/rendering-a-google-map-without-react-google-map
  let ref = window.document.getElementsByTagName('script')[0];
  let script = window.document.createElement('script');

  script.src = url;
  script.async = true;
  script.defer = true;
  ref.parentNode.insertBefore(script, ref);

  script.onerror = function () {
    document.write('Load error: Google Maps')
  };
}
