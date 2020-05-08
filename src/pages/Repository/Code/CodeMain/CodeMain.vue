<template>
    <container class="px-3">
        <AnimatedHeightWrapper :class="{'mt-3' : codeBasicInfo().description && codeBasicInfo().description !== ''}">  
            <Description class="repository-meta mb-0" v-if="codeBasicInfo().description && codeBasicInfo().description !== ''">
                {{codeBasicInfo().description}}
                <span v-if="codeBasicInfo().homepageUrl && codeBasicInfo().homepageUrl.trim() !== ''">-</span>
                <a v-if="codeBasicInfo().homepageUrl && codeBasicInfo().homepageUrl.trim() !== ''" 
                :href="codeBasicInfo().homepageUrl">{{codeBasicInfo().homepageUrl}}</a>   
            </Description>
            <Topics v-if="codeBasicInfo().repositoryTopics && codeBasicInfo().repositoryTopics.nodes && codeBasicInfo().repositoryTopics.nodes.length > 0" 
                    class="repository-meta mt-2 d-inline-flex flex-wrap">
                <router-link 
                            :key="item.topic.name"
                            to="/search"
                            class="topic-item f6"
                            v-for="item in codeBasicInfo().repositoryTopics.nodes">
                            {{item.topic.name}}
                </router-link>
            </Topics>
        </AnimatedHeightWrapper>  

         <transition name="fade" appear>
             <ActionPane v-if="codeBasicInfo().id" class="bubble d-flex mt-3 mb-3 flex-items-stretch">
                <StarItOrNot class="flex-auto text-center">
                    <button class="px-2" @click="test">
                        <svg class="v-align-text-bottom d-inline-block" fill="currentColor" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>
                        {{codeBasicInfo().viewerHasStarred ? "Unstar" : "Star"}}   
                        <AnimatedWidthWrapper class="v-align-bottom">
                            <span class="Counter d-inline-block no-wrap">{{starNumber}}</span>
                        </AnimatedWidthWrapper> 
                    </button>
                </StarItOrNot>
                <WatchItOrNot class="flex-auto text-center" style="border-left: 1px solid #d1d5da;">
                    <button  class="px-2">
                        <svg v-if="codeBasicInfo().viewerSubscription === 'IGNORED'" class="v-align-text-bottom d-inline-block" fill="currentColor" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2.81v10.38c0 .67-.81 1-1.28.53L3 10H1c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h2l3.72-3.72C7.19 1.81 8 2.14 8 2.81zm7.53 3.22l-1.06-1.06-1.97 1.97-1.97-1.97-1.06 1.06L11.44 8 9.47 9.97l1.06 1.06 1.97-1.97 1.97 1.97 1.06-1.06L13.56 8l1.97-1.97z"></path></svg>
                        <svg v-else class="v-align-text-bottom d-inline-block" fill="currentColor" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.06 2C3 2 0 8 0 8s3 6 8.06 6C13 14 16 8 16 8s-3-6-7.94-6zM8 12c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4zm2-4c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"></path></svg>   
                        {{subscriptionActionStr}}
                    </button>
                </WatchItOrNot>
                <Sponsor v-if="codeBasicInfo().fundingLinks && (codeBasicInfo().fundingLinks.length > 0)" class="flex-auto no-wrap text-center" style="border-left: 1px solid #d1d5da;">
                    <button  class="px-2 height-full">
                        <svg class="v-align-text-bottom text-pink d-inline-block" fill="currentColor" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M9 2c-.97 0-1.69.42-2.2 1-.51.58-.78.92-.8 1-.02-.08-.28-.42-.8-1-.52-.58-1.17-1-2.2-1-1.632.086-2.954 1.333-3 3 0 .52.09 1.52.67 2.67C1.25 8.82 3.01 10.61 6 13c2.98-2.39 4.77-4.17 5.34-5.33C11.91 6.51 12 5.5 12 5c-.047-1.69-1.342-2.913-3-3z"></path></svg>
                        Sponsor
                    </button>  
                </Sponsor>
            </ActionPane>
        </transition> 


        <transition name="fade" appear>
             <Branches v-if="codeBasicInfo().id"></Branches>
        </transition>

        <transition name="fade" appear>
             <Readme :readme="partialReadme" v-if="codeBasicInfo().id && !readme.is404" :loading="readme.loading || !codeBasicInfo().id"/>
        </transition>

        <transition name="fade" appear>
            <Releases  v-if="codeBasicInfo().id"/>
        </transition>

        <transition name="fade" appear>
            <Issues  v-if="codeBasicInfo().id"/>     
        </transition>

        <transition name="fade" appear>
            <PullRequests  v-if="codeBasicInfo().id"/>
        </transition>

        <transition name="fade" appear>
            <Notifications  v-if="codeBasicInfo().id"/>
        </transition>
       
        <transition name="fade" appear>
            <CommonLoading v-if="readme.loading || !codeBasicInfo().id"
                            :position="!codeBasicInfo().id ? 'center' : 'corner'"
                            :preventClickEvent="false"/>
        </transition> 

    </container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {
        AnimatedHeightWrapper,
        AnimatedWidthWrapper,
        LoadingAndCatchErrorTemplate,
        CommonLoading,
        ComplexBubble} from '@/components'
    import { util_numberFormat } from '@/util'
    import {Branches,Readme,Releases,Issues,PullRequests,Notifications} from './components'
    import { cancelAndUpdateAxiosCancelTokenSource,authRequiredGet } from '@/network'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import * as api from '@/network/api'
    export default {
        name: 'repository_code_page_main',
        mixins: [RouteUpdateAwareMixin],
        data() {
            return {
                readme:{
                    data: '',
                    response404: false,
                    loading: false
                }
            }
        },
        inject: ['owner','repo','codeBasicInfo'],
        computed: {
            starNumber: function() {
                if(this.codeBasicInfo().stargazers)return util_numberFormat.thousands(this.codeBasicInfo().stargazers.totalCount)
                return ""
            },
            subscriptionActionStr: function() {
                if(this.codeBasicInfo().viewerSubscription === null) return "Unwatch releases"
                if(this.codeBasicInfo().viewerSubscription === "SUBSCRIBED") return "Unwatch"
                if(this.codeBasicInfo().viewerSubscription === "IGNORED") return "Stop ignoring"
                return "Watch"
            },
            partialReadme() {
                let reg4Article = /<\/article>/
                let reg4H = /<h[1|2|3|4][^>]*>.*<\/h[1|2|3|4]>/gi
                let readme = this.readme.data
                if(readme) {
                    let matchArray = readme.match(reg4H)
                    let matchArrayArticle = readme.match(reg4Article)
                    if(matchArray && matchArray.length > 1) {
                        return readme.substring(0, readme.indexOf(matchArray[1])) + readme.substring(readme.indexOf(matchArrayArticle[0]),readme.lenght)
                    }
                }
                return this.readme.data
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            //获取readme数据
            async network_getData() {
                try{
                     this.readme.is404 = false
                    this.readme.loading = true
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.name)
                    this.cancelSources.push(sourceAndCancelToken.source)

                    let url = api.API_README(this.owner(),this.repo())
                    let res = await authRequiredGet(url,{
                        cancelToken: sourceAndCancelToken.cancelToken,
                        headers: {
                            'Accept': "application/vnd.github.VERSION.html"
                        }
                    })
                    this.readme.data = res.data
                } catch (e) {
                    console.log(e)
                    if(e.response && e.response.status === 404) {
                        this.readme.is404 = true
                    }
                }finally{
                    this.readme.loading = false
                }
            },
            test() {
                this.$router.push('/vuejs/vue/pulls')
            }
        },
        components: {
            AnimatedHeightWrapper,
            AnimatedWidthWrapper,
            LoadingAndCatchErrorTemplate,
            ComplexBubble,
            Branches,
            Readme,
            Releases,
            Issues,
            PullRequests,
            Notifications,
            CommonLoading,
            container: styled.div``,
            ReadmeContent: styled.div``,
            Container: styled.div``,
            Description: styled.div``,
            Topics: styled.div``,
            ActionPane: styled.div``,
            StarItOrNot: styled.div``,
            WatchItOrNot: styled.div``,
            Sponsor: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/labels/index.scss';
.repository-meta{
    font-size: 13px;
    color: #586069;
}

.bubble {
  padding: 0;
  overflow: hidden;
  word-break: break-word;
  word-wrap: break-word;
  white-space: normal;
  background: #fff;
  border: 1px solid #d1d5da;
  border-radius: 3px;
}

button{
    padding: 10px 15px;
    font-weight: 500;
    line-height: 1.5;
    color: #0366d6;
}
.topic-item{
    display: inline-block;
    padding: .3em .9em;
    margin: .25em .5em .25em 0;
    background-color: #e7f3ff;
    border-radius: 3px;
}
</style>