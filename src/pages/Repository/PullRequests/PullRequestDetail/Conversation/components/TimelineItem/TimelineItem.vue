<template>
    <TimelineItem :data="data">
         <!-- review -->
        <Review v-if="data.event === 'reviewed'" :reviewTimeline="data"></Review>

        <!-- committed-group  -->
        <CommittedGroup v-else-if="data.event == 'committed-group'" :data="data"></CommittedGroup>
        
        <!-- committed -->
        <Committed v-else-if="data.event == 'committed'" :data="data"></Committed>  
        
        <!-- review_requested -->
        <Other v-else-if="data.event == 'review_requested'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-eye" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.679 7.932c.412-.621 1.242-1.75 2.366-2.717C5.175 4.242 6.527 3.5 8 3.5c1.473 0 2.824.742 3.955 1.715 1.124.967 1.954 2.096 2.366 2.717a.119.119 0 010 .136c-.412.621-1.242 1.75-2.366 2.717C10.825 11.758 9.473 12.5 8 12.5c-1.473 0-2.824-.742-3.955-1.715C2.92 9.818 2.09 8.69 1.679 8.068a.119.119 0 010-.136zM8 2c-1.981 0-3.67.992-4.933 2.078C1.797 5.169.88 6.423.43 7.1a1.619 1.619 0 000 1.798c.45.678 1.367 1.932 2.637 3.024C4.329 13.008 6.019 14 8 14c1.981 0 3.67-.992 4.933-2.078 1.27-1.091 2.187-2.345 2.637-3.023a1.619 1.619 0 000-1.798c-.45-.678-1.367-1.932-2.637-3.023C11.671 2.992 9.981 2 8 2zm0 8a2 2 0 100-4 2 2 0 000 4z"></path></svg>
            </template>
            <template v-slot:action>
                requested review from 
                <strong>{{(data.requested_reviewer && data.requested_reviewer.login) || (data.requested_team && data.requested_team.login)}}</strong>
                <span class="no-wrap">on {{data.created_at | dateFormat('dd zzz yyyy')}}</span>    
            </template>
        </Other>

        <!-- review_requested_group -->
        <Other v-else-if="data.event == 'review_requested_group'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-eye" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.679 7.932c.412-.621 1.242-1.75 2.366-2.717C5.175 4.242 6.527 3.5 8 3.5c1.473 0 2.824.742 3.955 1.715 1.124.967 1.954 2.096 2.366 2.717a.119.119 0 010 .136c-.412.621-1.242 1.75-2.366 2.717C10.825 11.758 9.473 12.5 8 12.5c-1.473 0-2.824-.742-3.955-1.715C2.92 9.818 2.09 8.69 1.679 8.068a.119.119 0 010-.136zM8 2c-1.981 0-3.67.992-4.933 2.078C1.797 5.169.88 6.423.43 7.1a1.619 1.619 0 000 1.798c.45.678 1.367 1.932 2.637 3.024C4.329 13.008 6.019 14 8 14c1.981 0 3.67-.992 4.933-2.078 1.27-1.091 2.187-2.345 2.637-3.023a1.619 1.619 0 000-1.798c-.45-.678-1.367-1.932-2.637-3.023C11.671 2.992 9.981 2 8 2zm0 8a2 2 0 100-4 2 2 0 000 4z"></path></svg>
            </template>
            <template v-slot:action>
                requested review from 
                <span v-for="(item,index) in data.requested_reviewers" :key="item.login || item.id || item.login">
                    <strong>{{item.login || item.name}}</strong><span v-if="index < data.requested_reviewers.length - 2">,&nbsp;</span><span v-if="index == data.requested_reviewers.length - 2">&nbsp;and&nbsp;</span> 
                </span>   
                <span class="no-wrap">on {{data.created_at | dateFormat('dd zzz yyyy')}}</span>  
            </template>
        </Other>
        
        <!-- head_ref_force_pushed -->
        <HeadRefForcePushed v-else-if="data.event === 'head_ref_force_pushed'" :data="data"></HeadRefForcePushed>

        <!-- head_ref_deleted -->
        <HeadRefDeletedEvent v-else-if="data.event === 'head_ref_deleted'" :data="data"></HeadRefDeletedEvent>        

        <!-- commit-commented -->
        <div v-else-if="data.event === 'commit-commented'">
            <Comment v-for="item in data.comments" :key="item.id" :data="item" commentType="commitComment"></Comment>
        </div> 

        <!-- base_ref_force_pushed  -->
        <Other v-else-if="data.event === 'base_ref_force_pushed'" :data="data">
            <template v-slot:icon>
                <svg class="octicon octicon-repo-push issue-event-icon" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1 2.5A2.5 2.5 0 013.5 0h8.75a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V1.5h-8a1 1 0 00-1 1v6.708A2.492 2.492 0 013.5 9h3.25a.75.75 0 010 1.5H3.5a1 1 0 100 2h5.75a.75.75 0 010 1.5H3.5A2.5 2.5 0 011 11.5v-9zm13.23 7.79a.75.75 0 001.06-1.06l-2.505-2.505a.75.75 0 00-1.06 0L9.22 9.229a.75.75 0 001.06 1.061l1.225-1.224v6.184a.75.75 0 001.5 0V9.066l1.224 1.224z"></path></svg>
            </template>
            <template v-slot:action>
                force pushed changes to the base branch 
            </template>
        </Other>
    </TimelineItem>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Comment,Other} from '../../../../../Issues/IssueDetail/components/TimelineItem/components'
    import TimelineItem from '../../../../../Issues/IssueDetail/components/TimelineItem/TimelineItem.vue'
    import {HeadRefForcePushed,Committed,CommittedGroup,Review,HeadRefDeletedEvent} from './components'
    import {authRequiredGet,authRequiredGitHubGraphqlApiQuery} from '@/network'
    export default {
        props: { 
            data: {
                type: Object,
                required: true,
            }
        },
        components: {
            Comment,
            Other,
            Review,
            HeadRefDeletedEvent,
            HeadRefForcePushed,
            Committed,
            CommittedGroup,
            TimelineItem
        }
    }
</script>

<style scoped lang='scss'>

</style>