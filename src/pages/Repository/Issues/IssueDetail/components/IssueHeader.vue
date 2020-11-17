<template>
    <Container>
        <HeaderActions v-if="!showTitleEditPane" class="d-flex flex-justify-between flex-items-center mb-3">
            <span>
                <AnimatedWidthWrapper class="v-align-bottom">
                    <button v-if="viewerCanUpdate" @click="triggerShowTitleEditPane" class="btn btn-sm d-inline-block float-none mr-2">
                        Edit
                    </button>
                </AnimatedWidthWrapper>
                <router-link v-if="type == 'issue'" to="/" class="btn btn-primary d-inline-block btn-sm">
                    New issue
                </router-link>
            </span>

            <button class="btn-link" @click="scrollToBottom">Jump to bottom</button>
        </HeaderActions>

        <HeaderTitle v-if="!showTitleEditPane" class="title f1">
            <transition-group name="fade-group">
                <Skeleton key="1" v-if="!data.id">
                    <SkeletonRectangle :height="20" style="width:100%"></SkeletonRectangle>
                    <SkeletonRectangle :height="20" style="width:80%" class="mt-3"></SkeletonRectangle>
                </Skeleton>
                <h1 class="gh-header-title mb-2 lh-condensed f1 mr-0 flex-auto break-word" key="2" v-else> 
                    {{data.title}}
                    <span class="number f1-light text-gray-light">#{{data.number}}</span>
                </h1> 
            </transition-group>
            
        </HeaderTitle>

        <TitleEditPane v-if="showTitleEditPane" class="mb-3">
            <input :disabled="loading" v-model="title" ref="titleEditInput" class="form-control flex-auto input-lg input-contrast mr-0 width-full" autofocus="autofocus" autocomplete="off" type="text">
            <div style="margin-top:12px">
                <button class="btn btn-sm mr-2" :disabled="loading || !title" @click="network_updateIssueTitle">{{loading ? 'Saving' : 'Save'}}</button>
                <button class="btn btn-link" style="background:white" :disabled="loading || !title" @click="() => triggerShowTitleEditPane(false)">Cancel</button>
            </div> 
        </TitleEditPane>

        <HeaderMeta class="d-flex mt-2 mb-3 flex-items-center header-meta">
            <slot>
                <IssueStateBadge class="mr-2" :data="data"></IssueStateBadge>  

                <Skeleton v-if="!data.id" class="flex-grow-1">
                    <SkeletonRectangle :height="16" style="width:100%"></SkeletonRectangle>   
                </Skeleton>   

                <MetaContent v-else class="meta-content">
                        <router-link :to="`/${data.user && data.user.login}`" class="text-bold link-gray">{{data.user && data.user.login}}</router-link>
                        opened this issue
                        <span class="no-wrap">on {{data.created_at | dateFormat('dd zzz yyyy')}}</span>
                        · {{data.comments}} {{data.comments > 1 ? 'comments' : 'comment'}} 
                </MetaContent>
            </slot>   
        </HeaderMeta>
    </Container>
</template>
<script>
import styled from 'vue-styled-components'
import {AnimatedWidthWrapper,
        SkeletonCircle,
        IssueIcon,
        SkeletonRectangle} from '@/components'
import IssueStateBadge from './IssueStateBadge'
export default {
    props: {
        data: {
            type: Object,
            default: () => ({})
        },
        type: {
            type: String,
            default: 'issue'
        },
        viewerCanUpdate: {
            type: Boolean,
            default: false,
        },
        issueUpdateFunc: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            showTitleEditPane: false,
            loading: false,
            title: ''
        }
    },
    methods: {
        async network_updateIssueTitle() {
            try {
                this.loading = true
                await this.issueUpdateFunc({title: this.title})
                this.showTitleEditPane = false
            } catch (e) {
                this.handleError(e)
            }finally{
                this.loading = false
            }
        },
        triggerShowTitleEditPane(flag = true) {
            this.showTitleEditPane = flag
            if(flag) {
                this.title = this.data.title
                this.$nextTick(() => {
                    this.$refs.titleEditInput.focus()
                })
            }
        }
    },
    components: {
            SkeletonCircle,
            SkeletonRectangle,
            IssueIcon,
            AnimatedWidthWrapper,
            IssueStateBadge,
            Container: styled.div``,
            TitleEditPane: styled.div``,
            Header: styled.div``,
            HeaderActions: styled.div``,
            HeaderTitle: styled.h1``,
            HeaderMeta: styled.div``,
            State: styled.div``,
            MetaContent: styled.div``,
            Info: styled.div``,
            Skeleton: styled.div``,
    }
}
</script>
<style scoped lang="scss">
@import 'node_modules/@primer/css/labels/index.scss';
@import 'node_modules/@primer/css/forms/index.scss';
.gh-header-title {
    margin-right: 150px;
    margin-bottom: 0;
    font-weight: 400;
    line-height: 1.125;
    word-wrap: break-word;
}
</style>