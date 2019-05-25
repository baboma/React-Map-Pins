import React, { useContext } from 'react'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import MapIcon from '@material-ui/icons/Map'
import Typography from '@material-ui/core/Typography'
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery'

import Context from '../context'
import Signout from '../components/Auth/Signout'

const Header = ({ classes }) => {
  const mobileSize = useMediaQuery('(max-width: 650px)')
  const { state } = useContext(Context)
  const { currentUser } = state
  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          {/* Title / Logo */}
          <div className={classes.grow}>
            <MapIcon className={classes.icon} />
            <Typography
              className={mobileSize ? classes.mobile : ''}
              component='h1'
              variant='h6'
              color='inherit'
              noWrap
            >
              React Map Pins
            </Typography>
          </div>

          {/* Current User Info */}
          {currentUser && (
            <div className={classes.grow1}>
              <img
                className={classes.picture}
                src={currentUser.picture}
                alt={currentUser.name}
              />
              <Typography
                className={mobileSize ? classes.mobile : classes.margin}
                variant='h6'
                color='inherit'
                noWrap
              >
                {currentUser.name}
              </Typography>
              {/* Signout Button */}
              <Signout />
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  )
}

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center'
  },
  grow1: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  margin: {
    marginRight: theme.spacing.unit,
  },
  icon: {
    marginRight: theme.spacing.unit,
    color: 'green',
    fontSize: 40
  },
  mobile: {
    display: 'none'
  },
  picture: {
    height: '30px',
    borderRadius: '90%',
    marginRight: theme.spacing.unit * 2
  }
})

export default withStyles(styles)(Header)
