import React, { useState, useEffect, useContext } from 'react'
import ReactMapGL, { NavigationControl, Marker } from 'react-map-gl'
import { withStyles } from '@material-ui/core'
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery'
import differenceInMinutes from 'date-fns/difference_in_minutes'

import { useClient } from '../../client'
import Context from '../../context'
import { GET_PINS_QUERY } from '../../graphql/queries'
import { DELETE_PIN_MUTATION } from '../../graphql/mutations'
import PinIcon from '../PinIcon'
import Blog from '../Blog'
import { Subscriptions } from './Subscriptions'
import GetUserPosition from './GetUserPosition'
import { PopupDialog } from './PopupDialog'

const INITIAL_VIEWPORT = {
  latitude: 45.5016889,
  longitude: -73.567256,
  zoom: 13
}

const Map = ({ classes }) => {
  const client = useClient()
  const mobileSize = useMediaQuery('(max-width: 650px)')
  const { state, dispatch } = useContext(Context)
  useEffect(() => {
    getPins()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT)
  const [userPosition, setUserPosition] = useState(null)
  /* useEffect(() => {
    getUserPosition()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) */
  const [popup, setPopup] = useState(null)
  // remove popup if pin itself is deleted by the author of the pin
  useEffect(() => {
    const pinExists =
      popup && state.pins.findIndex(pin => pin._id === popup._id) > -1
    if (!pinExists) {
      setPopup(null)
    }
  }, [popup, state.pins, state.pins.length])

  const getUserPosition = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords
        setViewport({ ...viewport, latitude, longitude })
        setUserPosition({ latitude, longitude })
      })
    }
  }

  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY)
    dispatch({ type: 'GET_PINS', payload: getPins })
  }

  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return
    if (!state.draft) {
      dispatch({ type: 'CREATE_DRAFT' })
    }
    const [longitude, latitude] = lngLat
    dispatch({
      type: 'UPDATE_DRAFT_LOCATION',
      payload: { longitude, latitude }
    })
  }

  const highlightNewPin = pin => {
    const isNewPin =
      differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30
    return isNewPin ? 'limegreen' : 'darkblue'
  }

  const handleSelectPin = pin => {
    setPopup(pin)
    dispatch({ type: 'SET_PIN', payload: pin })
  }

  const isAuthUser = () => state.currentUser._id === popup.author._id

  const handleDeletePin = async pin => {
    const variables = { pinId: pin._id }
    await client.request(DELETE_PIN_MUTATION, variables)
    setPopup(null)
  }

  const createdPins = state.pins.map(pin => (
    <Marker
      key={pin._id}
      latitude={pin.latitude}
      longitude={pin.longitude}
      offsetLeft={-19}
      offsetTop={-37}
    >
      <PinIcon
        onClick={() => handleSelectPin(pin)}
        size={40}
        color={highlightNewPin(pin)}
      />
    </Marker>
  ))

  const closePopup = () => {
    setPopup(null)
    dispatch({ type: 'SET_PIN_NULL' })
  }

  return (
    <div className={mobileSize ? classes.rootMobile : classes.root}>
      <ReactMapGL
        width='100vw'
        height='calc(100vh - 64px)'
        mapStyle={state.mapStyle}
        mapboxApiAccessToken={process.env.REACT_APP_MAXBOX_API_ACCESS_TOKEN}
        scrollZoom={!mobileSize}
        onViewportChange={newViewport => setViewport(newViewport)}
        onClick={handleMapClick}
        {...viewport}
      >
        {/* Navigation Control */}
        <div className={classes.navigationControl}>
          <NavigationControl
            onViewportChange={newViewport => setViewport(newViewport)}
          />
        </div>

        {/* Pin for User's Current Position */}
        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color='red' />
          </Marker>
        )}

        {/* Draft Pin */}
        {state.draft && (
          <Marker
            latitude={state.draft.latitude}
            longitude={state.draft.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color='hotpink' />
          </Marker>
        )}

        {/* Created Pins */}
        {createdPins}

        {/* Popup Dialog for Created Pins */}
        {popup && (<PopupDialog classes={classes} handleDeletePin={handleDeletePin} isAuthUser={isAuthUser} popup={popup} closePopup={closePopup} />)}
      </ReactMapGL>
      {/* Locate user button */}
      <GetUserPosition getUserPosition={getUserPosition} />
      {/* Subscriptions for Creating / Updating / Deleting Pins */}
      <Subscriptions />
      {/* Blog Area to add Pin Content */}
      <Blog />
    </div>
  )
}

const styles = {
  root: {
    display: 'flex'
  },
  rootMobile: {
    display: 'flex',
    flexDirection: 'column-reverse'
  },
  navigationControl: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: '1em'
  },
  locateUser: {
    position: 'absolute',
    top: '44px',
    left: 'calc(100vw - 410px)',
    margin: '1em',
    padding: '0.2em',
  },
  deleteIcon: {
    color: 'red'
  },
  popupImage: {
    padding: '0.4em',
    height: 200,
    width: 200,
    objectFit: 'cover'
  },
  popupTab: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  }
}

export default withStyles(styles)(Map)
