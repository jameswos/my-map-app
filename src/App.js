import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';

let filterPlaces

class App extends Component {
  constructor(props) {
    super(props);
    this.infoWindow = null;
    this.state = {
      places: [],
      mapMarkers: [],
      selectedItem: null,
      query: ''
    }
  }

  componentDidMount() {
    this.loadPlaces();
  }

  componentDidUpdate() {
    if (this.state.selectedItem) {
      let selectedMarker = this.state.mapMarkers.find(m => {
        return m.id === this.state.selectedItem.venue.id;
      });
      this.showInfoWindow(selectedMarker);
    }
  }

  loadMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyCdU03TvjRBVim4B5U3qa95CuwbVJN4Q2E&callback=initMap");
    window.initMap = this.initMap;
    // If there is a problem with authentication - https://developers.google.com/maps/documentation/javascript/events#auth-errors
    window.gm_authFailure = function() {
      alert('Cannot load Google Maps! Please ensure that you have a valid Google Maps API key! Please go to https://developers.google.com/maps/documentation/javascript/get-api-key')
      }
  };

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

    // Get data for coffee places from Foursquare
    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          places: response.data.response.groups[0].items
        }, this.loadMap())
      })
      .catch(error => {
        alert("An error occurred fetching data from Foursquare: " + error);
      })
  }
  // Creates the map
  initMap = () => {
    let positions = [];

    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 52.637106, lng: -1.139771},
      zoom: 15
    });

    if (this.state.query) {
      const match = new RegExp(escapeRegExp(this.state.query), 'i')
      filterPlaces = this.state.places.filter((place) => result.test(place.venue.name))
    } else {
      filterPlaces = this.state.places;
    }

    // Creates the InfoWindow
    this.infoWindow = new window.google.maps.InfoWindow({});
    let bounds = new window.google.maps.LatLngBounds();

    filterPlaces.map(item => {

      // Create a marker
      const marker = new window.google.maps.Marker({
        position: {lat: item.venue.location.lat, lng: item.venue.location.lng},
        map: map,
        title: item.venue.name,
        animation: window.google.maps.Animation.DROP,
        id: item.venue.id
      });

      // Click on a marker
      marker.addListener('click', () => {
        this.showInfoWindow(marker);

      });
      bounds.extend(marker.getPosition())

      // Get new markers into the state
      positions.push(marker);
    });
    map.fitBounds(bounds);
  }

  showInfoWindow(marker) {
    this.infoWindow.setContent(marker.title);
    this.infoWindow.open(marker.map, marker);
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(window.google.maps.Animation.BOUNCE);
      setTimeout(() => {
        marker.setAnimation(null);
      }, 750);
    }
  }

  // https://stackblitz.com/edit/react-qubgz4?file=App.js
  showInfo(e, selectedItem) {
    this.setState({
      "selectedItem": selectedItem
    });
  }

  refreshQuery = (query) => {
    this.setState({
      query: query.trim()
    });
  }

  render() {

    const placeList = filterPlaces.map((place, index) => {
      return (
        <li
          key={index}
          tabIndex={0}
          role="button"
          onClick={e => this.showInfo(e, place)}
        >
          <p>{place.venue.name}</p>
          <p>{place.venue.location.address}</p>
        </li>
      )
    })

    return (
      <div className="App">
        <div id="map"></div>
        <aside>
          <div className="sideBar">
            <div className="places-list">
              <input
                type="text"
                placeholder="Filter the places"
                aria-label="Type to filter the places"
                value={this.state.query}
                onChange={(e) => this.refreshQuery(e.target.value)}
              />
              <ul
                aria-labelledby="Places list"
                onChange={this.handleChange}
                >
                {placeList}
              </ul>
            </div>
          </div>
        </aside>
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
