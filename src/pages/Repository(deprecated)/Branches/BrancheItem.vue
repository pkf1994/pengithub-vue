<template>
    <router-link :to="`/${owner()}/${repo()}/tree/${branch.name}`" class="Box-row d-flex flex-items-center Details position-relative" style="padding-top:8px;padding-bottom:8px;">
        <Main class="d-flex css-truncate flex-wrap width-full" style="line-height:1.25" :style="magicStyle">
            <span class="branch-name css-truncate-target v-align-baseline width-fit mr-2 no-wrap">{{branch.name}}</span>
            <span class="css-truncate-target v-align-baseline text-gray f6 width-fit d-block pr-3">
                Updated 
                {{branch.updatedAt | getDateDiff}} 
                by 
                <router-link v-if="branch.updatedByIsUser" class="muted-link" :to="`/${branch.updatedBy}`">{{branch.updatedBy}}</router-link>
                <span v-else>{{branch.updatedBy}}</span>
            </span>
        </Main>
        <Status v-if="branch.stateSvg" class="d-flex flex-items-center" v-html="branch.stateSvg">
        </Status>
    </router-link>
</template>

<script>
    import styled from 'vue-styled-components'
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
        components: {
            Container: styled.div``,
            Main: styled.div``,
            Status: styled.div``,
        }
    }
</script>

<style lang="scss">

</style>

<style scoped lang="scss">
@import 'node_modules/@primer/css/box/index.scss';
@import 'node_modules/@primer/css/truncate/index.scss';
.branch-name{
    padding: 2px 6px;
    font: 12px SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
    background-color: #eaf5ff;
    border-radius: 3px;
}
</style>