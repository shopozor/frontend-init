import types from '../../types'

export function storePermissions (state, payload) {
  state.email = payload.email
  state.userId = payload.userId
  state.token = payload.token
  state.permissions = payload.permissions
}

export function logout (state) {
  state.userId = ''
  state.token = ''
  state.email = ''
  state.permissions = [types.permissions.NOT_CONNECTED]
}

export function error (state, error) {
  console.log('A promise returned the following error : ', error)
}
