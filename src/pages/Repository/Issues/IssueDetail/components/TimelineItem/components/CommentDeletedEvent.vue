<template>
    <Other  :data="data"  
            :showActor="(data.actor.login !== owner && data.actor.login !== 'ghost') || data.actor.type === 'Organization'" >
        <template v-slot:icon>
            <svg class="octicon octicon-x" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg>
        </template>
        <template v-slot:action>
            {{(data.actor.login === owner || data.actor.login === 'ghost') && data.actor.type !== 'Organization'? "Repository owner" : ''}} deleted a comment 
            <span v-if="deletedCommentAuthorLogin">from 
                <router-link :to="`/${deletedCommentAuthorLogin}`" class="link-gray-dark text-bold">{{deletedCommentAuthorLogin}}</router-link>
            </span>
            on {{data.created_at | dateFormat('dd zzz yyyy')}}
        </template>
        </Other>
</template>

<script>
    import styled from 'vue-styled-components'
    import Other from './Other'
    import { authRequiredGitHubGraphqlApiQuery } from '@/network'
    import * as graphql from './graphql.js'
    export default {
        inject: ['timelineExtraDataProvided'],
        props: {
            data: {
                type: Object,
                required: true
            }
        },
        computed: {
            owner() {
                return this.$route.params.owner
            },
            repo() {
                return this.$route.params.repo
            },
            deletedCommentAuthorLogin() {
                let deletedCommentAuthorLoginHolder = this.timelineExtraDataProvided().filter(i => i.id == this.data.node_id)[0]
                if(!deletedCommentAuthorLoginHolder) return
                return deletedCommentAuthorLoginHolder.deletedCommentAuthor.login
            }
        },
        components: {
            Other,
        }
    }
</script>

<style scoped lang='scss'>
@import 'node_modules/@primer/css/labels/index.scss';
img{
    border-radius: 2em;
}
.issue-state{
    text-transform: Capitalize
}
.task-progress{
    color: #586069;
    text-decoration: none;
    vertical-align: top;
    .task-progress-counts{
        display: inline-block;
        margin-right: 6px;
        margin-left: -2px;
        font-size: 12px;
    }
    svg{
        color: #ccc;
        vertical-align: bottom;
        margin-right: 5px;
    }
}

.progress-bar {
    display: inline-block;
    overflow: hidden;
    border-radius: 3px;
    width: 80px;
    height: 5px;
    vertical-align: 2px;
    background-color: #eee;
    .progress {
        display: block;
        height: 100%;
        background-color: #ccc;
    }
}

.loading-animation{
    animation: kf-loading 2s infinite;
}

@keyframes kf-loading {
    0%{
        opacity: 0;
    }
    50%{
        opacity: 1;
    }
    100%{
        opacity: 0;
    }
}

</style>