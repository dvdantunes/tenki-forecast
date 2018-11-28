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
import fetch from 'unfetch';
import MapInfoWindow from './Map/MapInfoWindow';
import { GMAPS_API_KEY, TENKI_FORECAST_SERVER_API_URL } from '../config';





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
    scrollwheel : false,

    infoWindowShow : false,
    infoWindowPositionX: 0,
    infoWindowPositionY: 0,
    infoWindowBody: {}
  };



  /**
   *
   *
   */
  constructor(props) {
    super(props);

    this._onClick = this._onClick.bind(this);


    this.state = {
      infoWindowShow : this.props.infoWindowShow,
      infoWindowPositionX : this.props.infoWindowPositionX,
      infoWindowPositionY : this.props.infoWindowPositionY,
      infoWindowBody : this.props.infoWindowBody
    }
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

    // Center map on clicked area
    this.props.onCenterChange([lat, lng]);


    // Set 'loading' state
    this.setState({
        infoWindowShow : true,
        infoWindowStatus : 'loading',
        infoWindowPositionX : lat,
        infoWindowPositionY : lng,
        infoWindowBody : {}
      });


    // Get weather data and update info window tooltip
    this._fetchTenkiWeatherData(lat, lng)
      .then(weatherData => {

        this._updateInfoWindow(weatherData, lat, lng, 'ok');
      })
      .catch(error => {
        // Unexpected errors
        console.error('error: ', error);

        const weatherData = {
          'errorMessage' : error.message
        }

        this._updateInfoWindow(weatherData, lat, lng, 'error');
      });
  }



  /**
   *
   *
   */
  _fetchTenkiWeatherData = (lat, lng) => {

    const defaultErrorMessage = "Error retrieving weather data. Please try again.";


    const postData = {
        "latitude": lat,
        "longitude": lng
      };

    return fetch(TENKI_FORECAST_SERVER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      })
      .then(response => {
        // Analyze response
        console.log('response: ', response.status, response);

        if (response.status !== 200){
          throw new Error(defaultMessage);
        }

        return response.json()
      })
      .then(responseBody => {
        // Analyze response body
        console.log('success: ', responseBody, JSON.stringify(responseBody));


        // Handle expected errors
        if (!responseBody
            || (responseBody.status == 'error'
                && !responseBody.message.includes('No results found')))
        {
          throw new Error(defaultMessage);
        }


        // Click on ocean or bad coordinates
        if (responseBody.status == 'error'
            && responseBody.message.includes('No results found'))
        {
          throw new Error(`No weather data was found for selected coordinates.`);
        }


        // Returns weather data found
        const weatherData = {
          country : responseBody.data.country.name,
          capital : responseBody.data.capital.name != 'not-found' ? responseBody.data.capital.name : '',
          temperature : responseBody.data.weather.temperature +" ºC",
          season : responseBody.data.weather.season
        }

        return weatherData;
      });

  }



  /**
   *
   *
   */
  _updateInfoWindow = (weatherData, lat, lng, status) => {

    this.setState({
        infoWindowShow : true,
        infoWindowStatus : status,
        infoWindowPositionX : lat,
        infoWindowPositionY : lng,
        infoWindowBody : weatherData
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

    nfoWindowStatus : status,
        infoWindowPositionX : lat,
        infoWindowPositionY : lng,
        infoWindowBody : weatherData
    const infoWindowBody = this.state.infoWindowBody;
    // if (!this.props.loaded) return <div>Loading...</div>;

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
                <MapInfoWindow
                  lat={this.state.infoWindowPositionX}
                  lng={this.state.infoWindowPositionY}
                  infoWindowShow={this.state.infoWindowShow}
                  infoWindowStatus={this.state.infoWindowStatus}
                  infoWindowBody={this.state.infoWindowBody}
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
