<template>
    <router-link :to="`/${owner()}/${repo()}/dir/${branch.name}`" class="Box-row d-flex flex-items-center Details position-relative" style="padding-top:8px;padding-bottom:8px;">
        <Main class="d-flex css-truncate flex-wrap width-full" style="line-height:1.25" :style="magicStyle">
            <span class="branch-name css-truncate-target v-align-baseline width-fit mr-2 ">{{branch.name}}</span>
            <span class="css-truncate-target v-align-baseline text-gray f6 width-fit d-block pr-3">Updated {{formatUpdatedAt}} by {{branch.target && branch.target.history.nodes[0].author.user &&  branch.target.history.nodes[0].author.user.login}}</span>
        </Main>
        <Status class="d-flex flex-items-center">
            <svg v-if="branch.target && branch.target.status && branch.target.status.state == 'SUCCESS'" class="octicon octicon-check text-green" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
            <svg v-if="branch.target && branch.target.status && branch.target.status.state == 'FAILURE'" class="octicon octicon-x text-red" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>
        </Status>
    </router-link>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_dateFormat} from '@/util'
    export default {
        name:'branch_page_list_item',
        inject: ['owner','repo'],
        props: {
            branch: {
                type: Object,
                required: true
            },
            magicStyle: {
                type: Object,
                required: false
            }
        },
        computed: {
            formatUpdatedAt() { 
                return util_dateFormat.getDateDiff(this.branch.target && this.branch.target.history.nodes[0].committedDate)
            }
        },
        components: {
            Container: styled.div``,
            Main: styled.div``,
            Status: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/box/index.scss';
.branch-name{
    padding: 2px 6px;
    font: 12px SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
    background-color: #eaf5ff;
    border-radius: 3px;
}
</style>