import React, { Component } from 'react';
import './App.css';

class App extends Component {

  componentDidMount() {
    this.loadMap();

  }

  loadMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyCdU03TvjRBVim4B5U3qa95CuwbVJN4Q2E&callback=initMap");
    window.initMap = this.initMap;
  }

  initMap = () => {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 52.637106, lng: -1.139771},
      zoom: 13
    });
    const leicester = {lat: 52.637106, lng: -1.139771};
    const marker = new window.google.maps.Marker({
      position: leicester,
      map: map,
      title: 'First marker!'
    });
    const infowindow = new window.google.maps.InfoWindow({
      content: 'Hello Leicester!'
    });
    marker.addListener('click', () => {
      infowindow.open(map, marker);
    });
  }

  let locations = [
    {title: 'King Power Stadium', location: {lat: 52.620483, lng: -1.143198}},
    {title: 'King Richard III Visitor Centre', location: {lat: 52.634304, lng: -1.135969}},
    {title: 'Highcross Leicester Shopping Centre', location {lat: 52.636843, lng: -1.136423}},
    {title: 'Grounded Kitchen UK', location: {lat: 52.618238, lng: -1.117096}},
    {title: 'National Space Centre', location: {lat: 52.654065, lng: -1.132293}}
  ]

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
