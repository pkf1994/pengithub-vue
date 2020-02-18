<template>
    <Container>
        <Comment v-if="data.event === 'commented'"></Comment>
        <!-- added_to_project  -->
        <Other v-else-if="data.event === 'added_to_project'" :data="data">
            <template v-slot:icon>
                <svg class="octicon" viewBox="0 0 15 16" version="1.1" width="15" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 12h3V2h-3v10zm-4-2h3V2H6v8zm-4 4h3V2H2v12zm-1 1h13V1H1v14zM14 0H1a1 1 0 00-1 1v14a1 1 0 001 1h13a1 1 0 001-1V1a1 1 0 00-1-1z"></path></svg>
            </template>
            <template v-slot:action>
                added this to <strong>{{data.project_card.column_name}}</strong> in <!-- {{project.name}} -->
            </template>
        </Other>
        <!-- moved_columns_in_project  -->
        <Other v-else-if="data.event === 'moved_columns_in_project'" :data="data">
            <template v-slot:icon>
                <svg class="octicon" viewBox="0 0 15 16" version="1.1" width="15" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 12h3V2h-3v10zm-4-2h3V2H6v8zm-4 4h3V2H2v12zm-1 1h13V1H1v14zM14 0H1a1 1 0 00-1 1v14a1 1 0 001 1h13a1 1 0 001-1V1a1 1 0 00-1-1z"></path></svg>
            </template>
            <template v-slot:action>
                moved this from <strong>{{data.project_card.previous_column_name}}</strong> to <strong>{{data.project_card.column_name}}</strong> in <!-- {{project.name}} -->
            </template>
        </Other>
        <!-- removed_from_project  -->
        <Other v-else-if="data.event === 'removed_from_project'" :data="data">
            <template v-slot:icon>
                <svg class="octicon" viewBox="0 0 15 16" version="1.1" width="15" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 12h3V2h-3v10zm-4-2h3V2H6v8zm-4 4h3V2H2v12zm-1 1h13V1H1v14zM14 0H1a1 1 0 00-1 1v14a1 1 0 001 1h13a1 1 0 001-1V1a1 1 0 00-1-1z"></path></svg>
            </template>
            <template v-slot:action>
                removed this from <strong>{{data.project_card.column_name}}</strong> in <!-- {{project.name}} -->
            </template>
        </Other>
        <!-- assigned  -->
        <Other v-else-if="data.event === 'assigned'" :data="data">
            <template v-slot:icon>
                <svg class="octicon" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 14.002a.998.998 0 01-.998.998H1.001A1 1 0 010 13.999V13c0-2.633 4-4 4-4s.229-.409 0-1c-.841-.62-.944-1.59-1-4 .173-2.413 1.867-3 3-3s2.827.586 3 3c-.056 2.41-.159 3.38-1 4-.229.59 0 1 0 1s4 1.367 4 4v1.002z"></path></svg>
            </template>
            <template v-slot:action>
                assigned <strong>{{data.assignee.login}}</strong>
            </template>
        </Other>
        <!-- unassigned  -->
        <Other v-else-if="data.event === 'unassigned'" :data="data">
            <template v-slot:icon>
                <svg class="octicon" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 14.002a.998.998 0 01-.998.998H1.001A1 1 0 010 13.999V13c0-2.633 4-4 4-4s.229-.409 0-1c-.841-.62-.944-1.59-1-4 .173-2.413 1.867-3 3-3s2.827.586 3 3c-.056 2.41-.159 3.38-1 4-.229.59 0 1 0 1s4 1.367 4 4v1.002z"></path></svg>
            </template>
            <template v-slot:action>
                unassigned <strong>{{data.assignee.login}}</strong>
            </template>
        </Other>
        <!-- assigned-merged  -->
        <Other v-else-if="data.event === 'assigned-merged'" :data="data">
            <template v-slot:icon>
                <svg class="octicon" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 14.002a.998.998 0 01-.998.998H1.001A1 1 0 010 13.999V13c0-2.633 4-4 4-4s.229-.409 0-1c-.841-.62-.944-1.59-1-4 .173-2.413 1.867-3 3-3s2.827.586 3 3c-.056 2.41-.159 3.38-1 4-.229.59 0 1 0 1s4 1.367 4 4v1.002z"></path></svg>
            </template>
            <template v-slot:action>
                <span v-if="data.assignee_added">
                    <span v-for="(item,index) in data.assignee_added" :key="item.id">
                       {{index === 0 ? 'assigned' : 'and'}} <strong>{{item.login}}</strong>
                    </span>
                </span>
                <span v-if="data.assignee_removed">and</span>
                <span v-if="data.assignee_removed">
                    <span v-for="(item,index) in data.assignee_removed" :key="item.id">
                       {{index === 0 ? 'unassigned' : 'and'}} <strong>{{item.login}}</strong>
                    </span>
                </span>
            </template>
        </Other>
        <!-- closed  -->
        <Other v-else-if="data.event === 'closed'" :data="data">
            <template v-slot:icon>
                <svg class="octicon" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 14.002a.998.998 0 01-.998.998H1.001A1 1 0 010 13.999V13c0-2.633 4-4 4-4s.229-.409 0-1c-.841-.62-.944-1.59-1-4 .173-2.413 1.867-3 3-3s2.827.586 3 3c-.056 2.41-.159 3.38-1 4-.229.59 0 1 0 1s4 1.367 4 4v1.002z"></path></svg>
            </template>
            <template v-slot:action>
                closed this
            </template>
        </Other>
        <!-- reopened  -->
        <Other v-else-if="data.event === 'reopened'" :data="data">
            <template v-slot:icon>
                <svg class="octicon" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 14.002a.998.998 0 01-.998.998H1.001A1 1 0 010 13.999V13c0-2.633 4-4 4-4s.229-.409 0-1c-.841-.62-.944-1.59-1-4 .173-2.413 1.867-3 3-3s2.827.586 3 3c-.056 2.41-.159 3.38-1 4-.229.59 0 1 0 1s4 1.367 4 4v1.002z"></path></svg>
            </template>
            <template v-slot:action>
                reopened this
            </template>
        </Other>
        <!-- cross-referenced  -->
        <Other v-else-if="data.event === 'cross-referenced'" :data="data">
            <template v-slot:icon>
                <svg class="octicon" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 14.002a.998.998 0 01-.998.998H1.001A1 1 0 010 13.999V13c0-2.633 4-4 4-4s.229-.409 0-1c-.841-.62-.944-1.59-1-4 .173-2.413 1.867-3 3-3s2.827.586 3 3c-.056 2.41-.159 3.38-1 4-.229.59 0 1 0 1s4 1.367 4 4v1.002z"></path></svg>
            </template>
            <template v-slot:action>
                mentioned this issue
            </template>
            <template v-slot:additional>
                <SourceIssue class="mt-2 flex">
                    <IssueTitle>
                        <router-link to="/" class="text-bold f4 link-gray-dark">
                            {{data.source.issue.title}}
                            <span class="text-normal text-gray">#{{data.source.issue.number}}</span>
                        </router-link>
                    </IssueTitle>

                    <IssueState class="flex-shrink-0 ml-3">
                        <span class="issue-state State--small State--green State">
                            <svg height="14" class="octicon" viewBox="0 0 14 16" version="1.1" width="12" aria-hidden="true"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>
                            {{data.source.issue.state}}
                        </span>
                    </IssueState>
                </SourceIssue>
            </template>
        </Other>
        <!-- referenced  -->
        <Other v-else-if="data.event === 'referenced'" :data="data">
            <template v-slot:icon>
                <svg class="octicon" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 14.002a.998.998 0 01-.998.998H1.001A1 1 0 010 13.999V13c0-2.633 4-4 4-4s.229-.409 0-1c-.841-.62-.944-1.59-1-4 .173-2.413 1.867-3 3-3s2.827.586 3 3c-.056 2.41-.159 3.38-1 4-.229.59 0 1 0 1s4 1.367 4 4v1.002z"></path></svg>
            </template>
            <template v-slot:action>
                added a commit that referenced this issue
            </template>
           <!--  <template v-slot:additional>
                <SourceCommit class="mt-3 flex">
                    <img class="mr-2" :src="data.actor.avatar_url" :alt="`@${data.actor.login}`" height="20" width="20">

                    <code class="d-inline-block mr-1 flex-grow-1">
                        <router-link to="/">{{commit.message}}</router-link>
                        <router-link to="/">#{{issueNumber}}</router-link>
                    </code>

                    <code>
                        <router-link to="/">{{commit.abbreviatedOid}}</router-link>
                    </code>
                </SourceCommit>
            </template> -->
        </Other>
        <!-- milestoned  -->
        <Other v-else-if="data.event === 'milestoned'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-milestone" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2H6V0h2v2zm4 5H2c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h10l2 2-2 2zM8 4H6v2h2V4zM6 16h2V8H6v8z"></path></svg>
            </template>
            <template v-slot:action>
                added this to the <strong>{{milestone.title}}</strong> milestone
            </template>
        </Other>
        <!-- demilestoned  -->
        <Other v-else-if="data.event === 'demilestoned'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-milestone" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2H6V0h2v2zm4 5H2c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h10l2 2-2 2zM8 4H6v2h2V4zM6 16h2V8H6v8z"></path></svg>
            </template>
            <template v-slot:action>
                removed this from the <strong>{{milestone.title}}</strong> milestone
            </template>
        </Other>
        <!-- milestoned-merged  -->
        <Other v-else-if="data.event === 'milestoned-merged'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-milestone" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2H6V0h2v2zm4 5H2c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h10l2 2-2 2zM8 4H6v2h2V4zM6 16h2V8H6v8z"></path></svg>
            </template>
            <template v-slot:action>
                modified the milestones:
                <strong v-for="(item,index) in data.milestones" :key="item.title">{{item.title}}{{data.milestones.length > index ? ',' : ''}}</strong>
            </template>
        </Other>
        <!-- labeled  -->
        <Other v-else-if="data.event === 'labeled'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-tag" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 000-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path></svg>
            </template>
            <template v-slot:action>
                added 
                <Label :name="data.label.name" :color="data.label.color"/>
                label
            </template>
        </Other>
        <!-- unlabeled  -->
        <Other v-else-if="data.event === 'unlabeled'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-tag" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 000-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path></svg>
            </template>
            <template v-slot:action>
                removed 
                <Label :name="data.label.name" :color="data.label.color"/>
                label
            </template>
        </Other>
        <!-- labeled-merge  -->
        <Other v-else-if="data.event === 'labeled-merged'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-tag" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 000-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path></svg>
            </template>
            <template v-slot:action>
                <span v-if="data.labels_added">
                    add
                    <Label v-for="item in data.labels_added" :key="item.name" :name="item.name" :color="item.color"></Label>
                </span>
                <span v-if="data.labels_added && data.labels_removed">and</span>
                <span v-if="data.labels_removed">
                    removed
                    <Label v-for="item in data.labels_removed" :key="item.name" :name="item.name" :color="item.color"></Label>
                </span>
                labels
            </template>
        </Other>
        <!-- locked  -->
        <Other v-else-if="data.event === 'locked'" :data="data" :badgeStyle="{backgroundColor: '#24292e;',color:'#fff'}">
            <template v-slot:icon>
                <svg class="octicon octicon-lock" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 13H3v-1h1v1zm8-6v7c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h1V4c0-2.2 1.8-4 4-4s4 1.8 4 4v2h1c.55 0 1 .45 1 1zM3.8 6h4.41V4c0-1.22-.98-2.2-2.2-2.2-1.22 0-2.2.98-2.2 2.2v2H3.8zM11 7H2v7h9V7zM4 8H3v1h1V8zm0 2H3v1h1v-1z"></path></svg>
            </template>
            <template v-slot:action>
                locked <!-- as <strong>{{lockReason}}</strong> and -->limited conversation to collaborators
            </template>
        </Other>
        <!-- unlocked  -->
        <Other v-else-if="data.event === 'locked'" :data="data" :badgeStyle="{backgroundColor: '#24292e;',color:'#fff'}">
            <template v-slot:icon>
                <svg class="octicon octicon-key" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12.83 2.17C12.08 1.42 11.14 1.03 10 1c-1.13.03-2.08.42-2.83 1.17S6.04 3.86 6.01 5c0 .3.03.59.09.89L0 12v1l1 1h2l1-1v-1h1v-1h1v-1h2l1.09-1.11c.3.08.59.11.91.11 1.14-.03 2.08-.42 2.83-1.17S13.97 6.14 14 5c-.03-1.14-.42-2.08-1.17-2.83zM11 5.38c-.77 0-1.38-.61-1.38-1.38 0-.77.61-1.38 1.38-1.38.77 0 1.38.61 1.38 1.38 0 .77-.61 1.38-1.38 1.38z"></path></svg>
            </template>
            <template v-slot:action>
                unlocked this conversation
            </template>
        </Other>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import Comment from './Comment'
    import Other from './Other'
    import {Label} from '../../../../../components'
    export default {
        props: {
            data: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                project: {},
                lockReason: '',
                commit: {} // referenced
            }
        },
        computed: {
            issueNumber() {
                return this.$route.params.number
            }
        },
        created() {

        },
        components: {
            Comment,
            Other,
            Label,
            Container: styled.div``,
            SourceIssue: styled.div``,
            IssueTitle: styled.div``,
            IssueState: styled.div``,
            SourceCommit: styled.div``,
        }
    }
</script>

<style scoped>
.issue-state{
    text-transform: Capitalize
}
</style>