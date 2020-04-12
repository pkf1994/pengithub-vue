<template>
    <Container class="py-4 mx-3">
        <FullName class="flex-shrink-0 text-small text-bold">
            <router-link to="/search" class="link-gray">{{commit.repository.full_name}}</router-link>
        </FullName>
        <CommitMessageFirstLine class="f4 text-normal">
            <router-link to="/search" :meta="randomMeta">{{commitMessageFirstLine}}</router-link>&nbsp;
            <ShowMoreButton v-if="moreCommitMessage" class="show-more-button">
                <button @click="triggerShowMoreCommitMessage">
                    ...
                </button>
            </ShowMoreButton>
        </CommitMessageFirstLine>
        <AnimatedHeightFlagWrapper :stretch="showMoreCommitMessage">
            <MoreCommitMessage class="more-commit-message font-mono text-small"
                               :meta="randomMeta"
                               style="white-space: pre">{{moreCommitMessage}}</MoreCommitMessage>
        </AnimatedHeightFlagWrapper>

        <MultiInfo class="d-flex flex-wrap text-small text-gray">
            <AuthoredOrCommittedAt lass="mr-3">
                <span v-if="commit.commit.author.name !== commit.commit.committer.name">
                    <strong>{{commit.commit.author.name}}</strong>
                    authored and
                </span>
                <strong>{{commit.commit.committer.name}}</strong> committed
                <span class="no-wrap">
                {{committedAt}}
                </span>

                <span class="ml-1 d-inline-block">
                    <svg v-if="status == 'FAILURE'" class="octicon octicon-x v-align-top text-red" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>
                    <svg v-else-if="status == 'SUCCESS'" class="octicon octicon-check v-align-top text-green" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
                </span>
            </AuthoredOrCommittedAt>
        </MultiInfo>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import axios from 'axios'
    import {mapState} from "vuex";
    import {util_dateFormat,util_analyseFileType,util_adjustStyle} from '@/util'
     import {
        AnimatedHeightWrapper} from '@/components'
    import {
        WithRandomMetaMixin,
        CancelNetworkOnDestroyMixin} from '@/mixins'
    import {handleException} from "@/store/modules/util";
    import {authRequiredGet} from "@/store/modules/network";
    export default {
        mixins: [WithRandomMetaMixin],
        inject: ['commitsExtraDataProvided','query'],
        props: {
            commit: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                showMoreCommitMessage: false,
                moreCommitMessage: undefined
            }
        },
        computed: {
            commitMessageFirstLine() {
                let firstBrIndex = this.commit.commit.message.indexOf("\n")
                if(firstBrIndex === -1){
                    return this.commit.commit.message
                }
                this.moreCommitMessage = this.commit.commit.message.substring(firstBrIndex + 1)
                while(this.moreCommitMessage.indexOf("\n") === 0) {
                    this.moreCommitMessage = this.moreCommitMessage.substring(1)
                }
                return this.commit.commit.message.substring(0,firstBrIndex)
            },
            committedAt() {
                return util_dateFormat.dateFormat("zzz dd, yyyy",new Date(this.commit.commit.committer.date))
            },
            status() {
                let statusHolder = this.commitsExtraDataProvided().filter(item => {
                    return item.id == this.commit.node_id
                })
                if(statusHolder && statusHolder[0] && statusHolder[0].status){
                    return statusHolder[0].status.state
                }
            }
        },
        mounted() {
            util_adjustStyle.highlightKeyword(`[meta=${this.randomMeta}]`,this.query())
        },
        methods: {
            triggerShowMoreCommitMessage() {
                this.showMoreCommitMessage = !this.showMoreCommitMessage
            }
        },
        components: {
            AnimatedHeightFlagWrapper: AnimatedHeightWrapper,
            Container: styled.div``,
            FullName: styled.div``,
            CommitMessageFirstLine: styled.div``,
            ShowMoreButton: styled.span``,
            MoreCommitMessage: styled.div``,
            MatchesContent: styled.div``,
            MultiInfo: styled.div``,
            Language: styled.div``,
            MatchesNumber: styled.div``,
            AuthoredOrCommittedAt: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
.show-more-button{
    position: relative;
    top: -1px;
    display: inline-block;
    margin-left: 5px;
    line-height: 0;
    button{
        text-decoration: none;
        -webkit-appearance: button;
        display: inline-block;
        height: 12px;
        padding: 0 5px 5px;
        font-size: 12px;
        font-weight: 600;
        line-height: 6px;
        color: #444d56;
        vertical-align: middle;
        background: #dfe2e5;
        border: 0;
        border-radius: 1px;
    }
}
.more-commit-message{
    line-height: 1.45;
    padding-top: 5px;
    padding-bottom: 10px;
}
</style>