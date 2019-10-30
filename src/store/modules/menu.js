export default {
    state: {
        navTree: [],  // 导航菜单树
		buTree: []
    },
    getters: {
   
    },
    mutations: {
        setNavTree(state, navTree){  // 设置导航菜单树
            state.navTree = navTree;
        },
		setBuTree(state, buTree) {
			state.buTree = buTree;
		}
    },
    actions: {
        
    }
}