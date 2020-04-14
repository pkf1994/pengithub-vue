<template>
    <Container class="py-2">
        <button @click="triggerStretch" class="flex-wrap btn-link muted-link no-underline lh-condensed text-left width-full">
            <Content class="d-inline-block col-8">
                <span class="css-truncate css-truncate-target mb-1" style="max-width:100%;">
                    {{pullRequestReviewContribution.repository.nameWithOwner}}
                </span>
            </Content>

            <PullRequestCount class="d-inline-block float-right f6 text-gray float-right text-right">
                {{pullRequestReviewContribution.contributions.nodes.length}} {{pullRequestReviewContribution.contributions.nodes.length > 1 ? 'pullRequests' : 'pullRequest'}}
            </PullRequestCount>
        </button>

        <AnimatedHeightWrapper :stretch="stretch">
             <ul class="pt-1 list-style-none">
                <li class="py-1 ml-0" v-for="item in pullRequestReviewContribution.contributions.nodes" :key="item.pullRequest.id">
                    <Content class="css-truncate css-truncate-target" style="max-width:85%;">
                        <span class="profile-rollup-icon">
                            <svg v-if="item.pullRequestReview.state == 'APPROVED'" class="octicon octicon-check text-green v-align-bottom" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
                            <svg v-else-if="item.pullRequestReview.state == 'CHANGES_REQUESTED'" class="octicon octicon-request-changes text-red v-align-bottom" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 1a1 1 0 011-1h14a1 1 0 011 1v10a1 1 0 01-1 1H7.5L4 15.5V12H1a1 1 0 01-1-1V1zm1 0v10h4v2l2-2h8V1H1zm7.5 3h2v1h-2v2h-1V5h-2V4h2V2h1v2zm2 5h-5V8h5v1z"></path></svg>
                            <svg v-else class="octicon octicon-comment text-gray-light v-align-bottom" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M14 1H2c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1h2v3.5L7.5 11H14c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zm0 9H7l-2 2v-2H2V2h12v8z"></path></svg>
                        </span>
                        <router-link :to="item.pullRequest.resourcePath" class="link-gray-dark">{{item.pullRequest.title}}</router-link>
                    </Content>

                    <time class="float-right f6 text-gray-light pt-1">
                        {{item.occurredAt | dateFormat('zzz d')}}
                    </time>    
                </li>
            </ul>
        </AnimatedHeightWrapper>
       
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {IssueIcon, AnimatedHeightWrapper} from '@/components'
    import {util_numberFormat,util_dateFormat} from '@/util'
    export default {
        props: {
            pullRequestReviewContribution: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
               stretch: false
            }
        },
        computed: {
            mergedCount() {
                return this.pullRequestReviewContribution.contributions.nodes.filter(i => {
                    return i.pullRequest.state == 'MERGED'
                }).length
            },
            openCount() {
                return this.pullRequestReviewContribution.contributions.nodes.filter(i => {
                    return i.pullRequest.state == 'OPEN'
                }).length
            },
            closedCount() {
                return this.pullRequestReviewContribution.contributions.nodes.filter(i => {
                    return i.pullRequest.state == 'CLOSED'
                }).length
            },
        },
        methods: {
            triggerStretch() {
                this.stretch = !this.stretch
            }
        },
        components: {
            AnimatedHeightWrapper,
            IssueIcon,
            Container: styled.div``,
            Content: styled.div``,
            PullRequestCount: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/layout/index.scss';
@import 'node_modules/@primer/css/truncate/index.scss';
@import 'node_modules/@primer/css/labels/index.scss';
.profile-rollup-icon {
    display: inline-block;
    width: 16px;
    text-align: center;
}
</style>