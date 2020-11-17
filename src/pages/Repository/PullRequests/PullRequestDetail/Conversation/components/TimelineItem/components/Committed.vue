<template>
    <Other :key="data.id" :data="data" :showActor="false" :badgeStyle="{backgroundColor:'transparent',border:'none'}" style="padding-top:4px!important;padding-bottom:0!important;">
        <template v-slot:icon>
            <svg class="octicon octicon-git-commit bg-white" style="color: #959da5;margin-left: 2px" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10.5 7.75a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm1.43.75a4.002 4.002 0 01-7.86 0H.75a.75.75 0 110-1.5h3.32a4.001 4.001 0 017.86 0h3.32a.75.75 0 110 1.5h-3.32z"></path></svg>
        </template>
        <template v-slot:action>
            <div class="d-flex flex-auto">
                <!-- commit user avatars -->
                <CommitAuthorAvatar :url="data.url.replace('/git','')"></CommitAuthorAvatar>

                <!-- commit message -->
                <div class="pr-1 flex-auto min-width-0">
                    <code>
                        <router-link :to="`/${owner}/${repo}/${data.sha}`" class="link-gray">{{data.message.split('\n\n')[0]}}</router-link>
                    </code>
                    <details v-if="data.message.split('\n\n')[1]">
                        <summary class="ellipsis-expander ml-1">
                            ...
                        </summary>
                        <div>
                            <code>
                                {{data.message.split('\n\n')[1]}}
                            </code> 
                        </div> 
                    </details> 
                </div> 

                <!-- commit status -->
                <CommitStatusIcon class="flex-shrink-0 mt-1" :sha="data.sha"></CommitStatusIcon>

                <!-- commit sha -->

                <div class="text-right no-wrap">
                    <code>
                        <router-link class="link-gray" :to="`/${owner}/${repo}/${data.sha}`">{{data.sha.substring(0,7)}}</router-link>
                    </code>    

                </div> 
            </div> 
        </template>
    </Other>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Other} from '../../../../../../Issues/IssueDetail/components/TimelineItem/components'
    import {CommitStatusIcon,CommitAuthorAvatar} from '../../../../../../components'
    export default {
        props: { 
            data: {
                type: Object,
                required: true,
            }
        },
        computed: {
            owner() {
                return this.$route.params.owner
            },
            repo() {
                return this.$route.params.repo
            }
        },
        components: {
            Other,
            CommitAuthorAvatar,
            CommitStatusIcon,
        }
    }
</script>

<style scoped lang='scss'>
summary::-webkit-details-marker {
    display: none;
}
</style>