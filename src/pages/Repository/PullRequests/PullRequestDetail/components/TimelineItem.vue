<template>
        <Comment :propsData="data" v-if="data.event === 'commented'" class="p-3"></Comment>
        <!-- review -->
        <Review v-else-if="data.event === 'reviewed'" :propsData="data"></Review>
        <!-- committed  -->
        <SimpleTimelineItem v-else-if="data.event === 'committed'" :data="data" :date="data.committer.date">
            <template v-slot:icon>
                <svg class="octicon octicon-repo-push" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 3H3V2h1v1zM3 5h1V4H3v1zm4 0L4 9h2v7h2V9h2L7 5zm4-5H1C.45 0 0 .45 0 1v12c0 .55.45 1 1 1h4v-1H1v-2h4v-1H2V1h9.02L11 10H9v1h2v2H9v1h2c.55 0 1-.45 1-1V1c0-.55-.45-1-1-1z"></path></svg>
            </template>
            <template v-slot:action>
                added a commit
            </template>
            <template v-slot:additional>
                <Commit class="py-1 d-flex" style="margin-top:7.5px">
                    <div class="d-flex">
                        <AnimatedWidthWrapper class="flex-shrink-0">
                             <router-link v-if="commit.author && commit.author.avatar_url" :to="`/${commit.author && commit.author.login}`" class="pr-2 d-inline-block">
                                <ImgWrapper>
                                    <img class="avatar v-align-top" style="margin-top:2px" width="16" height="16" :src="commit.author && commit.author.avatar_url" :alt="`@${commit.author && commit.author.login}`">
                                </ImgWrapper>
                            </router-link>
                        </AnimatedWidthWrapper>
                       
                        <router-link :to="`/${owner()}/${repo()}/commit/${commit.sha}`" class="link-gray" style="word-break: break-word;">
                            <code>
                            {{data.message && parseEmoji(data.message.replace(/[\n\r]{2}[\S\s]*/g,''))}}
                            </code>
                        </router-link> 
                    </div> 
                    
                    <CommitMeta class="commit-meta flex-grow-1 flex-shrink-0 text-right" >
                        <CommitStatusIcon :sha="data.sha"></CommitStatusIcon>
                    </CommitMeta>
                </Commit>
            </template>
        </SimpleTimelineItem>
        <!-- commit-commented -->
        <CommitComment v-else-if="data.event === 'commit-commented'" :commitComment="data"></CommitComment>
        <!-- head_ref_deleted  -->
        <SimpleTimelineItem v-else-if="data.event === 'head_ref_deleted'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-repo-push" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 3H3V2h1v1zM3 5h1V4H3v1zm4 0L4 9h2v7h2V9h2L7 5zm4-5H1C.45 0 0 .45 0 1v12c0 .55.45 1 1 1h4v-1H1v-2h4v-1H2V1h9.02L11 10H9v1h2v2H9v1h2c.55 0 1-.45 1-1V1c0-.55-.45-1-1-1z"></path></svg>
            </template>
            <template v-slot:action>
                deleted the 
                <code class="css-truncate css-truncate-target text-bold v-align-middle" style="max-width:165px;font-size:13px">{{headRefName}}</code>
                branch
            </template>
        </SimpleTimelineItem>
        <!-- head_ref_force_pushed  -->
        <SimpleTimelineItem v-else-if="data.event === 'head_ref_force_pushed'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-repo-push" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 3H3V2h1v1zM3 5h1V4H3v1zm4 0L4 9h2v7h2V9h2L7 5zm4-5H1C.45 0 0 .45 0 1v12c0 .55.45 1 1 1h4v-1H1v-2h4v-1H2V1h9.02L11 10H9v1h2v2H9v1h2c.55 0 1-.45 1-1V1c0-.55-.45-1-1-1z"></path></svg>
            </template>
            <template v-slot:action>
                force pushed changes to this branch
            </template>
        </SimpleTimelineItem>
        <!-- pinned  -->
        <SimpleTimelineItem v-else-if="data.event === 'pinned'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-pin" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 1.2V2l.5 1L6 6H2.2c-.44 0-.67.53-.34.86L5 10l-4 5 5-4 3.14 3.14a.5.5 0 00.86-.34V10l3-4.5 1 .5h.8c.44 0 .67-.53.34-.86L10.86.86a.5.5 0 00-.86.34z"></path></svg>
            </template>
            <template v-slot:action>
                pinned this issue
            </template>
        </SimpleTimelineItem>
        <!-- unpinned  -->
        <SimpleTimelineItem v-else-if="data.event === 'unpinned'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-pin" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 1.2V2l.5 1L6 6H2.2c-.44 0-.67.53-.34.86L5 10l-4 5 5-4 3.14 3.14a.5.5 0 00.86-.34V10l3-4.5 1 .5h.8c.44 0 .67-.53.34-.86L10.86.86a.5.5 0 00-.86.34z"></path></svg>
            </template>
            <template v-slot:action>
                 unpinned this issue
            </template>
        </SimpleTimelineItem>
        <!-- added_to_project  -->
        <SimpleTimelineItem v-else-if="data.event === 'added_to_project'" :data="data">
            <template v-slot:icon>
                <svg class="octicon" :class="{'loading-animation':loading}" viewBox="0 0 15 16" version="1.1" width="15" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 12h3V2h-3v10zm-4-2h3V2H6v8zm-4 4h3V2H2v12zm-1 1h13V1H1v14zM14 0H1a1 1 0 00-1 1v14a1 1 0 001 1h13a1 1 0 001-1V1a1 1 0 00-1-1z"></path></svg>
            </template>
            <template v-slot:action>
                added this to <strong>{{data.project_card.column_name}}</strong> 
                <span v-if="project.name">
                    in <strong>{{project.name}}</strong>
                </span>    
            </template>
        </SimpleTimelineItem>
        <!-- removed_from_project  -->
        <SimpleTimelineItem v-else-if="data.event === 'removed_from_project'" :data="data">
            <template v-slot:icon>
                <svg class="octicon" :class="{'loading-animation':loading}" viewBox="0 0 15 16" version="1.1" width="15" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 12h3V2h-3v10zm-4-2h3V2H6v8zm-4 4h3V2H2v12zm-1 1h13V1H1v14zM14 0H1a1 1 0 00-1 1v14a1 1 0 001 1h13a1 1 0 001-1V1a1 1 0 00-1-1z"></path></svg>
            </template>
            <template v-slot:action>
                removed this from <strong>{{data.project_card.column_name}}</strong>
                <span v-if="project.name">
                    in <strong>{{project.name}}</strong>
                </span>   
            </template>
        </SimpleTimelineItem>
        <!-- moved_columns_in_project  -->
        <SimpleTimelineItem v-else-if="data.event === 'moved_columns_in_project'" :data="data">
            <template v-slot:icon>
                <svg class="octicon" :class="{'loading-animation':loading}" viewBox="0 0 15 16" version="1.1" width="15" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 12h3V2h-3v10zm-4-2h3V2H6v8zm-4 4h3V2H2v12zm-1 1h13V1H1v14zM14 0H1a1 1 0 00-1 1v14a1 1 0 001 1h13a1 1 0 001-1V1a1 1 0 00-1-1z"></path></svg>
            </template>
            <template v-slot:action>
                moved this from <strong>{{data.project_card.previous_column_name}}</strong> to <strong>{{data.project_card.column_name}}</strong> in {{project.name}}
            </template>
        </SimpleTimelineItem>
        <!-- assigned  -->
        <SimpleTimelineItem v-else-if="data.event === 'assigned'" :data="data">
            <template v-slot:icon>
                <svg class="octicon" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 14.002a.998.998 0 01-.998.998H1.001A1 1 0 010 13.999V13c0-2.633 4-4 4-4s.229-.409 0-1c-.841-.62-.944-1.59-1-4 .173-2.413 1.867-3 3-3s2.827.586 3 3c-.056 2.41-.159 3.38-1 4-.229.59 0 1 0 1s4 1.367 4 4v1.002z"></path></svg>
            </template>
            <template v-slot:action>
                assigned <strong>{{data.assignee.login}}</strong>
            </template>
        </SimpleTimelineItem>
        <!-- unassigned  -->
        <SimpleTimelineItem v-else-if="data.event === 'unassigned'" :data="data">
            <template v-slot:icon>
                <svg class="octicon" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 14.002a.998.998 0 01-.998.998H1.001A1 1 0 010 13.999V13c0-2.633 4-4 4-4s.229-.409 0-1c-.841-.62-.944-1.59-1-4 .173-2.413 1.867-3 3-3s2.827.586 3 3c-.056 2.41-.159 3.38-1 4-.229.59 0 1 0 1s4 1.367 4 4v1.002z"></path></svg>
            </template>
            <template v-slot:action>
                unassigned <strong>{{data.assignee.login}}</strong>
            </template>
        </SimpleTimelineItem>
        <!-- assigned_merged  -->
        <SimpleTimelineItem v-else-if="data.event === 'assigned_merged'" :data="data">
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
        </SimpleTimelineItem>
        <!-- closed  -->
        <SimpleTimelineItem v-else-if="data.event === 'closed'" :data="data" :badgeStyle="{color:'#fff',backgroundColor:'#d73a49'}">
            <template v-slot:icon>
                <svg class="octicon octicon-circle-slash text-red" :class="{'loading-animation':loading}" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm0 1.3c1.3 0 2.5.44 3.47 1.17l-8 8A5.755 5.755 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zm0 11.41c-1.3 0-2.5-.44-3.47-1.17l8-8c.73.97 1.17 2.17 1.17 3.47 0 3.14-2.56 5.7-5.7 5.7z"></path></svg>
            </template>
            <template v-slot:action>
                closed this
                <router-link to="/" v-if="data.commit_id">in {{`${owner()}/${repo()}@${commit.sha && commit.sha.substring(0,7)}`}}</router-link>
            </template>
        </SimpleTimelineItem>
        <!-- reopened  -->
        <SimpleTimelineItem v-else-if="data.event === 'reopened'" :data="data" :badgeStyle="{color:'#fff',backgroundColor:'#28a745'}">
            <template v-slot:icon :badgeStyle="{color:'#fff',backgroundColor:'#28a745'}">
                <svg class="octicon octicon-primitive-dot" viewBox="0 0 8 16" version="1.1" width="8" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 8c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z"></path></svg>
            </template>
            <template v-slot:action>
                reopened this
            </template>
        </SimpleTimelineItem>
        <!-- cross-referenced -->
        <Referenced v-else-if="data.event === 'cross-referenced'" :data="data">
        </Referenced>
        <!-- referenced  -->
        <SimpleTimelineItem v-else-if="data.event === 'referenced'" :data="data" :showActorAvatar="false">
            <template v-slot:icon>
                <svg class="octicon octicon-bookmark" :class="{'loading-animation':loading}" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M9 0H1C.27 0 0 .27 0 1v15l5-3.09L10 16V1c0-.73-.27-1-1-1zm-.78 4.25L6.36 5.61l.72 2.16c.06.22-.02.28-.2.17L5 6.6 3.12 7.94c-.19.11-.25.05-.2-.17l.72-2.16-1.86-1.36c-.17-.16-.14-.23.09-.23l2.3-.03.7-2.16h.25l.7 2.16 2.3.03c.23 0 .27.08.09.23h.01z"></path></svg>
            </template>
            <template v-slot:action>
                added a commit to {{repoFullNameOfCommit}} that referenced this issue
            </template>
            <template v-slot:additional>
                <SourceCommit class="mt-3 flex">
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
        </SimpleTimelineItem>
        <!-- milestoned  -->
        <SimpleTimelineItem v-else-if="data.event === 'milestoned'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-milestone" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2H6V0h2v2zm4 5H2c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h10l2 2-2 2zM8 4H6v2h2V4zM6 16h2V8H6v8z"></path></svg>
            </template>
            <template v-slot:action>
                added this to the <strong>{{data.milestone.title}}</strong> milestone
            </template>
        </SimpleTimelineItem>
        <!-- demilestoned  -->
        <SimpleTimelineItem v-else-if="data.event === 'demilestoned'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-milestone" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2H6V0h2v2zm4 5H2c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h10l2 2-2 2zM8 4H6v2h2V4zM6 16h2V8H6v8z"></path></svg>
            </template>
            <template v-slot:action>
                removed this from the <strong>{{data.milestone.title}}</strong> milestone
            </template>
        </SimpleTimelineItem>
        <!-- milestoned_merged  -->
        <SimpleTimelineItem v-else-if="data.event === 'milestoned_merged'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-milestone" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2H6V0h2v2zm4 5H2c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h10l2 2-2 2zM8 4H6v2h2V4zM6 16h2V8H6v8z"></path></svg>
            </template>
            <template v-slot:action>
                modified the milestones:
                <strong v-for="(item,index) in data.milestones" :key="item.title">{{item.title}}{{index < data.milestones.length - 1 ? ', ' : ''}}</strong>
            </template>
        </SimpleTimelineItem>
        <!-- labeled  -->
        <SimpleTimelineItem v-else-if="data.event === 'labeled'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-tag" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 000-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path></svg>
            </template>
            <template v-slot:action>
                added the
                <Label :name="data.label.name" :color="`#${data.label.color}`" style="font-size:10px"/>
                label
            </template>
        </SimpleTimelineItem>
        <!-- unlabeled  -->
        <SimpleTimelineItem v-else-if="data.event === 'unlabeled'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-tag" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 000-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path></svg>
            </template>
            <template v-slot:action>
                removed the
                <Label :name="data.label.name" :color="`#${data.label.color}`" style="font-size:10px"/>
                label
            </template>
        </SimpleTimelineItem>
        <!-- labeled-merge  -->
        <SimpleTimelineItem v-else-if="data.event === 'labeled_merged'" :data="data">
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
        </SimpleTimelineItem>
        <!-- locked  -->
        <SimpleTimelineItem v-else-if="data.event === 'locked'" 
                :showActor="data.actor.login !== owner && data.actor.login !== 'ghost'" 
                :data="data" 
                :badgeStyle="{backgroundColor: '#24292e',color:'#fff'}">
            <template v-slot:icon>
                <svg class="octicon octicon-lock" :class="{'loading-animation':loading}" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 13H3v-1h1v1zm8-6v7c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h1V4c0-2.2 1.8-4 4-4s4 1.8 4 4v2h1c.55 0 1 .45 1 1zM3.8 6h4.41V4c0-1.22-.98-2.2-2.2-2.2-1.22 0-2.2.98-2.2 2.2v2H3.8zM11 7H2v7h9V7zM4 8H3v1h1V8zm0 2H3v1h1v-1z"></path></svg>
            </template>
            <template v-slot:action>
               {{data.actor.login === owner || data.actor.login === 'ghost' ? "Repository owner" : ''}} locked as <strong>{{lockReason}}</strong> and limited conversation to collaborators
            </template>
        </SimpleTimelineItem>
        <!-- unlocked  -->
        <SimpleTimelineItem  v-else-if="data.event === 'unlocked'" 
                :showActor="data.actor.login !== owner && data.actor.login !== 'ghost'" 
                :data="data" 
                :badgeStyle="{backgroundColor: '#24292e',color:'#fff'}">
            <template v-slot:icon>
                <svg class="octicon octicon-lock issue-event-icon issue-event-icon-unlocked text-green" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 13H3v-1h1v1zm8-6v7c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h1V4c0-2.2 1.8-4 4-4s4 1.8 4 4v2h1c.55 0 1 .45 1 1zM3.8 6h4.41V4c0-1.22-.98-2.2-2.2-2.2-1.22 0-2.2.98-2.2 2.2v2H3.8zM11 7H2v7h9V7zM4 8H3v1h1V8zm0 2H3v1h1v-1z"></path></svg>
            </template>
            <template v-slot:action>
                {{data.actor.login === owner || data.actor.login === 'ghost' ? "Repository owner" : ''}} unlocked this conversation
            </template>
        </SimpleTimelineItem>
         <!-- renamed  -->
        <SimpleTimelineItem v-else-if="data.event === 'renamed'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-pencil" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 12v3h3l8-8-3-3-8 8zm3 2H1v-2h1v1h1v1zm10.3-9.3L12 6 9 3l1.3-1.3a.996.996 0 011.41 0l1.59 1.59c.39.39.39 1.02 0 1.41z"></path></svg>
            </template>
            <template v-slot:action>
                changed the title 
                <del class="text-bold">{{data.rename.from}}</del>
                <strong>{{data.rename.to}}</strong>
            </template>
        </SimpleTimelineItem>
         <!-- transferred  -->
        <SimpleTimelineItem v-else-if="data.event === 'transferred'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-primitive-dot" :class="{'loading-animation':loading}" viewBox="0 0 8 16" version="1.1" width="8" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 8c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z"></path></svg>
            </template>
            <template v-slot:action>
                 transferred this issue from {{transferredFrom}}<!-- {{transferredEvent.fromRepository.owner}}/{{transferredEvent.fromRepository.repo}} -->
            </template>
        </SimpleTimelineItem>
        <!-- marked_as_duplicate  -->
        <SimpleTimelineItem v-else-if="data.event === 'marked_as_duplicate'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-bookmark" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M9 0H1C.27 0 0 .27 0 1v15l5-3.09L10 16V1c0-.73-.27-1-1-1zm-.78 4.25L6.36 5.61l.72 2.16c.06.22-.02.28-.2.17L5 6.6 3.12 7.94c-.19.11-.25.05-.2-.17l.72-2.16-1.86-1.36c-.17-.16-.14-.23.09-.23l2.3-.03.7-2.16h.25l.7 2.16 2.3.03c.23 0 .27.08.09.23h.01z"></path></svg>
            </template>
            <template v-slot:action>
                marked this as a duplicate
            </template>
        </SimpleTimelineItem>
        <!-- unmarked_as_duplicate  -->
        <SimpleTimelineItem v-else-if="data.event === 'unmarked_as_duplicate'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-bookmark" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M9 0H1C.27 0 0 .27 0 1v15l5-3.09L10 16V1c0-.73-.27-1-1-1zm-.78 4.25L6.36 5.61l.72 2.16c.06.22-.02.28-.2.17L5 6.6 3.12 7.94c-.19.11-.25.05-.2-.17l.72-2.16-1.86-1.36c-.17-.16-.14-.23.09-.23l2.3-.03.7-2.16h.25l.7 2.16 2.3.03c.23 0 .27.08.09.23h.01z"></path></svg>
            </template>
            <template v-slot:action>
                marked this as not a duplicate
            </template>
        </SimpleTimelineItem>
        <!-- user_blocked  -->
        <SimpleTimelineItem v-else-if="data.event === 'user_blocked'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-primitive-dot" :class="{'loading-animation':loading}" viewBox="0 0 8 16" version="1.1" width="8" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 8c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z"></path></svg>
            </template>
            <template v-slot:action>
                blocked <strong>{{blockedUser.login}}</strong> 
            </template>
        </SimpleTimelineItem>
         <!-- comment_deleted  -->
        <SimpleTimelineItem v-else-if="data.event === 'comment_deleted'" 
                :data="data"  
                :showActor="(data.actor.login !== owner && data.actor.login !== 'ghost') || data.actor.type === 'Organization'" >
            <template v-slot:icon>
                <svg class="octicon octicon-x" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>
            </template>
            <template v-slot:action>
               {{(data.actor.login === owner || data.actor.login === 'ghost') && data.actor.type !== 'Organization'? "Repository owner" : ''}} deleted a comment 
            </template>
        </SimpleTimelineItem>
        

        <!-- review_requested  -->
        <SimpleTimelineItem v-else-if="data.event === 'review_requested'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-eye" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.06 2C3 2 0 8 0 8s3 6 8.06 6C13 14 16 8 16 8s-3-6-7.94-6zM8 12c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4zm2-4c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"></path></svg>
            </template>
            <template v-slot:action>
                requested review from 
                <strong>{{data.requested_reviewer ? data.requested_reviewer.login : data.requested_team.login}}</strong>
            </template>
        </SimpleTimelineItem>
         <!-- review_request_removed  -->
        <!-- <SimpleTimelineItem v-else-if="data.event === 'review_request_removed'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-x" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>
            </template>
            <template v-slot:action>
                 removed the request for review from 
                <strong>{{data.requested_reviewer ? data.requested_reviewer.login : data.requested_team.login}}</strong>
            </template>
        </SimpleTimelineItem> -->
         <!-- review_dismissed  -->
        <!-- <SimpleTimelineItem v-else-if="data.event === 'review_dismissed'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-x" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>
            </template>
            <template v-slot:action>
                 dismissed the review for <strong>{{data.dismissed_review.dismissal_message}}</strong>
            </template>
        </SimpleTimelineItem> -->
         <!-- reviewed  -->
        <!-- <SimpleTimelineItem v-else-if="data.event === 'review_dismissed'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-eye" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.06 2C3 2 0 8 0 8s3 6 8.06 6C13 14 16 8 16 8s-3-6-7.94-6zM8 12c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4zm2-4c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"></path></svg>
            </template>
            <template v-slot:action>
                 dismissed the review for <strong>{{data.dismissed_review.dismissal_message}}</strong>
            </template>
        </SimpleTimelineItem> -->
        <!-- review_requested_merged  -->
        <!-- <SimpleTimelineItem v-else-if="data.event === 'review_requested_merged'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-eye" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.06 2C3 2 0 8 0 8s3 6 8.06 6C13 14 16 8 16 8s-3-6-7.94-6zM8 12c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4zm2-4c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"></path></svg>
            </template>
            <template v-slot:action>
                requested review from 
                <strong v-for="(item,index) in data.requested_reviewers" :key="item.id">
                    {{item.login}} {{data.requested_reviewers.length > index ? 'and' : ''}}
                </strong>
            </template>
        </SimpleTimelineItem> -->
