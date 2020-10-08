import {MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_STARTED_REVIEW,
        MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_SUBMITTED_REVIEW,
        MUTATION_PULL_REQUEST_DETAIL_PUSH_DELETED_REVIEW_COMMENT,
        MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_CREATED_REVIEW_COMMENT,
        MUTATION_PULL_REQUEST_DETAIL_PUSH_UPDATED_REVIEW_COMMENT,
        MUTATION_PULL_REQUEST_DETAIL_UPDATED_NEW_CREATED_REVIEW_COMMENT,
        MUTATION_PULL_REQUEST_DETAIL_RESET_STATE} from './mutationTypes'

export default {
    [MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_STARTED_REVIEW] (state,payload) {
        state.newStartedReviews.push(payload)
    },
    [MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_SUBMITTED_REVIEW] (state,payload) {
        state.newSubmittedReviews.push(payload)
    },
    [MUTATION_PULL_REQUEST_DETAIL_PUSH_DELETED_REVIEW_COMMENT] (state,payload) {
        state.deletedReviewComments.push(payload)
    },
    [MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_CREATED_REVIEW_COMMENT] (state,payload) {
        state.newCreatedReviewComments.push(payload)
    },
    [MUTATION_PULL_REQUEST_DETAIL_UPDATED_NEW_CREATED_REVIEW_COMMENT] (state,payload) {
        state.newCreatedReviewComments.forEach((i,index) => {
            if(i.id == payload.id) {
                state.newCreatedReviewComments.splice(index,1)
            }
        })
        state.newCreatedReviewComments.push(payload)
    },
    [MUTATION_PULL_REQUEST_DETAIL_PUSH_UPDATED_REVIEW_COMMENT] (state,payload) {
        state.updatedReviewComments.push(payload)
    },
    [MUTATION_PULL_REQUEST_DETAIL_RESET_STATE] (state) {
        state.newStartedReviews = []
        state.newCreatedReviewComments = []
        state.deletedReviewComments = []
        state.updatedReviewComments = []
    },
}