import Cookies from 'js-cookie'
export default {
	state: {
		projectId: Cookies.get('projectId') || -1, 
		logoUrl:''
	}, 
	getters: {
		getProjectId(state) {
			return state.projectId; 
		}, 
		getLogoUrl(state) {
			return state.logoUrl; 
		}
	}, 
	mutations: {
		setProjectId(state, projectId) {
			state.projectId = projectId; 
			Cookies.set('projectId', projectId)
		}, 
		removeProjectId(state) {
			state.projectId = -1; 
			Cookies.remove("projectId");
		}, 
		setLogoUrl(state, projectId) {
			state.logoUrl = projectId; 
		}
	}, 
	actions: {
			
	}
}