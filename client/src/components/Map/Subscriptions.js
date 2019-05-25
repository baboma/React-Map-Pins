import React, { useContext } from 'react'
import { Subscription } from 'react-apollo'
import * as SUBSCRIPTION from '../../graphql/subscriptions'
import Context from '../../context'

export const Subscriptions = () => {
  const { dispatch } = useContext(Context)
  return (<>
    <Subscription
      subscription={SUBSCRIPTION.PIN_ADDED_SUBSCRIPTION}
      onSubscriptionData={({ subscriptionData }) => {
        const { pinAdded } = subscriptionData.data
        dispatch({ type: 'CREATE_PIN', payload: pinAdded })
      }}
    />
    <Subscription
      subscription={SUBSCRIPTION.PIN_UPDATED_SUBSCRIPTION}
      onSubscriptionData={({ subscriptionData }) => {
        const { pinUpdated } = subscriptionData.data
        dispatch({ type: 'CREATE_COMMENT', payload: pinUpdated })
      }}
    />
    <Subscription
      subscription={SUBSCRIPTION.PIN_DELETED_SUBSCRIPTION}
      onSubscriptionData={({ subscriptionData }) => {
        const { pinDeleted } = subscriptionData.data
        dispatch({ type: 'DELETE_PIN', payload: pinDeleted })
      }}
    />
  </>)
}