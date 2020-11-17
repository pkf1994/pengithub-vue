<template>
    <div class="State State--green d-flex flex-items-center"
        :class="{'State--green':data.state == 'open' && !data.draft || !data.id,'State--red':data.state == 'closed' && !data.merged,'State--purple':data.merged}"
        style="text-transform:capitalize;border-radius: 2em">
        <IssueIcon class="flex-shrink-0 mr-1 v-align-middle" :class="{'State--green':data.state == 'open' && !data.draft || !data.id,'State--red':data.state == 'closed' && !data.merged,'State--purple':data.merged}" color="#fff" :issue="data"></IssueIcon>
        <span class="v-align-text-top" style="margin-bottom:1px;min-width:20px">{{(data.merged && 'merged') || (data.draft && 'draft') || data.state || '     '}}</span>    
    </div>
</template>
<script>
import styled from 'vue-styled-components'
import {IssueIcon} from '@/components'
export default {
    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },
    components: {
        IssueIcon
    }
}
</script>
<style scoped lang="scss">
@import 'node_modules/@primer/css/labels/index.scss';
</style>