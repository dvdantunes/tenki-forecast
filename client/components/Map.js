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
import GoogleMapReact from 'google-map-react';
import { GMAPS_API_KEY } from '../config';


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


class Map extends Component {
  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 1
  };

  render() {
    return (
      <div id='map'>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: GMAPS_API_KEY,
            language: 'en'
          }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <SimpleReactComponent
            lat={59.955413}
            lng={30.337844}
            text={'Kreyser Avrora'}
          />
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;
