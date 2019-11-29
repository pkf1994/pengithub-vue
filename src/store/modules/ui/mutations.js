export const MUTATION_CHANGE_THEME = "MUTATION_CHANGE_THEME"

export default {
    [MUTATION_CHANGE_THEME](state,payload) {
        state.theme = payload.theme
    },

}