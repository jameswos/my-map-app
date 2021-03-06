import React, { Component } from 'react'
import './App.css'
import axios from 'axios'
import escapeRegExp from 'escape-string-regexp'
import Aside from './components/Aside'


class App extends Component {
  constructor(props) {
    super(props);
    this.infoWindow = null;
    this.state = {
      places: [],
      mapMarkers: [],
      selectedItem: null,
      query: '',
      map: '',
      searchedPlaces: [],
      searchedMarkers: []
    }
  }

  componentDidMount() {
    this.loadPlaces();
  }

  componentDidUpdate(nextProps, nextState) {
    if (nextState.selectedItem !== this.state.selectedItem) {
      let selectedMarker = this.state.mapMarkers.find(m => {
        return m.id === this.state.selectedItem.venue.id;
      });
      this.showInfoWindow(selectedMarker);
    }
  }

  loadMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyCdU03TvjRBVim4B5U3qa95CuwbVJN4Q2E&callback=initMap");
    window.initMap = this.initMap;
    // Shows alert when problem with auth, from: https://developers.google.com/maps/documentation/javascript/events#auth-errors
    window.gm_authFailure = function() {
      alert('Cannot load Google Maps! Please ensure that you have a valid Google Maps API key! Please go to https://developers.google.com/maps/documentation/javascript/get-api-key')
      }
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

    // Get data for coffee places from Foursquare
    // Help from https://www.youtube.com/playlist?list=PLgOB68PvvmWCGNn8UMTpcfQEiITzxEEA1
    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          places: response.data.response.groups[0].items,
          searchedPlaces: response.data.response.groups[0].items
        }, this.loadMap())
      })
      .catch(error => {
        alert("An error occurred fetching data from Foursquare: " + error);
      })
  }
  // Creates the map
  initMap = () => {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 52.637106, lng: -1.139771},
      zoom: 15
    });
    this.setState({
      map: map
    })

    // Creates the InfoWindow
    this.infoWindow = new window.google.maps.InfoWindow({});
    let bounds = new window.google.maps.LatLngBounds();

    this.state.places.forEach(item => {
      // Create a marker
      const marker = new window.google.maps.Marker({
        position: {lat: item.venue.location.lat, lng: item.venue.location.lng},
        map: this.state.map,
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
      this.state.mapMarkers.push(marker);
    });
    this.state.map.fitBounds(bounds);
  }

  // https://stackblitz.com/edit/react-qubgz4?file=App.js
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

  // help from simonswiss: https://www.youtube.com/watch?v=A590QnMxsYM & https://github.com/annjkai/FEND-nmap/blob/master/src/App.js
  filterUpdate(value) {
    this.setState({
      query: value
    })
    const { mapMarkers, places, query } = this.state
    if (value.length > 0) {
      const match = new RegExp(escapeRegExp(this.state.query), 'i')
      mapMarkers.forEach(marker => {
        return marker.setVisible(false)
      })
      this.setState({
        searchedPlaces: places
          .filter(place => {
            return match.test(place.venue.name)
          }),
        searchedMarkers: mapMarkers
          .filter(marker => {
            return match.test(marker.title)
          })
          .forEach(marker => {
            return marker.setVisible(true)
          })
      })
    } else {
      mapMarkers.map(marker => {
        return marker.setVisible(true)
      })
      this.setState({
        searchedPlaces: places,
        searchedMarkers: mapMarkers
      })
    }
  }

  render() {
    /*
    // Should I try to add something here to change the visibility of my markers???
    let filterPlaces
    if (this.state.query) {
      const match = new RegExp(escapeRegExp(this.state.query), 'i');
      filterPlaces = this.state.places.filter((place) => match.test(place.venue.name));
    } else {
      filterPlaces = this.state.places;
    }
    */

    return (
      <div className="App">
        <div id="map"></div>
        <Aside
          filterUpdate={this.filterUpdate.bind(this)}
          filterPlaces={this.state.searchedPlaces}
          showInfo={this.showInfo.bind(this)}
        />
      </div>
    )
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
