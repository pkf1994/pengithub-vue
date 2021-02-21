<template>
    <Diff :file="file" @blob-code-clicked.native.stop="e => !pullRequestProvided().locked && !viewerBlocked() && triggerShowSingleCommentCreator(e.detail,true)">
        <template v-slot:line-addition="{line}">
            <div v-if="showComments">
                <ReviewCommentGroup class="review-comment-wrapper" v-for="rootReviewCommentItem in getRootReviewComments(line)" :key="rootReviewCommentItem.id" :rootReviewComment="rootReviewCommentItem"></ReviewCommentGroup>
            </div>
            <SingleCommentCreator :path="file.filename" :line="line.additionLineIndex || line.deletionLineIndex" :side="line.type == 'deletion' ? 'left' : 'right'" v-if="showSingleCommentCreatorAt.right.some(i => i == line.additionLineIndex) || showSingleCommentCreatorAt.left.some(i => i == line.deletionLineIndex)" @cancel="() => triggerShowSingleCommentCreator(line,false)"></SingleCommentCreator>
        </template>
    </Diff>
</template>

<script>
    import ReviewCommentGroup from './ReviewCommentGroup'
    import SingleCommentCreator from './SingleCommentCreator'
    import {Diff} from '../../../../components'
    import {mapState} from 'vuex'
    export default {
        inject: ['reviewCommentsProvided','pendingReviewComments','pullRequestProvided','viewerBlocked'],
        props: {
            file: {
                type: Object,
                required: true
            },
        },
        data() {
            return {
                showSingleCommentCreatorAt: {
                    right: [],
                    left: []
                },
                showComments: true
            }
        },
        computed: {
            ...mapState({
                state_newCreatedReviewComments: state => state.pullRequestDetail.newCreatedReviewComments,
                state_deletedReviewComments: state => state.pullRequestDetail.deletedReviewComments
            }),
            rootReviewCommentsHolder() {
                let commentArr = [...this.reviewCommentsProvided(),...this.state_newCreatedReviewComments].filter(item => {
                    return item.path == this.file.filename && item.line && !item.in_reply_to_id
                })
                let deDuplicatedCommentArr = []
                commentArr.forEach(i => {
                    if(!deDuplicatedCommentArr.some(i_ => i_.id == i.id)) {
                        deDuplicatedCommentArr.push(i)
                    }
                })
                let reviewCommentsHolder = {
                    right: {},
                    left: {}
                }
                deDuplicatedCommentArr.forEach(i => {
                     if(!reviewCommentsHolder[i.side.toLowerCase()][i.line]) {
                        reviewCommentsHolder[i.side.toLowerCase()][i.line] = [i]
                    }else{
                        reviewCommentsHolder[i.side.toLowerCase()][i.line].push(i)
                    }
                })
                return reviewCommentsHolder
            },
        },
        methods: {
            getRootReviewComments(line) {
                let side
                if(line.type == 'context') side = 'right'
                if(line.type == 'addition') side = 'right'
                if(line.type == 'deletion') side = 'left'

                let commentList 
                if(side == 'right') commentList = this.rootReviewCommentsHolder[side][line.additionLineIndex]
                if(side == 'left') commentList = this.rootReviewCommentsHolder[side][line.deletionLineIndex]
                if(commentList)  return commentList.sort((a,b) => a.created_at - b.created_at)
                
            },
            triggerShowSingleCommentCreator(line,flag = true) {
                let lineIndex = line.additionLineIndex || line.deletionLineIndex
                if(!lineIndex) return

                let side = line.deletionLineIndex ? 'left' : 'right'

                let idx = this.showSingleCommentCreatorAt[side].indexOf(lineIndex)
                if(flag) {
                    if(idx == -1) this.showSingleCommentCreatorAt[side].push(lineIndex)
                } else {
                    if(idx !== undefined) this.showSingleCommentCreatorAt[side].splice(idx,1)
                }
            },
            triggerShowComments() {
                this.showComments = !this.showComments
                this.closeModal()
            }
        },
        components: {
            SingleCommentCreator,
            ReviewCommentGroup,
            Diff,
        }
    }
</script>

<style scoped lang="scss">
</style>