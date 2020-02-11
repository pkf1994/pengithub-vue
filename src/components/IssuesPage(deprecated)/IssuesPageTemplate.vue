<template>
    <Container class="flex-column flex-grow-1">
        <CommonLoadingWrapper   :loading="loading || loadingAdditionalData" 
                                class="bg-white flex-column flex-justify-between"
                                :position="loading ? 'center' : 'corner'"
                                :class="{'flex-grow-1' : data && data.length > 0}">
            <div>
                <IssueListItem :showRepoFullName="showRepoFullName" 
                            :type="type" 
                            meta="issue-list-item" 
                            v-for="item in filterEmptyData" 
                            :key="item.id + item.title" 
                            :issue="item"/>
            </div>
            
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
    import {CommonLoadingWrapper} from '../Loading'
    import IssueListItem from './IssueItem'
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
            loadingAdditionalData: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                required: true
            },
            showRepoFullName: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            filterEmptyData() {
                let data = []
                this.data.forEach(item => {
                    if(item.id) data.push(item)
                })
                return data
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