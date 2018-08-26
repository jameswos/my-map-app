import React, { Component } from 'react';

class SideBar extends Component {

  state = {
    query: '',
    filteredMarkers: [],
    selectedItem: null
  }

  showInfo(e, selectedItem) {
    this.setState({
      "selectedItem": selectedItem
    });
  }

  componentDidMount() {
    this.setState({
      filteredMarkers: this.props.mapMarkers
    });
  }



  render() {
    return (
      <aside>
        <div className="sideBar">
          <div className="places-list">
            <input type="text" placeholder="Search for a place" aria-label="Type to look for a pace" value={this.state.query} onChange={(e) => this.refreshQuery(e.target.value)}/>
            <ul aria-labelledby="Places list">
              {this.props.places.map((place) => (
                <li
                  key={place.venue.id}
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
    );
  }
}



export default SideBar;
