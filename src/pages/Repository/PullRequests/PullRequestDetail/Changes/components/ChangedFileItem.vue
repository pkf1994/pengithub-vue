<template>
    <Diff :headerStyle="{position:'sticky',top:'60px',zIndex:2}" 
            :file="file" 
            ref="diff"
            @blob-code-clicked.native.stop="e => viewerCanComment() && triggerShowSingleCommentCreator(e.detail,true)">
        
        <template v-slot:menu="{viewFileRouterLink}">
            <label :for="`showCommentsCheckbox-${file.filename}`" class="dropdown-item btn-link text-normal d-block pl-5 py-2" >
                <span v-show="showComments" class="position-absolute" style="margin-left:-20px">
                    <svg class="octicon octicon-check" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                </span>
                Show comments
                <input :id="`showCommentsCheckbox-${file.filename}`" style="display:none" type="checkbox" v-model="showComments">
            </label>
            <router-link :to="viewFileRouterLink" class="pl-5 btn-link py-2 dropdown-item">
                View file
            </router-link>
        </template>

        <template v-show="showComments" v-slot:line-addition="{line,orginalLines}">
            <ReviewCommentGroup class="review-comment-wrapper" v-for="rootReviewCommentItem in getRootReviewComments(line,orginalLines)" :key="rootReviewCommentItem.id" :rootReviewComment="rootReviewCommentItem"></ReviewCommentGroup>
            <SingleCommentCreator 
                v-if="showSingleCommentCreatorAt.some(i => i.additionLineIndex == line.additionLineIndex && i.deletionLineIndex == line.deletionLineIndex)" 
                :path="file.filename"
                :position="getPositionOfLine(line,orginalLines)"
                @cancel="() => triggerShowSingleCommentCreator(line,false)"></SingleCommentCreator>
            </template>
    </Diff>
</template>

<script>
    import ReviewCommentGroup from './ReviewCommentGroup'
    import SingleCommentCreator from './SingleCommentCreator'
    import {Diff} from '../../../../components'
    import {mapState} from 'vuex'
    export default {
        inject: ['reviewCommentsProvided','pendingReviewComments','pullRequestProvided','viewerCanComment'],
        props: {
            file: {
                type: Object,
                required: true
            },
        },
        data() {
            return {
                showSingleCommentCreatorAt: [],
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
                    return item.path == this.file.filename && item.position && !item.in_reply_to_id
                })
                let deDuplicatedCommentArr = []
                commentArr.forEach(i => {
                    if(!deDuplicatedCommentArr.some(i_ => i_.id == i.id)) {
                        deDuplicatedCommentArr.push(i)
                    }
                })
                let reviewCommentsHolder = {}
                deDuplicatedCommentArr.forEach(i => {
                     if(!reviewCommentsHolder[i.position]) {
                        reviewCommentsHolder[i.position] = [i]
                    }else{
                        reviewCommentsHolder[i.position].push(i)
                    }
                })
                return reviewCommentsHolder
            },
        },
        methods: {
            getRootReviewComments(line,orginalLines) {
                let thePosition = this.getPositionOfLine(line,orginalLines)
                if(this.rootReviewCommentsHolder[thePosition]) return this.rootReviewCommentsHolder[thePosition].sort((a,b) => a.created_at - b.created_at)
            },
            triggerShowSingleCommentCreator(line,flag = true) {
                let orginalLines = this.$refs.diff.orginalLines

                if(flag && orginalLines.some(i => i.additionLineIndex == line.additionLineIndex && i.deletionLineIndex == line.deletionLineIndex)) {
                    let theLine  = orginalLines.filter(i => i.additionLineIndex == line.additionLineIndex && i.deletionLineIndex == line.deletionLineIndex)[0]
                    this.showSingleCommentCreatorAt.push(theLine)
                }

                if(!flag && this.showSingleCommentCreatorAt.some(i => i.additionLineIndex == line.additionLineIndex && i.deletionLineIndex == line.deletionLineIndex)) {
                    let theLine = this.showSingleCommentCreatorAt.filter(i => i.additionLineIndex == line.additionLineIndex && i.deletionLineIndex == line.deletionLineIndex)[0]
                    let idx = this.showSingleCommentCreatorAt.indexOf(theLine)
                    this.showSingleCommentCreatorAt.splice(idx,1)
                }
                /* let lineIndex = line.additionLineIndex || line.deletionLineIndex
                if(!lineIndex) return

                let side = line.deletionLineIndex ? 'left' : 'right'

                let idx = this.showSingleCommentCreatorAt[side].indexOf(lineIndex)
                if(flag) {
                    if(idx == -1) this.showSingleCommentCreatorAt[side].push(lineIndex)
                } else {
                    if(idx !== undefined) this.showSingleCommentCreatorAt[side].splice(idx,1)
                } */
            },
            getPositionOfLine(line,orginalLines) {
                if(orginalLines.some(i => i.additionLineIndex == line.additionLineIndex && i.deletionLineIndex == line.deletionLineIndex)) {
                    let theLine = orginalLines.filter(i_ => i_.additionLineIndex == line.additionLineIndex && i_.deletionLineIndex == line.deletionLineIndex)[0]
                    return orginalLines.indexOf(theLine)
                }
                return -1
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
@import 'node_modules/@primer/css/dropdown/index.scss';
</style>