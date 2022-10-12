/* eslint-disable eqeqeq */
import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter ,asyncRoutes, constantRoutes, anyRoutes} from '@/router'
import cloneDeep from 'lodash/cloneDeep'


const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    //用户的全部路由权限
    routes: [ ],

    roles: [ ],

    buttons: [ ],
    resultAllRoutes:[ ],
    //当前角色下用户的异步路由权限
    resultAsyncRoutes:[]
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userInfo) => {
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    //菜单权限标记
    state.routes = userInfo.routes

    //按钮权限标记,level = 4
    state.buttons = userInfo.buttons

    //角色
    state.roles = userInfo.roles
  },
  //3 计算出最终结果,并保存到state中
  SET_RESELTASYNCROUTES:(state,asyncRoutes)=>{
    //要展示的异步路由
    state.resultAsyncRoutes = asyncRoutes

    //要展示的所有路由,包括constant\async\any\
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes,anyRoutes)
    //添加到路由里,实现动态配置
    router.addRoutes(state.resultAsyncRoutes)

  }
  
}
//2 
//计算当前用户的异步路由(已定义的异步路由与用户放回的路由作对比,过滤出来)
const computedAsyncRoutes= (asyncRoutes,routes)=>{
  return asyncRoutes.filter(item=>{
    //如果有就返回数组
    if(routes.indexOf(item.name) != -1){
      
      //递归: 2,3,4,级路由
      if(item.children && item.children.length){
        item.children = computedAsyncRoutes(item.children,routes)
      }
      return true
    }
  })

}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    const result = await login({ username: username.trim(), password: password })
    if (result.code == 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('login fail'))
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        
        commit('SET_USERINFO', data)

        //1
        commit('SET_RESELTASYNCROUTES',computedAsyncRoutes(cloneDeep(asyncRoutes),data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)    
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

