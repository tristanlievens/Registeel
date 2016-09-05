import { until } from 'async'
import { login as loginApi } from '../client/api/login'
import { move as moveApi } from '../client/api/location'
import { Client } from '../typings'

const handleQueueUpdates = (client: Client) => (
  new Promise((resolve, reject) => {
    until(
      () => !client.store.getState().login.isLoggingIn,
      next => setTimeout(() => {
        if (client.store.getState().login.position) {
          console.log("Queue position:", client.store.getState().login.position)
        }
        next()
      }, 500),
      () => {
        if (client.store.getState().login.isLoggedIn) {
          resolve()
        } else {
          reject(`Login failed: incorrect ${client.store.getState().login.loginErrorReason}`)
        }
      },
    )
  })
)

const login = (client: Client) => (
  loginApi(process.env.PRO_USERNAME, process.env.PRO_PASSWORD, client)
    .then(() => handleQueueUpdates(client))
)

const move = (client: Client) => (
  moveApi('left', client)
  .then(() => moveApi('left', client))
  .then(() => moveApi('left', client))
  .then(() => moveApi('left', client))
)

export const startBot = (client: Client) => {
  login(client)
    // .then(() => move(client))
    .then(() => console.log('Successfully logged in!'))
}
