import Cookies from 'js-cookie'

const app = {
  state: {
    // 中英文
    language: Cookies.get('language') || 'zh',
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    },    
    menuRouteLoaded:false    // 菜单和路由是否已经加载
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    // 中英文
    SET_LANGUAGE: (state, language) => {
      state.language = language
      Cookies.set('language', language)
    },    
    menuRouteLoaded(state, menuRouteLoaded){  // 改变菜单和路由的加载状态
      state.menuRouteLoaded = menuRouteLoaded;
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    // 中英文
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    }
  }
}

export default app
