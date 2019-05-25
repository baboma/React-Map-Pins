import React from 'react'
import { Popup } from 'react-map-gl'
import { Button, Typography } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'

export const PopupDialog = (props) => {
  const { classes, handleDeletePin, isAuthUser, popup, closePopup } = props
  return (
    <Popup
      anchor='top'
      latitude={popup.latitude}
      longitude={popup.longitude}
      closeOnClick={false}
      onClose={() => closePopup()}
    >
      <img
        className={classes.popupImage}
        src={popup.image}
        alt={popup.title}
      />
      <div className={classes.popupTab}>
        <Typography>
          lat:{' '}{popup.latitude.toFixed(6)}, long:{' '}{popup.longitude.toFixed(6)}
        </Typography>
        {isAuthUser() && (
          <Button onClick={() => handleDeletePin(popup)}>
            <DeleteIcon className={classes.deleteIcon} />
          </Button>
        )}
      </div>
    </Popup>
  )
}