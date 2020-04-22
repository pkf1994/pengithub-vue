<template>
    <Container class="border rounded-1 box-shadow bg-gray-light my-4">
        <AnimatedHeightWrapper>
            <router-link v-if="extraData.openGraphImageUrl && (extraData.openGraphImageUrl.indexOf('https://repository-images.githubusercontent.com/') != -1)" :to="`/${repository.owner.login}/${repository.name}`">
                <ImgWrapper>
                    <img :src="extraData.openGraphImageUrl" :alt="repository.name" class="d-block width-full"> 
                </ImgWrapper>
            </router-link>
        </AnimatedHeightWrapper>
        
        <TheMeta class="p-3 d-flex flex-justify-between border-top">
            <FullName class="d-flex flex-auto">
                <span style="margin-top:2px">
                    <svg height="16" class="octicon octicon-repo text-gray mr-2" color="gray" mr="2" viewBox="0 0 12 16" version="1.1" width="12" aria-hidden="true"><path fill-rule="evenodd" d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"></path></svg>
                </span>
                <h1 class="f3 text-gray text-normal lh-condensed">
                    <router-link :to="`/${repository.owner.login}`">
                        {{repository.owner.login}}
                    </router-link>
                    /
                    <router-link :to="`/${repository.name}`" class="text-bold">
                        {{repository.name}}
                    </router-link>
                </h1>
            </FullName>

            <Star class="d-flex flex-items-start ml-3 flex-shrink-0">
                <button class="btn btn-sm btn-with-count bg-white" :disabled="extraData.viewerHasStarred === undefined">
                    <svg height="16" class="octicon octicon-star mr-1" mr="1" viewBox="0 0 14 16" version="1.1" width="14" aria-hidden="true"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>
                    {{extraData.viewerHasStarred ? 'Unstar' : 'Star'}}
                </button>
                <span class="social-count float-none">
                    {{formatStarNumber}}
                </span>    
            </Star>
        </TheMeta>

        <MultiInfo class="border-bottom border-top bg-white">
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

            <UpdateAtAndLanguage class="p-3">
                <span class="mr-4">Updated {{formatUpdatedAt}}</span>   

                <span class="f6 my-1 ml-0 d-inline-block" v-if="extraData.primaryLanguage">
                    <span class="repo-language-color" v-if="extraData.primaryLanguage.color" :style="{backgroundColor: extraData.primaryLanguage.color}"></span>
                    {{extraData.primaryLanguage.name}}
                </span>    
            </UpdateAtAndLanguage>
        </MultiInfo>

    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {AnimatedHeightWrapper,ImgWrapper} from '@/components'
    import {util_numberFormat,util_dateFormat} from '@/util'
    export default {
        inject: ['repositoriesExtraDataProvided'],
        props: {
            repository: {
                type: Object,
                required: true
            }
        },
        computed: {
            formatStarNumber() {
                return util_numberFormat.thousands2K2M(this.repository.stargazers_count,1)
            },
            formatUpdatedAt() {
                return util_dateFormat.getDateDiff(this.repository.updated_at)
            },
            extraData() {
                return this.repositoriesExtraDataProvided().filter(i => i.id == this.repository.node_id)[0] || {}
            },
        },
        components: {
            AnimatedHeightWrapper,
            ImgWrapper,
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
</style>