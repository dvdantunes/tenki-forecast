import React from 'react';

/**
 * Map info window tooltip component
 *
 */
export default class MapInfoWindow extends React.PureComponent {

  render() {
    // const style = this.props.$hover ? greatPlaceStyleHover : greatPlaceStyle;
    const mainDivClass = this.props.infoWindowShow ? 'arrow_box' : 'arrow_box hide';
    const status = this.props.infoWindowStatus;

    var headerText;
    var bodyOkClass;
    var bodyErrorClass;
    var bodyLoadingClass;
    var capital;
    var temperature;
    var season;
    var errorMessage;
    const bodyHideClass = 'hide';

    switch (this.props.infoWindowStatus) {
      case 'ok':
        headerText = this.props.infoWindowBody.country;
        bodyOkClass = 'body';
        bodyErrorClass = bodyHideClass;

        capital = this.props.infoWindowBody.capital ? this.props.infoWindowBody.capital : '';
        temperature = this.props.infoWindowBody.temperature ? this.props.infoWindowBody.temperature : '';
        season = this.props.infoWindowBody.season ? this.props.infoWindowBody.season : '';

        break;

      case 'error':
        headerText = 'Error';
        bodyOkClass = bodyHideClass;
        bodyErrorClass = 'body';

        errorMessage = this.props.infoWindowBody.errorMessage
                          ? this.props.infoWindowBody.errorMessage : 'Error retrieving weather data. Please try again';
        break;

      case 'loading':
        headerText = 'Loading...';
        bodyOkClass = bodyHideClass;
        bodyErrorClass = bodyHideClass;

        break;
    }

    return (
       <div id='mapInfoWindowTooltip' className={mainDivClass}>
          <div className='header'>
            {headerText}
          </div>

          <div id='body-ok' className={bodyOkClass}>
            <p>Capital: {capital}</p>
            <p>Temperature: {temperature}</p>
            <p>Season: {season}</p>
          </div>

          <div id='body-error' className={bodyErrorClass}>
            <p>{errorMessage}</p>
          </div>

          <div className='close-x'>
            <img src='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224px%22%20height%3D%2224px%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22%23000000%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M19%206.41L17.59%205%2012%2010.59%206.41%205%205%206.41%2010.59%2012%205%2017.59%206.41%2019%2012%2013.41%2017.59%2019%2019%2017.59%2013.41%2012z%22%2F%3E%0A%20%20%20%20%3Cpath%20d%3D%22M0%200h24v24H0z%22%20fill%3D%22none%22%2F%3E%0A%3C%2Fsvg%3E%0A' />
          </div>
       </div>
    );
  }
}
