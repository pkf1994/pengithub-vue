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
        if(state.newStartedReviews.length > 0) state.newStartedReviews = state.newStartedReviews.splice(0,state.newStartedReviews.length)
        if(state.newCreatedReviewComments.length > 0) state.newCreatedReviewComments = state.newCreatedReviewComments.splice(0,state.newCreatedReviewComments.length)
        if(state.deletedReviewComments.length > 0) state.deletedReviewComments = state.deletedReviewComments.splice(0,state.deletedReviewComments.length)
        if(state.updatedReviewComments.length > 0) state.updatedReviewComments = state.updatedReviewComments.splice(0,state.updatedReviewComments.length)
    },
}