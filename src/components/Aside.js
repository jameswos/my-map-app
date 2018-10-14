import React, { Component } from 'react'

class Aside extends Component {

  queryUpdate() {
    const val = this.myValue.value
    this.props.filterUpdate(val)
  }

  render() {

    const placeList = this.props.filterPlaces.map((place, index) => {
      return (
        <li
          key={index}
          tabIndex={0}
          role="button"
          onClick={e => this.props.showInfo(e, place)}
        >
          <p>{place.venue.name}</p>
          <p>{place.venue.location.address}</p>
        </li>
      )
    })

    return(
      <aside>
        <div className="sideBar">
          <div className="places-list">
            <input
              type="text"
              placeholder="Filter the places"
              aria-label="Type to filter places"
              ref={ (value) => { this.myValue = value } }
              onChange={this.queryUpdate.bind(this)}
            />
            <div className="sidebar-attribution" role="contentinfo" tabIndex="-1">
              <p>Third-party data provided by Google Maps</p>
              <p> and Foursquare</p>
            </div>
            <ul
              aria-labelledby="Places list"
            >
              {placeList}
            </ul>
          </div>
        </div>
      </aside>
    )
  }
}

export default Aside