</template>

<script>
    import styled from 'vue-styled-components'
    import Comment from './Comment'
    import SimpleTimelineItem from './SimpleTimelineItem'
    import Referenced from './Referenced'
    import Review from './Review'
    import {util_emoji} from '@/util'
    import {Label,AnimatedHeightWrapper,AnimatedWidthWrapper,ImgWrapper} from '@/components'
    import {CommitStatusIcon} from '../../../components'
    import CommitComment from './CommitComment/CommitComment.vue'
    import {authRequiredGet,authRequiredGitHubGraphqlApiQuery} from '@/network'
    export default {
        inject: ['owner','repo','pullRequestProvided'],
        provided() {
            timelineItemProvided: () => this.data
        },
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
                commit: {}, // referenced closed committed
                transferredFrom: '', //transferred
                blockedUser: {}, //user blocked
                commitStatus: undefined, //committed
                headRefName: '', //HeadRefDeletedEvent
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
            },
            isTheLatestCommit() {
                return this.pullRequestProvided().statuses_url.replace(/https:\/\/api\.github\.com\/repos\/[\S\s]+?\/[\S\s]+?\/statuses\//i,'') === this.data.sha
            }
        },
        watch: {
            commit() {
                
            }
        },
        mounted() {
            this.network_getAdditionalData()
        },
        methods: {
            async network_getAdditionalData() {
                 try{
                    switch(this.data.event){
                        case "added_to_project":
                        case "moved_columns_in_project":
                        case "removed_from_project":
                            await this.getRelevantProject()
                            break
                        case "locked":
                            await this.getLockReason()
                            break
                        case "referenced":
                        case "closed":
                        case "committed":
                            await this.getRelevantCommit()
                           
                            break
                        case "transferred":
                            await this.getTransferredFrom()
                            break
                        case "user_blocked":
                            await this.getBlockedUser()
                            break
                        case "head_ref_deleted":
                            await this.getHeadRefDeletedName(this.data.node_id)
                            break
                       /*  case "cross-referenced":
                            if(this.data.source.issue.pull_request) {
                                this.getRelevantPullRequest()
                            }
                            break */
                        default:
                    }
                }catch(e) {
                    console.log(e)
                }finally {
                    this.loading = false
                }
            },
            async getRelevantCommit() {
                let url = this.data.commit_url || this.data.url
                if(!url) return
                this.loading = true
                let res = await authRequiredGet(
                    url.replace('/git','')
                )
                this.commit = res.data
                this.loading = false
            },
            /* async getRelevantPullRequest() {
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
                this.pullRequest = res.data.data.node
                this.loading = false
            }, */
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
                if(!this.accessToken) return
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
                if(!this.accessToken) return
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
                if(!this.accessToken) return
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
            },
            async getHeadRefDeletedName(nodeId) {
                if(!this.accessToken) return
                try{
                    let res = await authRequiredGitHubGraphqlApiQuery(`
                        {
                            node(id: "${nodeId}") {
                                ... on HeadRefDeletedEvent {
                                   headRefName
                                }
                            }
                        }
                    `)
                    
                    try{
                        this.headRefName = res.data.data.node.headRefName
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                }catch(e) {
                    console.log(e)
                }
            },
           
            parseEmoji(raw) {
                return util_emoji.parse(raw)
            }
        },
        components: {
            Comment,
            SimpleTimelineItem,
            Label,
            AnimatedHeightWrapper,
            ImgWrapper,
            Referenced,
            Review,
            CommitComment,
            AnimatedWidthWrapper,
            CommitStatusIcon,
            CommentWrapper: styled.div``,
            SourceIssue: styled.div``,
            IssueTitle: styled.div``,
            IssueState: styled.div``,
            SourceCommit: styled.div``,
            TaskProgress: styled.div``,
            ProgressBar: styled.span``,
            Commit: styled.div` `,
            CommitMeta: styled.div` `,
        }
    }
</script>

<style scoped lang='scss'>
@import 'node_modules/@primer/css/avatars/index.scss';
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

.commit-meta{
    width: 36px;
    text-align: right;
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