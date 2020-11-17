<template>
    <div>
        <Other :data="data" style="padding-bottom: 0!important;">
            <template v-slot:icon>
                <svg class="octicon octicon-repo-push" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1 2.5A2.5 2.5 0 013.5 0h8.75a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V1.5h-8a1 1 0 00-1 1v6.708A2.492 2.492 0 013.5 9h3.25a.75.75 0 010 1.5H3.5a1 1 0 100 2h5.75a.75.75 0 010 1.5H3.5A2.5 2.5 0 011 11.5v-9zm13.23 7.79a.75.75 0 001.06-1.06l-2.505-2.505a.75.75 0 00-1.06 0L9.22 9.229a.75.75 0 001.06 1.061l1.225-1.224v6.184a.75.75 0 001.5 0V9.066l1.224 1.224z"></path></svg>
            </template>
            <template v-slot:action>
                <span>
                    <span v-if="data.moreThanOneAuthor">and others&nbsp;</span>    
                    added sevaral commits
                    <span class="no-wrap">on {{data.author.date | dateFormat('d zzz yyyy')}}</span> 
                </span>    
            </template>
        </Other>
        <Committed v-for="item in data.commits" :key="item.id" :data="item"></Committed>
    </div>

</template>

<script>
    import styled from 'vue-styled-components'
    import {Other} from '../../../../../../Issues/IssueDetail/components/TimelineItem/components'
    import Committed from './Committed'
    export default {
        inject: ['owner','repo','pullRequestProvided'],
        props: { 
            data: {
                type: Object,
                required: true,
            }
        },
        components: {
            Other,
            Committed
        }
    }
</script>

<style scoped lang='scss'>

</style>