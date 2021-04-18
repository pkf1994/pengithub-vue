<template>
    <Container class="border rounded box-shadow bg-gray-light my-4">
        <router-link v-if="graphqlData.openGraphImageUrl && (graphqlData.openGraphImageUrl.indexOf('https://repository-images.githubusercontent.com/') != -1)" :to="`/${repository.owner.login}/${repository.name}`">
            <img :src="graphqlData.openGraphImageUrl" :alt="repository.name" class="d-block width-full rounded-top"> 
        </router-link>
        
        <TheMeta class="p-3 border-top">
            <StarBtn class="float-right" :ownerProp="repository.owner.login" :repoProp="repository.name"></StarBtn>
            <span>
                <!-- <span style="margin-top:2px">
                    <svg height="16" class="octicon octicon-repo text-gray mr-2" color="gray" mr="2" viewBox="0 0 12 16" version="1.1" width="12" aria-hidden="true"><path fill-rule="evenodd" d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"></path></svg>
                </span> -->
                <h1 class="f3 text-gray text-normal lh-condensed">
                    <router-link :to="`/${repository.owner.login}`">
                        {{repository.owner.login}}
                    </router-link>
                    /
                    <router-link :to="`/${repository.name}`" class="text-bold">
                        {{repository.name}}
                    </router-link>
                </h1>
            </span>
        </TheMeta>

        <MultiInfo class="rounded-bottom border-bottom border-top bg-white">
            <Description class="px-3 pt-3">
                {{repository.description}}
            </Description>

            <Topics class="d-flex flex-wrap border-bottom border-gray-light px-3 pt-2 pb-2">
                <router-link    class="topic-tag topic-tag-link f6 mb-2" 
                                v-for="item in repository.topics" 
                                :key="item" 
                                :to="`/explore/topics/${item}`">
                                {{item}}
                </router-link>
            </Topics>

            <UpdateAtAndLanguage class="p-3 rounded-bottom">
                <span class="mr-4">Updated {{formatUpdatedAt}}</span>   

                <span class="f6 my-1 ml-0 d-inline-block" v-if="graphqlData.primaryLanguage">
                    <span class="repo-language-color" v-if="graphqlData.primaryLanguage.color" :style="{backgroundColor: graphqlData.primaryLanguage.color}"></span>
                    {{graphqlData.primaryLanguage.name}}
                </span>    
            </UpdateAtAndLanguage>
        </MultiInfo>

    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {AnimatedHeightWrapper,ImgWrapper,StarBtn} from '@/components'
    import {util_numberFormat,util_dateFormat} from '@/util'
    import * as graphql from './graphql'
    export default {
        props: {
            repository: {
                type: Object,
                required: true
            }
        },
        computed: {
            nodeId() {
                return this.repository.node_id
            },
            formatStarNumber() {
                return util_numberFormat.thousands2K2M(this.repository.stargazers_count,1)
            },
            formatUpdatedAt() {
                return util_dateFormat.getDateDiff(this.repository.updated_at)
            },
        },
        created() {
            this.action_getGraphqlData({
                graphql: graphql.GRAPHQL_TOPIC_REPOS,
                id: this.nodeId
            })           
        },
        components: {
            AnimatedHeightWrapper,
            ImgWrapper,
            StarBtn,
            Container: styled.div``,
            TheMeta: styled.div``,
            FullName: styled.div``,
            Star: styled.div``,
            MultiInfo: styled.div``,
            Description: styled.div``,
            Topics: styled.div``,
            UpdateAtAndLanguage: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/box/index.scss';
.topic-tag{
    display: inline-block;
    padding: .3em .9em;
    margin: 0 .5em .5em 0;
    white-space: nowrap;
    background-color: #f1f8ff;
    border-radius: 3px;
}
.repo-language-color {
    position: relative;
    top: 1px;
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
}
.rounded{
    border-radius: 6px;
}
.rounded-top{
    border-top-right-radius: 6px!important;
    border-top-left-radius: 6px!important;

}
.rounded-bottom{
    border-bottom-right-radius: 6px!important;
    border-bottom-left-radius: 6px!important;
}
</style>