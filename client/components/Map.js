// import React, { Component } from 'react';
// import Head from 'next/head'
// import GoogleMapReact from 'google-map-react';
// import { locations } from '../locations';
// import { GMAPS_API_KEY } from '../config';
// import MyGreatPlaceWithHover from '../components/my_great_place_with_hover';
// import { K_SIZE } from '../components/my_great_place_with_hover_styles';

// const mapCenter = {lat: 38.91131141655464, lng: -77.04375138092037};
// const marker = ({id}) => (
//   <div key={id} style={markerStyle}>
//     {id}
//   </div>
// )

// const markers = ( locations, handler ) => {
//   return locations.map(location => (
//     <MyGreatPlaceWithHover
//       text={location.id}
//       lat={location.lat}
//       lng={location.lng}
//     />
//   ))
// }

// class Map extends Component {

//   //
//   static defaultProps = {
//     center: mapCenter,
//     zoom: 1
//   };

//   render() {
//     return (
//       <div id='map'>
//         <GoogleMapReact
//           bootstrapURLKeys={{ key: GMAPS_API_KEY }}
//           defaultCenter={this.props.center}
//           defaultZoom={this.props.zoom}
//           hoverDistance={K_SIZE / 2}
//         >
//           {markers(locations)}
//         </GoogleMapReact>
//       </div>
//     );
//   }
// }



import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import GoogleMapReact from 'google-map-react';
import { GMAPS_API_KEY } from '../config';
import { postData } from '../helpers/fetch';


const SimpleReactComponent = ({ text }) => (
  <div style={{
    color: 'white',
    background: 'grey',
    padding: '15px 10px',
    display: 'inline-flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    transform: 'translate(-50%, -50%)'
  }}>
    {text}
  </div>
);


/**
 *
 *
 */
class Map extends Component {


  /**
   *
   *
   */
  static defaultProps = {
    center: {
      lat: 0.0,
      lng: 0.0
    },
    zoom: 3,
    zoomControl : false,
    disableDoubleClickZoom: true,
    panControl : false,
    rotateControl : false,
    scaleControl : false,
    mapTypeControl : false,
    streetViewControl : false,
    fullscreenControl : false,
    scrollwheel : false
  };



  /**
   *
   *
   */
  constructor(props) {
    super(props);
  }



  /**
   *
   * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions
   * @see https://developers.google.com/maps/documentation/javascript/controls#ControlOptions
   * @see https://developers.google.com/maps/documentation/javascript/examples/control-positioning
   */
  setMapOptions = (maps) => {
    return {
      draggableCursor: 'default',
      gestureHandling : 'auto',
      zoom : this.props.zoom,
      zoomControl : this.props.zoomControl,
      disableDoubleClickZoom: this.props.disableDoubleClickZoom,
      panControl : this.props.panControl,
      rotateControl : this.props.rotateControl,
      scaleControl : this.props.scaleControl,
      mapTypeControl : this.props.mapTypeControl,
      streetViewControl : this.props.streetViewControl,
      fullscreenControl : this.props.fullscreenControl,
      scrollwheel : this.props.scrollwheel
    }
  }



  /**
   *
   *
   */
  _onChange = (center, zoom, bounds, marginBounds) => {
    // this.props.onCenterChange(center);
    // this.props.onZoomChange(zoom);

    console.log('_onChange', center, bounds, marginBounds);
  }


  /**
   *
   *
   */
  _onClick = ({x, y, lat, lng, event}) => {
    console.log('_onClick', x, y, lat, lng, event);


    this._fetchTenkiWeatherData(lat, lng);
  }



  _fetchTenkiWeatherData = (lat, lng) => {

    const postData = {
        "latitude": lat,
        "longitude": lng
      };

    console.log('fetch', postData, JSON.stringify(postData));

    fetch('http://localhost:4040/api/tenki-forecast', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        })
        .then(response => {

          console.log('response: ', response.status, response);

          if (response.status !== 200){
            throw new Error('Bad response: ', response.status);
          }

          return response.json()
        })
        .then(responseBody => {
          //

          const defaultMessage = "Error retrieving weather data. Please try again";

          // const responseBody = response.json();
          console.log('success: ', responseBody, JSON.stringify(responseBody));


          // Handle expected errors

          if (!responseBody
              || (responseBody.status == 'error'
                  && !responseBody.message.includes('No results found')))
          {
            return defaultMessage;
          }


          // Click on ocean or bad coordinates
          if (responseBody.status == 'error'
              && responseBody.message.includes('No results found'))
          {
            return `No weather data was found for selected coordinates.`;
          }


          //
          const country = responseBody.data.country.name;
          const capital = responseBody.data.capital.name != 'not-found' ? responseBody.data.capital.name : '';
          const temperature = responseBody.data.weather.temperature +" ºC"
          const season = responseBody.data.weather.season;

          return `${country} - ${capital} - ${temperature} - ${season}`;
        })
        .then(message => {
          // message = `<div class='modal-content'></div>`;
          console.log('message: ', message);
        })
        .catch(error => {
          // Unexpected errors
          console.error('error: ', error);

          const defaultMessage = "<div class='modal-content'>"
                               + "  <p class='modal-header'>Error</p>"
                               + "  <p class='modal-body'>Error retrieving weather data. Please try again</p>"
                               + "</div>";
          console.log('messageError: ', defaultMessage);
        });

  }



  /**
   *
   *
   */
  _onChildClick = (key, childProps) => {
    // this.props.onCenterChange([childProps.lat, childProps.lng]);
    console.log('_onChildClick', key, childProps)
  }



  /**
   *
   *
   */
  render() {
    return (
      <Grid>
        <Row className="show-grid">
          <Col xs={12} md={12}>
            <div id='app-face'>
              <h1>
                <img src='https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/weather-64.png' />
                <span>Tenki Forecast</span>
              </h1>

              <p>Please click on a location to get its current weather data</p>
            </div>
          </Col>
        </Row>

        <Row className="show-grid">
          <Col xs={12} md={12}>
            <div id='map'>
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: GMAPS_API_KEY,
                  language: 'en'
                }}
                options={this.setMapOptions}
                defaultZoom={this.props.zoom}
                defaultCenter={this.props.center}
                onClick={this._onClick}
                onChildClick={this._onChildClick}
                onChange={this._onChange}
              >
                <SimpleReactComponent
                  lat={59.955413}
                  lng={30.337844}
                  text={'David Antunes'}
                />
              </GoogleMapReact>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Map;
