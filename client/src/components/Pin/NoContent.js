import React, { useContext, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import ExploreIcon from '@material-ui/icons/Explore'
import { Button, Typography } from '@material-ui/core'
import Context from '../../context'
import ReactWeather from 'react-open-weather'

const NoContent = ({ classes }) => {
  const { state, dispatch } = useContext(Context)
  const [visible, setVisible] = useState(true)

  const showPlan = () => {
    dispatch({ type: 'SET_STREETS', payload: process.env.REACT_APP_MAP_STYLE_STREETS })
    setVisible(!visible)
  }
  const showSatellite = () => {
    dispatch({ type: 'SET_SATELLITE', payload: process.env.REACT_APP_MAP_STYLE_SATELLITE })
    setVisible(!visible)
  }

  const plan = (<Button onClick={showPlan}>
    <img src='../../images/plan_map.png' alt='plan map' />
  </Button>)
  const sattelite = (<Button onClick={showSatellite}>
    <img src='../../images/satellite_map.png' alt='satellite map' />
  </Button>)

  return (<div>
    <div className={classes.picture}>
      {visible ? sattelite : plan}
    </div>
    <div className={classes.root}>
      <Typography
        noWrap
        component='h2'
        variant='h6'
        align='center'
        color='error'
        gutterBottom
      >
        {state.pins.length} ePostal cards created.
    </Typography>
      <ExploreIcon className={classes.icon} />
      <Typography
        noWrap
        component='h2'
        variant='h6'
        align='center'
        color='textPrimary'
        gutterBottom
      >
        Click on the map to add a pin
    </Typography>
    </div>
    <div>
      <ReactWeather
        forecast='today'
        apikey={process.env.REACT_APP_APIXU_KEY}
        type='auto'
      />
    </div>
  </div>)
}

const styles = theme => ({
  picture: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '1em'
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  icon: {
    margin: theme.spacing.unit,
    fontSize: '35px'
  }
})

export default withStyles(styles)(NoContent)
