export default {
	state: {  //状态树 管理属性 组件内使用this.$store.state 或 computed 方法中用mapstate函数将this.XXX映射到this.$store.state.XXX
    	broadcastHost :'192.168.20.248'
	},
	getters: {  //共享函数 处理属性 可返回处理后的属性或返回函数（可入参）在组件内的computed方法内用...mapGetters([])函数映射
			
	},
	mutations: { 
	
	},
	actions: {  //Action 提交的是 mutation，而不是直接变更状态。  Action 可以包含任意异步操作。 组件内用store.dispatch 调用
    
	}
}