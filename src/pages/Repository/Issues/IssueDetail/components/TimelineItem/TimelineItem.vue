<template>
    <Container :id="data.id">
        <Comment v-if="data.event === 'commented'" 
                :data="data" 
                @quote="(payload) => $emit('quote',payload)"
                @update-comment="payload => $emit('update-comment',payload)"
                @minimize-comment="(payload) => $emit('minimize-comment',payload)"
                @unminimize-comment="(payload) => $emit('unminimize-comment',payload)"
         ></Comment>
        <!-- similar_comment -->
        <!-- <SimilarComments v-else-if="data.event === 'similar_comment'" :data="data"></SimilarComments> -->

        <!-- added_to_project  -->
        <!-- removed_from_project  -->
        <!-- moved_columns_in_project  -->
        <ProjectEvent v-else-if="data.event == 'added_to_project'" :data="data"></ProjectEvent>
        <ProjectEvent v-else-if="data.event == 'removed_from_project'" :data="data"></ProjectEvent>
        <ProjectEvent v-else-if="data.event == 'moved_columns_in_project'" :data="data"></ProjectEvent>

        <!-- user_blocked  -->
        <UserBlockedEvent :data="data" v-else-if="data.event == 'user_blocked'"></UserBlockedEvent>

         <!-- cross-referenced (by issue) -->
        <CrossReferenced :data="data" v-else-if="data.event == 'cross-referenced'"></CrossReferenced>
        <!-- referenced  -->
        <ReferencedEvent :data="data" v-else-if="data.event == 'referenced'"></ReferencedEvent>
        
        <!-- comment_deleted  -->
        <CommentDeletedEvent v-else-if="data.event === 'comment_deleted'" :data="data"></CommentDeletedEvent>

        <!-- labeled  -->
        <Other v-else-if="data.event === 'labeled'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-tag" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 010 2.474l-5.026 5.026a1.75 1.75 0 01-2.474 0l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100 2 1 1 0 000-2z"></path></svg>
            </template>
            <template v-slot:action>
                added the
                <router-link :to="`/${owner}/${repo}/issues?q=repo:${owner}/${repo} is:open label:${data.label.name}`"><Label :name="data.label.name" :color="`#${data.label.color}`"/></router-link>
                label
                <span class="no-wrap">on {{data.created_at | dateFormat('dd zzz yyyy')}}</span>  
            </template>
        </Other>

        <!-- closed -->
        <ClosedEvent v-else-if="data.event == 'closed'" :data="data"></ClosedEvent>

        <!-- unlabeled  -->
        <Other v-else-if="data.event === 'unlabeled'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-tag" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 010 2.474l-5.026 5.026a1.75 1.75 0 01-2.474 0l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100 2 1 1 0 000-2z"></path></svg>
            </template>
            <template v-slot:action>
                removed the
                <router-link :to="`/${owner}/${repo}/issues?q=repo:${owner}/${repo} is:open label:${data.label.name}`"><Label :name="data.label.name" :color="`#${data.label.color}`"/></router-link>
                label
                <span class="no-wrap">on {{data.created_at | dateFormat('dd zzz yyyy')}}</span>  
            </template>
        </Other>

        <!-- pinned  -->
        <Other v-else-if="data.event === 'pinned'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-pin" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 1.2V2l.5 1L6 6H2.2c-.44 0-.67.53-.34.86L5 10l-4 5 5-4 3.14 3.14a.5.5 0 00.86-.34V10l3-4.5 1 .5h.8c.44 0 .67-.53.34-.86L10.86.86a.5.5 0 00-.86.34z"></path></svg>
            </template>
            <template v-slot:action>
                pinned this issue
                <span class="no-wrap">on {{data.created_at | dateFormat('dd zzz yyyy')}}</span>
            </template>
        </Other>
        <!-- unpinned  -->
        <Other v-else-if="data.event === 'unpinned'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-pin" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 1.2V2l.5 1L6 6H2.2c-.44 0-.67.53-.34.86L5 10l-4 5 5-4 3.14 3.14a.5.5 0 00.86-.34V10l3-4.5 1 .5h.8c.44 0 .67-.53.34-.86L10.86.86a.5.5 0 00-.86.34z"></path></svg>
            </template>
            <template v-slot:action>
                unpinned this issue
                <span class="no-wrap">on {{data.created_at | dateFormat('dd zzz yyyy')}}</span>
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
        <!-- reopened  -->
        <Other v-else-if="data.event === 'reopened'" :data="data" :badgeStyle="{color:'#fff',backgroundColor:'#28a745'}">
            <template v-slot:icon :badgeStyle="{color:'#fff',backgroundColor:'#28a745'}">
                <svg class="octicon octicon-primitive-dot" viewBox="0 0 8 16" version="1.1" width="8" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 8c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z"></path></svg>
            </template>
            <template v-slot:action>
                reopened this
                <span class="no-wrap">on {{data.created_at | dateFormat('dd zzz yyyy')}}</span>
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
                <strong v-for="(item,index) in data.milestones" :key="item.title">{{item.title}}{{index < (data.milestones.length - 1) ? ', ' : ''}}</strong>
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
                <svg class="octicon octicon-lock" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 13H3v-1h1v1zm8-6v7c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h1V4c0-2.2 1.8-4 4-4s4 1.8 4 4v2h1c.55 0 1 .45 1 1zM3.8 6h4.41V4c0-1.22-.98-2.2-2.2-2.2-1.22 0-2.2.98-2.2 2.2v2H3.8zM11 7H2v7h9V7zM4 8H3v1h1V8zm0 2H3v1h1v-1z"></path></svg>
            </template>
            <template v-slot:action>
               {{data.actor.login === owner || data.actor.login === 'ghost' ? "Repository owner" : ''}} locked <span v-if="data.lock_reason">as <strong>{{data.lock_reason}}</strong></span> and limited conversation to collaborators
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
        <TransferredEvent v-else-if="data.event == 'transferred'" :data="data"></TransferredEvent>
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
       
        <slot></slot>    
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Comment, Other, CrossReferenced,CommentDeletedEvent,ReferencedEvent,TransferredEvent,UserBlockedEvent,ClosedEvent,ProjectEvent} from './components'
    import {Label} from '@/components'
    export default {
        props: {
            data: {
                type: Object,
                required: true,
            }
        },
        computed: {
            owner() {
                return this.$route.params.owner
            },
            repo() {
                return this.$route.params.repo
            },
        },
        components: {
            Comment,
            Other,
            Label,
            CrossReferenced,
            CommentDeletedEvent,
            ReferencedEvent,
            TransferredEvent,
            UserBlockedEvent,
            ClosedEvent,
            ProjectEvent,
            Container: styled.div``,
        }
    }
</script>

<style scoped lang='scss'>
img{
    border-radius: 2em;
}
</style>