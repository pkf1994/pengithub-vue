<template>
    <Container class="flex-column flex-grow-1">
        <CommonLoadingWrapper :loading="loading" class="bg-white flex-justify-between flex-column"
                              :class="{'flex-grow-1' : data && data.length > 0}">
            <transition-group name="slide-up-gentle">
                <IssueListItem :type="type" meta="issue-list-item" v-for="item in data" :key="item.id" :issue="item"/>
            </transition-group>
            <slot></slot>
        </CommonLoadingWrapper>

        <transition name="fade" appear>
            <NoDataMsg class="nodata-msg w-600 flex-row-center" v-show="noDataFlag">
                {{noDataMsg}}
            </NoDataMsg>
        </transition>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoadingWrapper} from '../../../../components'
    import {IssueListItem} from '../components'
    export default {
        props: {
            data: {
                type: Array,
                required: true
            },
            noDataMsg: {
                type: String,
                default: 'No item to show.'
            },
            noDataFlag: {
                type: Boolean,
                required: true
            },
            loading: {
                type: Boolean,
                required: true
            },
            type: {
                type: String,
                required: true
            }
        },
        components: {
            IssueListItem,
            CommonLoadingWrapper,
            Container: styled.div``,
            NoDataMsg: styled.div``
        }
    }
</script>

<style scoped>
    .nodata-msg{
        padding: 45px;
        color: #586069;
    }
    [meta=issue-list-item]:last-child{
        border-bottom:1px solid #eaecef;
    }
</style>