<template>
    <Container class="the-container">
        <textarea :disabled="loadingStartReview || loadingAddSingleComment" ref="textarea" v-model="content" class="form-control" placeholder="Leave a comment" rows="5" style="width: 100%"></textarea>
        <div class="text-right position-relative no-wrap d-flex flex-justify-end">
            <button class="btn mt-2 flex-shrink-0 d-block" @click.stop="() => $emit('cancel')" :disabled="loadingStartReview || loadingAddSingleComment">Cancel</button>
            <button class="btn mt-2 ml-1 btn-primary flex-shrink-1 truncate d-block" @click.stop="network_addSingleComment" :disabled="loadingStartReview || loadingAddSingleComment || !content">
                {{loadingAddSingleComment ? 'Trying...' : 'Add comment'}}
            </button>
            <button class="btn mt-2 ml-1 btn-primary flex-shrink-0 d-block" v-if="!(pendingReview().data && pendingReview().data.databaseId)" @click.stop="network_startAReview" :disabled="loadingStartReview || loadingAddSingleComment || !content">
                {{loadingStartReview ? 'Trying...' : 'Start a review'}}
            </button>
        </div>
    </Container>
</template>

<script>
    import ReviewCommentReplyCreator from './ReviewCommentReplyCreator'
    import {Popover} from '@/components'
    export default {
        mixins: [ReviewCommentReplyCreator],
        inject: ['reviewCommentsGetter'],
        data() {
            return {
                loadingAddSingleComment: false
            }
        },
        methods: {
            async network_addSingleComment() {
                try {
                    this.loadingAddSingleComment = true
                    let reviewCreated = await this.network_createReview('COMMENT')

                    await this.reviewCommentsGetter()()
                    
                    this.content = ''
                    this.$emit('cancel')
                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.loadingAddSingleComment = false
                }
            },
        },
        components: {
            Popover
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/dropdown/index.scss';
.the-container{
    padding-right: 15px;
    padding-left: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: #fafbfc;
    border: solid #dfe2e5;
    border-width: 1px 0;
}
.truncate{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>