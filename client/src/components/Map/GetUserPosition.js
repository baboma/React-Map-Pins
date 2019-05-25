import React from 'react'
import { Tooltip, IconButton, withStyles } from '@material-ui/core'
import MyLocationIcon from '@material-ui/icons/MyLocation'

const GetUserPosition = ({classes, getUserPosition}) => {
  return (<>
    <Tooltip title='Show your location' placement="left">
      <IconButton className={classes.locateUser} onClick={getUserPosition}>
        <MyLocationIcon />
      </IconButton>
    </Tooltip>
  </>)
}

const styles = {
  locateUser: {
    position: 'absolute',
    top: '44px',
    left: 'calc(100vw - 410px)',
    margin: '1em',
    padding: '0.2em',
  }
}

export default withStyles(styles)(GetUserPosition)