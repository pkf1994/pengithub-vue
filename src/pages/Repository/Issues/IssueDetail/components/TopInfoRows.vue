


<template>
    <div  class="border-bottom border-top pt-3 mt-3" 
            v-if="(data.assignees && data.assignees.length !== 0) || (data.labels && data.labels.length !== 0) || (data.milestone && data.milestone !== null)"
                >
            <!-- assignee -->
                 <div class="d-flex pb-3" v-if="data.assignees && data.assignees.length !== 0">
                    <span class="text-gray text-bold flex-shrink-0 col-3 f6">Assignees</span>    
                    <div class="min-width-0 d-flex flex-wrap mt-n1 flex-wrap">
                        <router-link :to="`/${item.login}`" 
                                    v-for="item in data.assignees" 
                                    :key="item.id" >
                             <ImgWrapper class="avatar avatar-user">
                                <img class="avatar avatar-user mr-1" :src="item.avatar_url" height="20" width="20"> 
                            </ImgWrapper>
                        </router-link>
                    </div>
                </div> 
           
            <!-- label -->
            <AnimatedHeightWrapper>
                <div class="d-flex pb-3" v-if="data.labels && data.labels.length !== 0">
                    <span class="text-gray text-bold flex-shrink-0 col-3 f6">Labels</span>    
                    <div class="min-width-0 d-flex flex-wrap mt-n1">
                        <router-link :to="`/${owner}/${repo}/issues?q=repo:${owner}/${repo} is:open label:${item.name}`" v-for="item in data.labels" :key="item.name">
                            <Label  class="mr-1 mt-1"
                                    :name="item.name"
                                    :color="`#${item.color}`"></Label> 
                        </router-link>
                    </div>
                </div> 
            </AnimatedHeightWrapper>
            <!-- milestone -->
            <AnimatedHeightWrapper>
                <div class="d-flex pb-3" v-if="data.milestone && data.milestone !== null">
                    <span class="text-gray text-bold flex-shrink-0 col-3 f6">Milestone</span>    
                    <div class="min-width-0 d-flex flex-wrap mt-n1 f6">
                        <router-link :to="`/${owner}/${repo}/milestone/${data.milestone.number}`" class="d-inline-block text-bold mr-2 link-gray-dark">
                            <svg class="octicon octicon-milestone text-gray" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2H6V0h2v2zm4 5H2c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h10l2 2-2 2zM8 4H6v2h2V4zM6 16h2V8H6v8z"></path></svg>
                            {{data.milestone.title}}
                        </router-link> 
                    </div>
                </div> 
            </AnimatedHeightWrapper>
        </div>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Label,
            AnimatedHeightWrapper,
            ImgWrapper} from '@/components'
    export default {
        props: {
            data: {
                type: Object,
                required: true
            }
        },
        computed: {
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
        },
        components: {
            Label,
            ImgWrapper,
            AnimatedHeightWrapper,   
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/layout/index.scss';
@import 'node_modules/@primer/css/avatars/index.scss';
/* @import 'node_modules/@primer/css/labels/index.scss';
@import 'node_modules/@primer/css/layout/index.scss';
@import 'node_modules/@primer/css/avatars/index.scss';
@import 'node_modules/@primer/css/box/index.scss';
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/truncate/index.scss'; */
/* .title{
    margin-bottom: 0;
    font-weight: 400;
    line-height: 1.125;
    .number{
        font-weight: 300;
        color: #6a737d;
    }
}

.header-meta{
    font-size: 14px;
    color: #586069;
    .meta-content{
        word-wrap: break-word;
        white-space: normal;
    }
}
.loading-timeline{
    height: 200px;
}

.info-bottom-item:first-child{
    margin-top: 0px;
    border-top: 0px;
}

.info-bottom-item{
    padding-top: 16px;
    font-size: 12px;
    color: #586069;
    margin-top: 16px;
    border-top: 1px solid #e1e4e8;
    .info-bottom-item-title{
        margin-bottom: 8px;
        font-size: 12px;
        color: #586069;
        font-weight: 600!important;
        svg{
            float: right;
            color: #959da5;
            margin-top: 2px;
        }
        
    }

    .assignee-login{
            max-width: 110px;
            display: inline-block;
            vertical-align: top;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-weight: 600;
            color: #24292e;
            font-size: 12px;
        }
    
}

.label-badge{
    display: inline-block;
    width: 1em;
    height: 1em;
    vertical-align: middle;
    border: 1px solid rgba(27,31,35,.15);
    border-radius: 3px;
}

.labels-page-link{
    position:sticky;
    top: 0;
    padding-left: 40px;
}

.milestone-title{
    display: block;
    margin-top: 0;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 600;
}

.milestone-description{
    display: block;
    max-width: 265px;
    font-size: 12px;
    color: #586069;
}

.set-milestone-modal-tabs-btn{
    display: inline-block;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 600;
    color: #6a737d;
    text-decoration: none;
    cursor: pointer;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 3px 3px 0 0;
}

.tab-active{
        color: #24292e;
    background-color: #fff;
    border-color: #dfe2e5 #dfe2e5 #fff;
}

.modal-footer {
    position: sticky;
    top: 100%;
} */

</style>