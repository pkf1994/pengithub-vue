import {MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_STARTED_REVIEW,
        MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_SUBMITTED_REVIEW,
        MUTATION_PULL_REQUEST_DETAIL_PUSH_DELETED_REVIEW_COMMENT,
        MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_CREATED_REVIEW_COMMENT,
        MUTATION_PULL_REQUEST_DETAIL_RESET_STATE} from './mutationTypes'

export default {
    [MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_STARTED_REVIEW] (state,payload) {
        state.newStartedReviews.push(payload)
    },
    [MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_SUBMITTED_REVIEW] (state,payload) {
        state.newSubmittedeReviews.push(payload)
    },
    [MUTATION_PULL_REQUEST_DETAIL_PUSH_DELETED_REVIEW_COMMENT] (state,payload) {
        state.deletedReviewComments.push(payload)
    },
    [MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_CREATED_REVIEW_COMMENT] (state,payload) {
        state.newCreatedReviewComments.push(payload)
    },
    [MUTATION_PULL_REQUEST_DETAIL_RESET_STATE] (state) {
        state.newStartedReviews = []
        state.deletedReviewComments = []
        state.deletedReviewComments = []
    },
}