import { apolloClient } from '../../boot/apollo'
import * as cookie from '../../../common/src/store/cookie'
import types from '../../../common/src/types'

import LogIn from '../../../cypress/fixtures/graphql/login.graphql'
import SignUp from '../../../cypress/fixtures/graphql/signup.graphql'

function saveUser ({ email, userId, token }) {
  cookie.set({ cookieId: types.cookies.EMAIL, cookieValue: email, cookieDuration: 30 })
  cookie.set({ cookieId: types.cookies.USER_ID, cookieValue: userId, cookieDuration: 30 })
  cookie.set({ cookieId: types.cookies.TOKEN, cookieValue: token, cookieDuration: 30 })
}

function saveToken ({ token }) {
  cookie.del({ cookieId: types.cookies.EMAIL })
  cookie.del({ cookieId: types.cookies.USER_ID })
  cookie.set({ cookieId: types.cookies.TOKEN, cookieValue: token, cookieDuration: 30 })
}

function removeToken () {
  cookie.del({ cookieId: types.cookies.EMAIL })
  cookie.del({ cookieId: types.cookies.USER_ID })
  cookie.del({ cookieId: types.cookies.TOKEN })
}

function adaptPermissions (received) {
  const permissions = received.map(permissionPack => permissionPack.code)
  if (permissions.every(permission => permission !== types.permissions.NOT_CONNECTED)) {
    return [types.permissions.CUSTOMER]
  } else return [types.permissions.NOT_CONNECTED]
}

export function signup ({ commit }, { email, password }) {
  return new Promise((resolve, reject) => {
    apolloClient
      .mutate({
        mutation: SignUp,
        variables: {
          email,
          password
        }
      })
      .then(response => {
        console.log(response)
        resolve(response)
      })
      .catch(error => {
        commit('error', error)
        reject(error)
      })
  })
}

export function login ({ commit }, { email, password, stayLoggedIn }) {
  return new Promise((resolve, reject) => {
    apolloClient
      .mutate({
        mutation: LogIn,
        variables: {
          email,
          password
        }
      })
      .then(response => {
        const content = response.data.login
        const errors = content.errors
        if (errors.length > 0) {
          commit('error', errors)
          reject(errors)
        } else {
          const token = content.token
          const userId = content.user.id
          commit('storePermissions', {
            email,
            token,
            userId,
            permissions: adaptPermissions(content.user.permissions)
          })
          stayLoggedIn ? saveUser({ email, userId, token }) : saveToken({ token })
          resolve(response)
        }
      })
      .catch(error => {
        commit('error', error)
        reject(error)
      })
  })
}

export function getPermissions ({ commit }) {
  // request
  //   .getAuthorizations({
  //     userId: cookie.get({ cookieId: 'userId' }),
  //     token: cookie.get({ cookieId: 'token' })
  //   })
  //   .then(response => {
  //     commit('storePermissions', {
  //       email: response.email,
  //       token: response.token,
  //       userId: response.userId,
  //       permissions: response.permissions
  //     })
  //   })
  //   .catch(error => {
  //     commit('error', error)
  //   })
  const token = cookie.get({ cookieId: types.cookies.TOKEN })
  const userId = cookie.get({ cookieId: types.cookies.USER_ID })
  const email = cookie.get({ cookieId: types.cookies.EMAIL })
  if (token && userId && email) {
    commit('storePermissions', {
      email,
      userId,
      token,
      permissions: []
    })
  } else {
    commit('logout')
    removeToken()
  }
}

export function logout ({ commit }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      commit('logout')
      removeToken()
      resolve()
    }, 500)
  })
}