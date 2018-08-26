import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';

class App extends Component {
  constructor(props) {
    super(props);
    this.mapMarkers = [];
    this.infoWindow = null;
    this.state = {
      places: [],
      selectedItem: null,
      query: ''
    }
  }

  componentDidMount() {
    this.loadPlaces();
  }

  componentDidUpdate() {
    if (this.state.selectedItem) {
      let selectedMarker = this.mapMarkers.find(m => {
        return m.id === this.state.selectedItem.venue.id;
      });
      this.showInfoWindow(selectedMarker);
    }
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

    // Get data for coffee places from Foursquare
    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        console.log(response.data.response.groups[0].items);
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
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 52.637106, lng: -1.139771},
      zoom: 15
    });

    // Creates the InfoWindow
    this.infoWindow = new window.google.maps.InfoWindow({});
    let bounds = new window.google.maps.LatLngBounds();

    this.state.places.forEach(item => {

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
      this.mapMarkers.push(marker);
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

    let filterPlaces
    if (this.state.query) {
      const match = new RegExp(escapeRegExp(this.state.query), 'i')
      filterPlaces = this.state.places.filter((place) => match.test(place.venue.name))
    } else {
      filterPlaces = this.state.places;
    }

    return (
      <div className="App">
        <div id="map"></div>
        <aside>
          <div className="sideBar">
            <div className="places-list">
              <input
                type="text"
                placeholder="Search places"
                aria-label="Type to look for a place"
                value={this.state.query}
                onChange={(e) => this.refreshQuery(e.target.value)}
              />
              <ul aria-labelledby="Places list">
                {filterPlaces.map((place, index) => (
                  <li
                    key={index}
                    tabIndex={0}
                    role="button"
                    onClick={e => this.showInfo(e, place)}
                  >
                    <p>{place.venue.name}</p>
                    <p>{place.venue.location.address}</p>
                  </li>
                ))}
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
