<template>
    <Container>
        <Comment v-if="data.event === 'commented'" 
                :data="data" 
                @quote="(payload) => $emit('quote',payload)"
                @update-comment="payload => $emit('update-comment',payload)"
                @minimize-comment="(payload) => $emit('minimize-comment',payload)"
                @unminimize-comment="(payload) => $emit('unminimize-comment',payload)"
         ></Comment>
        <!-- similar_comment -->
        <SimilarComments v-else-if="data.event === 'similar_comment'" :data="data"></SimilarComments>
        <!-- pinned  -->
        <Other v-else-if="data.event === 'pinned'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-pin" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 1.2V2l.5 1L6 6H2.2c-.44 0-.67.53-.34.86L5 10l-4 5 5-4 3.14 3.14a.5.5 0 00.86-.34V10l3-4.5 1 .5h.8c.44 0 .67-.53.34-.86L10.86.86a.5.5 0 00-.86.34z"></path></svg>
            </template>
            <template v-slot:action>
                pinned this issue
            </template>
        </Other>
        <!-- unpinned  -->
        <Other v-else-if="data.event === 'unpinned'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-pin" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 1.2V2l.5 1L6 6H2.2c-.44 0-.67.53-.34.86L5 10l-4 5 5-4 3.14 3.14a.5.5 0 00.86-.34V10l3-4.5 1 .5h.8c.44 0 .67-.53.34-.86L10.86.86a.5.5 0 00-.86.34z"></path></svg>
            </template>
            <template v-slot:action>
                 unpinned this issue
            </template>
        </Other>
        <!-- added_to_project  -->
        <Other v-else-if="data.event === 'added_to_project'" :data="data">
            <template v-slot:icon>
                <svg class="octicon" :class="{'loading-animation':loading}" viewBox="0 0 15 16" version="1.1" width="15" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 12h3V2h-3v10zm-4-2h3V2H6v8zm-4 4h3V2H2v12zm-1 1h13V1H1v14zM14 0H1a1 1 0 00-1 1v14a1 1 0 001 1h13a1 1 0 001-1V1a1 1 0 00-1-1z"></path></svg>
            </template>
            <template v-slot:action>
                added this to <strong>{{data.project_card.column_name}}</strong> in <strong>{{project.name}}</strong>
            </template>
        </Other>
        <!-- removed_from_project  -->
        <Other v-else-if="data.event === 'removed_from_project'" :data="data">
            <template v-slot:icon>
                <svg class="octicon" :class="{'loading-animation':loading}" viewBox="0 0 15 16" version="1.1" width="15" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 12h3V2h-3v10zm-4-2h3V2H6v8zm-4 4h3V2H2v12zm-1 1h13V1H1v14zM14 0H1a1 1 0 00-1 1v14a1 1 0 001 1h13a1 1 0 001-1V1a1 1 0 00-1-1z"></path></svg>
            </template>
            <template v-slot:action>
                removed this from <strong>{{data.project_card.column_name}}</strong> in <strong>{{project.name}}</strong>
            </template>
        </Other>
        
        <!-- moved_columns_in_project  -->
        <Other v-else-if="data.event === 'moved_columns_in_project'" :data="data">
            <template v-slot:icon>
                <svg class="octicon" :class="{'loading-animation':loading}" viewBox="0 0 15 16" version="1.1" width="15" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 12h3V2h-3v10zm-4-2h3V2H6v8zm-4 4h3V2H2v12zm-1 1h13V1H1v14zM14 0H1a1 1 0 00-1 1v14a1 1 0 001 1h13a1 1 0 001-1V1a1 1 0 00-1-1z"></path></svg>
            </template>
            <template v-slot:action>
                moved this from <strong>{{data.project_card.previous_column_name}}</strong> to <strong>{{data.project_card.column_name}}</strong> in {{project.name}}
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
        <!-- assigned_merged  -->
        <Other v-else-if="data.event === 'assigned_merged'" :data="data">
            <template v-slot:icon>
                <svg class="octicon" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 14.002a.998.998 0 01-.998.998H1.001A1 1 0 010 13.999V13c0-2.633 4-4 4-4s.229-.409 0-1c-.841-.62-.944-1.59-1-4 .173-2.413 1.867-3 3-3s2.827.586 3 3c-.056 2.41-.159 3.38-1 4-.229.59 0 1 0 1s4 1.367 4 4v1.002z"></path></svg>
            </template>
            <template v-slot:action>
                <span v-if="data.assignee_added">
                    <span v-for="(item,index) in data.assignee_added" :key="item.id">
                       {{index === 0 ? 'assigned' : 'and'}} <strong>{{item.login}}</strong>
                    </span>
                </span>
                <span v-if="data.assignee_removed && data.assignee_removed.length > 0">and</span>
                <span v-if="data.assignee_removed">
                    <span v-for="(item,index) in data.assignee_removed" :key="item.id">
                       {{index === 0 ? 'unassigned' : 'and'}} <strong>{{item.login}}</strong>
                    </span>
                </span>
            </template>
        </Other>
        <!-- closed  -->
        <Other v-else-if="data.event === 'closed'" :data="data" :badgeStyle="{color:'#fff',backgroundColor:'#d73a49'}">
            <template v-slot:icon>
                <svg class="octicon octicon-circle-slash" :class="{'loading-animation':loading}" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm0 1.3c1.3 0 2.5.44 3.47 1.17l-8 8A5.755 5.755 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zm0 11.41c-1.3 0-2.5-.44-3.47-1.17l8-8c.73.97 1.17 2.17 1.17 3.47 0 3.14-2.56 5.7-5.7 5.7z"></path></svg>
            </template>
            <template v-slot:action>
                closed this
                <router-link to="/" v-if="data.commit_id">in {{`${owner()}/${repo()}@${commit.sha && commit.sha.substring(0,7)}`}}</router-link>
            </template>
        </Other>
        <!-- reopened  -->
        <Other v-else-if="data.event === 'reopened'" :data="data" :badgeStyle="{color:'#fff',backgroundColor:'#28a745'}">
            <template v-slot:icon :badgeStyle="{color:'#fff',backgroundColor:'#28a745'}">
                <svg class="octicon octicon-primitive-dot" viewBox="0 0 8 16" version="1.1" width="8" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 8c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z"></path></svg>
            </template>
            <template v-slot:action>
                reopened this
            </template>
        </Other>
        <!-- cross-referenced (by issue) -->
        <Other v-else-if="data.event === 'cross-referenced' && (!data.source.issue.pull_request)" :data="data">
            <template v-slot:icon>
                <svg class="octicon" :class="{'loading-animation':loading}" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 14.002a.998.998 0 01-.998.998H1.001A1 1 0 010 13.999V13c0-2.633 4-4 4-4s.229-.409 0-1c-.841-.62-.944-1.59-1-4 .173-2.413 1.867-3 3-3s2.827.586 3 3c-.056 2.41-.159 3.38-1 4-.229.59 0 1 0 1s4 1.367 4 4v1.002z"></path></svg>
            </template>
            <template v-slot:action>
                mentioned this issue
            </template>
            <template v-slot:additional>
                <SourceIssue class="mt-2 d-flex flex-justify-between">
                    <IssueTitle>
                        <router-link to="/" class="text-bold f4 link-gray-dark">
                            {{data.source.issue.title}}
                            <span class="text-normal text-gray">#{{data.source.issue.number}}</span>
                        </router-link>
                    </IssueTitle>

                    <IssueState class="flex-shrink-0 ml-3">
                        <span class="issue-state State--small  State" :class="{'State--green':data.source.issue.state === 'open','State--red':data.source.issue.state === 'closed'}">
                            <svg v-if="data.source.issue.state === 'open'" height="14" class="octicon" viewBox="0 0 14 16" version="1.1" width="12" aria-hidden="true"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>
                            <svg v-else height="14" class="octicon octicon-issue-closed" viewBox="0 0 16 16" version="1.1" width="14" aria-hidden="true"><path fill-rule="evenodd" d="M7 10h2v2H7v-2zm2-6H7v5h2V4zm1.5 1.5l-1 1L12 9l4-4.5-1-1L12 7l-1.5-1.5zM8 13.7A5.71 5.71 0 012.3 8c0-3.14 2.56-5.7 5.7-5.7 1.83 0 3.45.88 4.5 2.2l.92-.92A6.947 6.947 0 008 1C4.14 1 1 4.14 1 8s3.14 7 7 7 7-3.14 7-7l-1.52 1.52c-.66 2.41-2.86 4.19-5.48 4.19v-.01z"></path></svg>
                            {{data.source.issue.state}}
                        </span>
                    </IssueState>
                </SourceIssue>
            </template>
        </Other>
        <!-- cross-referenced (by pullRequest) -->
        <Other v-else-if="data.event === 'cross-referenced' && data.source.issue.pull_request" :data="data">
            <template v-slot:icon>
                <svg class="octicon" :class="{'loading-animation':loading}" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 14.002a.998.998 0 01-.998.998H1.001A1 1 0 010 13.999V13c0-2.633 4-4 4-4s.229-.409 0-1c-.841-.62-.944-1.59-1-4 .173-2.413 1.867-3 3-3s2.827.586 3 3c-.056 2.41-.159 3.38-1 4-.229.59 0 1 0 1s4 1.367 4 4v1.002z"></path></svg>
            </template>
            <template v-slot:action>
                mentioned this issue
            </template>
            <template v-slot:additional>
                <AnimatedHeightWrapper class="mt-2" :stretch="pullRequest.id !== undefined">
                     <SourceIssue class="d-flex flex-justify-between">
                        <IssueTitle>
                            <router-link to="/" class="text-bold f4 link-gray-dark">
                                {{data.source.issue.title}}
                                <span class="text-normal text-gray">#{{data.source.issue.number}}</span>
                            </router-link>
                        </IssueTitle>

                        <IssueState class="flex-shrink-0 ml-3">
                            <span class="issue-state State--small  State" :class="{'State--green':pullRequest.state === 'OPEN','State--purple':pullRequest.merged === true,'State--red':(pullRequest.merged === false && pullRequest.state === 'CLOSED')}">
                                <svg v-if="pullRequest.merged" height="14" class="octicon octicon-git-merge" viewBox="0 0 12 16" version="1.1" width="10" aria-hidden="true"><path fill-rule="evenodd" d="M10 7c-.73 0-1.38.41-1.73 1.02V8C7.22 7.98 6 7.64 5.14 6.98c-.75-.58-1.5-1.61-1.89-2.44A1.993 1.993 0 002 .99C.89.99 0 1.89 0 3a2 2 0 001 1.72v6.56c-.59.35-1 .99-1 1.72 0 1.11.89 2 2 2a1.993 1.993 0 001-3.72V7.67c.67.7 1.44 1.27 2.3 1.69.86.42 2.03.63 2.97.64v-.02c.36.61 1 1.02 1.73 1.02 1.11 0 2-.89 2-2 0-1.11-.89-2-2-2zm-6.8 6c0 .66-.55 1.2-1.2 1.2-.65 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm8 6c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
                                <svg v-else height="14" class="octicon octicon-git-pull-request" viewBox="0 0 12 16" version="1.1" width="10" aria-hidden="true"><path fill-rule="evenodd" d="M11 11.28V5c-.03-.78-.34-1.47-.94-2.06C9.46 2.35 8.78 2.03 8 2H7V0L4 3l3 3V4h1c.27.02.48.11.69.31.21.2.3.42.31.69v6.28A1.993 1.993 0 0010 15a1.993 1.993 0 001-3.72zm-1 2.92c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zM4 3c0-1.11-.89-2-2-2a1.993 1.993 0 00-1 3.72v6.56A1.993 1.993 0 002 15a1.993 1.993 0 001-3.72V4.72c.59-.34 1-.98 1-1.72zm-.8 10c0 .66-.55 1.2-1.2 1.2-.65 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
                                {{pullRequest.merged ? 'merged' : pullRequest.state}}
                            </span>
                        </IssueState>
                    </SourceIssue>
                    
                    <TaskProgress class="task-progress" v-if="pullRequestTaskProgress">
                        <svg class="octicon octicon-checklist" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M16 8.5l-6 6-3-3L8.5 10l1.5 1.5L14.5 7 16 8.5zM5.7 12.2l.8.8H2c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h7c.55 0 1 .45 1 1v6.5l-.8-.8c-.39-.39-1.03-.39-1.42 0L5.7 10.8a.996.996 0 000 1.41v-.01zM4 4h5V3H4v1zm0 2h5V5H4v1zm0 2h3V7H4v1zM3 9H2v1h1V9zm0-2H2v1h1V7zm0-2H2v1h1V5zm0-2H2v1h1V3z"></path></svg>
                        <span class="task-progress-counts">{{pullRequestTaskProgress.checked}} of {{pullRequestTaskProgress.all}} tasks complete</span>
                        <ProgressBar class="progress-bar v-align-middle">
                            <span class="progress" :style="{width: pullRequestTaskProgress.checked/pullRequestTaskProgress.all}"></span>
                        </ProgressBar>
                    </TaskProgress>

                </AnimatedHeightWrapper>
            </template>
        </Other>
        <!-- referenced  -->
        <Other v-else-if="data.event === 'referenced'" :data="data" :showActorAvatar="false">
            <template v-slot:icon>
                <svg class="octicon octicon-bookmark" :class="{'loading-animation':loading}" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M9 0H1C.27 0 0 .27 0 1v15l5-3.09L10 16V1c0-.73-.27-1-1-1zm-.78 4.25L6.36 5.61l.72 2.16c.06.22-.02.28-.2.17L5 6.6 3.12 7.94c-.19.11-.25.05-.2-.17l.72-2.16-1.86-1.36c-.17-.16-.14-.23.09-.23l2.3-.03.7-2.16h.25l.7 2.16 2.3.03c.23 0 .27.08.09.23h.01z"></path></svg>
            </template>
            <template v-slot:action>
                added a commit to {{repoFullNameOfCommit}} that referenced this issue
            </template>
            <template v-slot:additional>
                <SourceCommit class="mt-3 d-flex">
                    <ImgWrapper>
                        <img class="mr-2" :src="data.actor.avatar_url" :alt="`@${data.actor.login}`" height="20" width="20">
                    </ImgWrapper>

                    <code class="d-inline-block mr-1 flex-grow-1 mr-3">
                        <router-link to="/" class="link-gray" v-html="referenceHighlightMessageOfCommit"></router-link>
                    </code>

                    <code class="flex-shrink-0">
                        <router-link to="/" class="link-gray">{{commit.sha && commit.sha.substring(0,7)}}</router-link>
                    </code>
                </SourceCommit>
            </template>
        </Other>
        <!-- milestoned  -->
        <Other v-else-if="data.event === 'milestoned'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-milestone" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2H6V0h2v2zm4 5H2c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h10l2 2-2 2zM8 4H6v2h2V4zM6 16h2V8H6v8z"></path></svg>
            </template>
            <template v-slot:action>
                added this to the <strong>{{data.milestone.title}}</strong> milestone
            </template>
        </Other>
        <!-- demilestoned  -->
        <Other v-else-if="data.event === 'demilestoned'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-milestone" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2H6V0h2v2zm4 5H2c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h10l2 2-2 2zM8 4H6v2h2V4zM6 16h2V8H6v8z"></path></svg>
            </template>
            <template v-slot:action>
                removed this from the <strong>{{data.milestone.title}}</strong> milestone
            </template>
        </Other>
        <!-- milestoned_merged  -->
        <Other v-else-if="data.event === 'milestoned_merged'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-milestone" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2H6V0h2v2zm4 5H2c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h10l2 2-2 2zM8 4H6v2h2V4zM6 16h2V8H6v8z"></path></svg>
            </template>
            <template v-slot:action>
                modified the milestones:
                <strong v-for="(item,index) in data.milestones" :key="item.title">{{item.title}}{{index < data.milestones.length - 1 ? ', ' : ''}}</strong>
            </template>
        </Other>
        <!-- labeled  -->
        <Other v-else-if="data.event === 'labeled'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-tag" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 000-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path></svg>
            </template>
            <template v-slot:action>
                added the
                <Label :name="data.label.name" :color="`#${data.label.color}`"/>
                label
            </template>
        </Other>
        <!-- unlabeled  -->
        <Other v-else-if="data.event === 'unlabeled'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-tag" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 000-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path></svg>
            </template>
            <template v-slot:action>
                removed the
                <Label :name="data.label.name" :color="`#${data.label.color}`"/>
                label
            </template>
        </Other>
        <!-- labeled-merge  -->
        <Other v-else-if="data.event === 'labeled_merged'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-tag" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 000-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path></svg>
            </template>
            <template v-slot:action>
                <span v-if="data.labels_added">
                    add
                    <Label class="mr-1" v-for="item in data.labels_added" :key="item.name" :name="item.name" :color="`#${item.color}`"></Label>
                </span>
                <span v-if="data.labels_added && data.labels_removed">and</span>
                <span v-if="data.labels_removed">
                    removed
                    <Label class="mr-1" v-for="item in data.labels_removed" :key="item.name" :name="item.name" :color="`#${item.color}`"></Label>
                </span>
                labels
            </template>
        </Other>
        <!-- locked  -->
        <Other v-else-if="data.event === 'locked'" 
                :showActor="data.actor.login !== owner && data.actor.login !== 'ghost'" 
                :data="data" 
                :badgeStyle="{backgroundColor: '#24292e',color:'#fff'}">
            <template v-slot:icon>
                <svg class="octicon octicon-lock" :class="{'loading-animation':loading}" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 13H3v-1h1v1zm8-6v7c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h1V4c0-2.2 1.8-4 4-4s4 1.8 4 4v2h1c.55 0 1 .45 1 1zM3.8 6h4.41V4c0-1.22-.98-2.2-2.2-2.2-1.22 0-2.2.98-2.2 2.2v2H3.8zM11 7H2v7h9V7zM4 8H3v1h1V8zm0 2H3v1h1v-1z"></path></svg>
            </template>
            <template v-slot:action>
               {{data.actor.login === owner || data.actor.login === 'ghost' ? "Repository owner" : ''}} locked as <strong>{{lockReason}}</strong> and limited conversation to collaborators
            </template>
        </Other>
        <!-- unlocked  -->
        <Other  v-else-if="data.event === 'unlocked'" 
                :showActor="data.actor.login !== owner && data.actor.login !== 'ghost'" 
                :data="data" 
                :badgeStyle="{backgroundColor: '#24292e',color:'#fff'}">
            <template v-slot:icon>
                <svg class="octicon octicon-key" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12.83 2.17C12.08 1.42 11.14 1.03 10 1c-1.13.03-2.08.42-2.83 1.17S6.04 3.86 6.01 5c0 .3.03.59.09.89L0 12v1l1 1h2l1-1v-1h1v-1h1v-1h2l1.09-1.11c.3.08.59.11.91.11 1.14-.03 2.08-.42 2.83-1.17S13.97 6.14 14 5c-.03-1.14-.42-2.08-1.17-2.83zM11 5.38c-.77 0-1.38-.61-1.38-1.38 0-.77.61-1.38 1.38-1.38.77 0 1.38.61 1.38 1.38 0 .77-.61 1.38-1.38 1.38z"></path></svg>
            </template>
            <template v-slot:action>
                {{data.actor.login === owner || data.actor.login === 'ghost' ? "Repository owner" : ''}} unlocked this conversation
            </template>
        </Other>
         <!-- renamed  -->
        <Other v-else-if="data.event === 'renamed'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-pencil" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 12v3h3l8-8-3-3-8 8zm3 2H1v-2h1v1h1v1zm10.3-9.3L12 6 9 3l1.3-1.3a.996.996 0 011.41 0l1.59 1.59c.39.39.39 1.02 0 1.41z"></path></svg>
            </template>
            <template v-slot:action>
                changed the title 
                <del class="text-bold">{{data.rename.from}}</del>
                <strong>{{data.rename.to}}</strong>
            </template>
        </Other>
         <!-- transferred  -->
        <Other v-else-if="data.event === 'transferred'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-primitive-dot" :class="{'loading-animation':loading}" viewBox="0 0 8 16" version="1.1" width="8" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 8c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z"></path></svg>
            </template>
            <template v-slot:action>
                 transferred this issue from {{transferredFrom}}<!-- {{transferredEvent.fromRepository.owner}}/{{transferredEvent.fromRepository.repo}} -->
            </template>
        </Other>
        <!-- marked_as_duplicate  -->
        <Other v-else-if="data.event === 'marked_as_duplicate'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-bookmark" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M9 0H1C.27 0 0 .27 0 1v15l5-3.09L10 16V1c0-.73-.27-1-1-1zm-.78 4.25L6.36 5.61l.72 2.16c.06.22-.02.28-.2.17L5 6.6 3.12 7.94c-.19.11-.25.05-.2-.17l.72-2.16-1.86-1.36c-.17-.16-.14-.23.09-.23l2.3-.03.7-2.16h.25l.7 2.16 2.3.03c.23 0 .27.08.09.23h.01z"></path></svg>
            </template>
            <template v-slot:action>
                marked this as a duplicate
            </template>
        </Other>
        <!-- unmarked_as_duplicate  -->
        <Other v-else-if="data.event === 'unmarked_as_duplicate'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-bookmark" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M9 0H1C.27 0 0 .27 0 1v15l5-3.09L10 16V1c0-.73-.27-1-1-1zm-.78 4.25L6.36 5.61l.72 2.16c.06.22-.02.28-.2.17L5 6.6 3.12 7.94c-.19.11-.25.05-.2-.17l.72-2.16-1.86-1.36c-.17-.16-.14-.23.09-.23l2.3-.03.7-2.16h.25l.7 2.16 2.3.03c.23 0 .27.08.09.23h.01z"></path></svg>
            </template>
            <template v-slot:action>
                marked this as not a duplicate
            </template>
        </Other>
        <!-- user_blocked  -->
        <Other v-else-if="data.event === 'user_blocked'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-primitive-dot" :class="{'loading-animation':loading}" viewBox="0 0 8 16" version="1.1" width="8" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 8c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z"></path></svg>
            </template>
            <template v-slot:action>
                blocked <strong>{{blockedUser.login}}</strong> 
            </template>
        </Other>
         <!-- comment_deleted  -->
        <Other v-else-if="data.event === 'comment_deleted'" 
                :data="data"  
                :showActor="(data.actor.login !== owner && data.actor.login !== 'ghost') || data.actor.type === 'Organization'" >
            <template v-slot:icon>
                <svg class="octicon octicon-x" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>
            </template>
            <template v-slot:action>
               {{(data.actor.login === owner || data.actor.login === 'ghost') && data.actor.type !== 'Organization'? "Repository owner" : ''}} deleted a comment 
            </template>
        </Other>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import Comment from './Comment'
    import Other from './Other'
    import SimilarComments from './SimilarComments'
    import {Label,AnimatedHeightWrapper,ImgWrapper} from '@/components'
    import {authRequiredGet,authRequiredGitHubGraphqlApiQuery} from '@/store/modules/network'
    export default {
        inject: ['owner','repo'],
        props: {
            data: {
                type: Object,
                required: true,
            }
        },
        data() {
            return {
                loading: false,
                project: {}, //adde_to_proj
                lockReason: '', //locked
                commit: {}, // referenced closed
                transferredFrom: '', //transferred
                blockedUser: {}, //user blocked
                pullRequest: {} //cross-referenced
            }
        },
        computed: {
            issueNumber() {
                return this.$route.params.number
            },
            repoFullNameOfCommit() {
                if(!this.commit.url) return ''
                return this.commit.url.replace('https://api.github.com/repos/','').replace(/\/commits\/\S*/g,'')
            },
            referenceHighlightMessageOfCommit() {
                if(!this.commit.commit) return ''
                let message = this.commit.commit.message
                let matchArr = message.match( /https:\/\/github.com\/\S+\/\S+\/(issues|pulls)\/[1-9][0-9]*/g)
                if(matchArr) {
                     matchArr.forEach(item => {
                        let repoFullName = item.replace('https://github.com/','').replace(/\/(issues|pulls)\/[1-9][0-9]*/g,'')
                        let commitNumber = item.replace(/https:\/\/github.com\/\S+\/\S+\/(issues|pulls)\//g,'#')
                        message = message.replace(item,`<a href="/"><strong>${repoFullName}${commitNumber}</strong></a>`)
                    })
                }
                message = message.replace(`#${this.issueNumber}`,`<strong>#${this.issueNumber}</strong>`)
                return message
            },
            pullRequestTaskProgress() {
                if(!this.pullRequest.bodyHTML) return undefined
                let reg_allCheckboxInput = /<input type="checkbox" [\s\S]*?>/g
                let reg_checkedCheckboxInput = /<input type="checkbox" [\s\S]*?checked[\s\S]*?>/g
                let checkboxMatches = this.pullRequest.bodyHTML.match(reg_allCheckboxInput)
                let checkedCheckboxMatches =this.pullRequest.bodyHTML.match(reg_checkedCheckboxInput)
                if((!checkedCheckboxMatches) && (!checkboxMatches)) return undefined
                return {
                    checked: checkedCheckboxMatches ? checkedCheckboxMatches.length : 0,
                    all: checkboxMatches ? checkboxMatches.length : 0,
                }
            }
        },
        watch: {
            commit() {
                
            }
        },
        mounted() {
            this.getAdditionalData()
           
            
        },
        methods: {
            getAdditionalData() {
                 try{
                    switch(this.data.event){
                        case "added_to_project":
                        case "moved_columns_in_project":
                        case "removed_from_project":
                            this.getRelevantProject()
                            break
                        case "locked":
                            this.getLockReason()
                            break
                        case "referenced":
                        case "closed":
                            this.getRelevantCommit()
                            break
                        case "transferred":
                            this.getTransferredFrom()
                            break
                        case "user_blocked":
                            this.getBlockedUser()
                            break
                        case "cross-referenced":
                            if(this.data.source.issue.pull_request) {
                                this.getRelevantPullRequest()
                            }
                            break
                        default:
                    }
                }catch(e) {
                    console.log(e)
                }finally{
                    this.loading = false
                }
            },
            async getRelevantCommit() {
                if(!this.data.commit_url || this.data.commit_url === null ) return
                this.loading = true
                let res = await authRequiredGet(
                    this.data.commit_url
                )
                this.commit = res.data
                this.loading = false
            },
            async getRelevantPullRequest() {
                this.loading = true
                let graphql = `
                    {
                        node(id: "${this.data.source.issue.node_id}") {
                            ... on PullRequest {
                                id
                                merged
                                state
                                bodyHTML
                            }
                        }
                    }
                `
                let res = await authRequiredGitHubGraphqlApiQuery(graphql)
                try{
                    this.pullRequest = res.data.data.node
                }catch(e) {
                    this.handleGraphqlError(res)
                }
                
                this.loading = false
            },
            async getRelevantProject() {
                if(!this.data.project_card || !this.data.project_card.project_url ) return
                this.loading = true
                let res = await authRequiredGet(
                    this.data.project_card.project_url,
                    {
                        headers: {
                            "Accept": "application/vnd.github.inertia-preview+json"
                        }
                    }
                )
                this.project = res.data
                this.loading = false
            },
            async getTransferredFrom() {
                this.loading = true
                
                let res = await authRequiredGitHubGraphqlApiQuery(
                    `
                    {
                        node(id: "${this.data.node_id}") {
                            ... on TransferredEvent {
                                fromRepository {
                                    nameWithOwner
                                }
                            }
                        }
                    }
                    `
                )
                try{
                    this.transferredFrom = res.data.data.node.fromRepository.nameWithOwner 
                }catch(e) {
                    this.handleGraphqlError(res)
                }
                this.loading = false
            },
            async getBlockedUser() {
                this.loading = true
                
                let res = await authRequiredGitHubGraphqlApiQuery(
                    `
                    {
                        node(id: "${this.data.node_id}") {
                            ... on UserBlockedEvent {
                                subject{
                                    login
                                }
                            }
                        }
                    }
                    `
                )
                try{
                    this.blockedUser = res.data.data.node.subject 
                }catch(e) {
                    this.handleGraphqlError(res)
                }
                this.loading = false
            },
            async getLockReason() {
                this.loading = true
                
                let res = await authRequiredGitHubGraphqlApiQuery(
                    `
                    {
                        node(id: "${this.data.node_id}") {
                            ... on LockedEvent {
                                lockReason
                            }
                        }
                    }
                    `
                )
                try{
                    this.lockReason = res.data.data.node.lockReason 
                }catch(e) {
                    this.handleGraphqlError(res)
                }
                this.loading = false
            }
        },
        components: {
            ImgWrapper,
            Comment,
            Other,
            Label,
            AnimatedHeightWrapper,
            SimilarComments,
            Container: styled.div``,
            SourceIssue: styled.div``,
            IssueTitle: styled.div``,
            IssueState: styled.div``,
            SourceCommit: styled.div``,
            TaskProgress: styled.div``,
            ProgressBar: styled.span``,
        }
    }
</script>

<style scoped lang='scss'>
@import 'node_modules/@primer/css/labels/index.scss';
.issue-state{
    text-transform: Capitalize
}
.task-progress{
    color: #586069;
    text-decoration: none;
    vertical-align: top;
    .task-progress-counts{
        display: inline-block;
        margin-right: 6px;
        margin-left: -2px;
        font-size: 12px;
    }
    svg{
        color: #ccc;
        vertical-align: bottom;
        margin-right: 5px;
    }
}

.progress-bar {
    display: inline-block;
    overflow: hidden;
    border-radius: 3px;
    width: 80px;
    height: 5px;
    vertical-align: 2px;
    background-color: #eee;
    .progress {
        display: block;
        height: 100%;
        background-color: #ccc;
    }
}

.loading-animation{
    animation: kf-loading 2s infinite;
}

@keyframes kf-loading {
    0%{
        opacity: 0;
    }
    50%{
        opacity: 1;
    }
    100%{
        opacity: 0;
    }
}

</style>