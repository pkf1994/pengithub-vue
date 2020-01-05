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
            </AuthoredOrCommittedAt>
        </MultiInfo>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import axios from 'axios'
    import {mapState} from "vuex";
    import {util_dateFormat,util_analyseFileType,util_adjustStyle} from '../../../../../util'
     import {
        AnimatedHeightWrapper} from '../../../../../components'
    import {
        WithRandomMetaMixin,
        CancelNetworkOnDestroyMixin} from '../../../../../mixins'
    import {handleException} from "../../../../../store/modules/util";
    import {authRequiredGet} from "../../../../../store/modules/network";
    export default {
        mixins: [WithRandomMetaMixin],
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
            ...mapState({
                searchQuery: state => state.search.searchQuery
            }),
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
            }
        },
        mounted() {
            util_adjustStyle.highlightKeyword(`[meta=${this.randomMeta}]`,this.searchQuery)
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