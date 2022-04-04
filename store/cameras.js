export const state = () => ({
    showingOnlineCams: [],
    showingOfflineCams: [],
    searchQuery: '',
    onlineCams: [],
    offlineCams: [],
})

export const mutations = {
    SET_ONLINE_CAMS(state, onlineCams) {
        state.onlineCams = onlineCams
    },
    SET_OFFLINE_CAMS(state, offlineCams) {
        state.offlineCams = offlineCams
    },
    SET_SHOWING_ONLINE_CAMS(state, showingOnlineCams) {
        state.showingOnlineCams = showingOnlineCams
    },
    SET_SHOWING_OFFLINE_CAMS(state, showingOfflineCams) {
        state.showingOfflineCams = showingOfflineCams
    },
    SEARCH(state, searchQuery) {
        state.searchQuery = searchQuery
        state.showingOfflineCams = []
        state.showingOnlineCams = []
        if (searchQuery == ''){
            state.showingOfflineCams = state.offlineCams
            state.showingOnlineCams = state.onlineCams            
            return
        }
        state.onlineCams.forEach(camera => {
            if (camera.name.toLowerCase().includes(searchQuery.toLowerCase()))
                state.showingOnlineCams.push(camera)
        });
        state.offlineCams.forEach(camera => {
            if (camera.name.toLowerCase().includes(searchQuery.toLowerCase()))
                state.showingOfflineCams.push(camera)
        });
    }
}

export const getters = {
    GET_ONLINE_CAMS(state) {
        return state.onlineCams
    },
    GET_OFFLINE_CAMS(state) {
        return state.offlineCams
    },
    GET_SEARCH_QUERY(state) {
        return state.searchQuery
    },
    GET_SHOWING_ONLINE_CAMS(state) {
        return state.showingOnlineCams
    },
    GET_SHOWING_OFFLINE_CAMS(state) {
        return state.showingOfflineCams
    },
}

export const actions = {
    async FETCH_CAMERAS({ commit, state }) {
        if(state.onlineCams.length || state.offlineCams.length)
            return
        const result = await fetch("https://media.evercam.io/v2/public/cameras").then(res => res.json())
        let onlineCams = []
        let offlineCams = []
        for (let i = 0; i < result.cameras.length; i++) {
            // dividing the cameras by status
            if (result.cameras[i].status == "online")
                onlineCams.push(result.cameras[i])
            else
                offlineCams.push(result.cameras[i])
        }
        commit("SET_ONLINE_CAMS", onlineCams)
        commit("SET_OFFLINE_CAMS", offlineCams)
        commit("SET_SHOWING_ONLINE_CAMS", onlineCams)
        commit("SET_SHOWING_OFFLINE_CAMS", offlineCams)
    }
}