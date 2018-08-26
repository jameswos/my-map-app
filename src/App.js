import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {

  state = {
    places: []
  }

  componentDidMount() {
    this.loadPlaces();
  }

  loadMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyCdU03TvjRBVim4B5U3qa95CuwbVJN4Q2E&callback=initMap");
    window.initMap = this.initMap;
  }

  loadPlaces = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?";
    const parameters = {
      client_id: "GVJY0ASSIKQZXNLSH3SUTUP0QHJPIX4HXNW4SH2NNAHTEJP2",
      client_secret: "5A3ANB4RL11MWKHBA2W0KYGKDIRHERLL1XRZE3JEH1BUS4V5",
      v: "20180323",
      query: "coffee",
      near: "Leicester, UK",
      limit: 5
    }

    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          places: response.data.response.groups[0].items
        }, this.loadMap())
      })
      .catch(error => {
        console.log("ERROR!! " + error);
      })
  }
  // Creates the map
  initMap = () => {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 52.637106, lng: -1.139771},
      zoom: 15
    });

    // Creates the InfoWindow
    let infowindow = new window.google.maps.InfoWindow();

    this.state.places.map(myPlace => {

      let contentString = `${myPlace.venue.name}`;

      // Create a marker
      let marker = new window.google.maps.Marker({
        position: {lat: myPlace.venue.location.lat, lng: myPlace.venue.location.lng},
        map: map,
        title: myPlace.venue.name
      });

      // Click on a marker
      marker.addListener('click', () => {

        // Change the content
        infowindow.setContent(contentString);

        // Open an infowindow
        infowindow.open(map, marker);
      });

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
