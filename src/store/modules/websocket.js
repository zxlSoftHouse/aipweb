export default {
	state: {  //状态树 管理属性 组件内使用this.$store.state 或 computed 方法中用mapstate函数将this.XXX映射到this.$store.state.XXX
		returnCode:'',
		websocketData:''
	},
	getters: {  //共享函数 处理属性 可返回处理后的属性或返回函数（可入参）在组件内的computed方法内用...mapGetters([])函数映射
			
	},
	mutations: { 
		RESETCODE(state){          //更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。
			state.returnCode = '';  //Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。
		},                              // 在组件内可以用this.$store.commit('XXX'，n)来提交荷载
		SETCODE(state, obj){
			state.returnCode = obj;
		},
		SETSOCKETDATA(state, obj){
			state.websocketData = obj
		}
	},
	actions: {  //Action 提交的是 mutation，而不是直接变更状态。  Action 可以包含任意异步操作。 组件内用store.dispatch 调用
		RESET_CODE({commit}){
			commit('RESETCODE')
		},
		SET_CODE({commit}, obj){
			commit('SETCODE', obj)
		},
		SET_SOCKETDATA({commit}, obj){
			commit('SETSOCKETDATA', obj)
		}
	}
}