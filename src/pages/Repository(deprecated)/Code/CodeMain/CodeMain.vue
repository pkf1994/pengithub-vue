<template>
    <CommonLoadingWrapper class="px-3 container" 
                            :loading="readme.loading || !repoBasicInfo().node_id || pinnedIssues.loading || pinnedPullRequests.loading || subscription.loading"
                            :position="!repoBasicInfo().node_id  ? 'center' : 'corner'">
        <AnimatedHeightWrapper :class="{'mt-3' : repoBasicInfo().description && repoBasicInfo().description !== ''}">  
            <Description class="repository-meta mb-0" v-if="repoBasicInfo().description && repoBasicInfo().description !== ''">
                {{repoBasicInfo().description}}
                <span v-if="repoBasicInfo().homepage && repoBasicInfo().homepage.trim() !== ''">-</span>
                <a v-if="repoBasicInfo().homepage && repoBasicInfo().homepage.trim() !== ''" 
                :href="repoBasicInfo().homepage">{{repoBasicInfo().homepage}}</a>   
            </Description>
            <Topics v-if="repoBasicInfo().topics && repoBasicInfo().topics.length > 0" 
                    class="repository-meta mt-2 d-inline-flex flex-wrap">
                <router-link 
                            :key="item"
                            to="/search"
                            class="topic-item f6"
                            v-for="item in repoBasicInfo().topics">
                            {{item}}
                </router-link>
            </Topics>
        </AnimatedHeightWrapper>  

         <transition name="fade" appear>
             <ActionPane v-if="repoBasicInfo().node_id" class="bubble d-flex mt-3 mb-3 flex-items-stretch">
                <StarItOrNot class="flex-auto text-center">
                    <button class="px-2 action-btn" @click="test">
                        <svg v-if="codeBasicInfo().viewerHasStarred" class="v-align-text-bottom d-inline-block" fill="currentColor" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>
                        <svg v-else class="octicon octicon-star" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.00001 0.25C8.14003 0.24991 8.27727 0.289014 8.39621 0.362887C8.51515 0.43676 8.61103 0.542452 8.67301 0.668L10.555 4.483L14.765 5.095C14.9035 5.11511 15.0336 5.17355 15.1405 5.26372C15.2475 5.35388 15.3272 5.47218 15.3704 5.60523C15.4137 5.73829 15.4189 5.8808 15.3854 6.01665C15.352 6.1525 15.2812 6.27628 15.181 6.374L12.135 9.344L12.854 13.536C12.8777 13.6739 12.8624 13.8157 12.8097 13.9454C12.757 14.0751 12.6691 14.1874 12.5559 14.2697C12.4427 14.352 12.3087 14.401 12.1691 14.4111C12.0295 14.4212 11.8899 14.3921 11.766 14.327L8.00001 12.347L4.23401 14.327C4.1102 14.392 3.97068 14.4211 3.8312 14.411C3.69173 14.4009 3.55785 14.352 3.44469 14.2699C3.33154 14.1877 3.2436 14.0755 3.19083 13.946C3.13805 13.8165 3.12252 13.6749 3.14601 13.537L3.86601 9.343L0.818012 6.374C0.717578 6.27632 0.646511 6.15247 0.612864 6.01647C0.579216 5.88047 0.584334 5.73777 0.627636 5.60453C0.670939 5.47129 0.750695 5.35284 0.857868 5.26261C0.96504 5.17238 1.09534 5.11397 1.23401 5.094L5.44401 4.483L7.32701 0.668C7.38899 0.542452 7.48488 0.43676 7.60382 0.362887C7.72276 0.289014 7.86 0.24991 8.00001 0.25ZM8.00001 2.695L6.61501 5.5C6.56123 5.6089 6.4818 5.70311 6.38356 5.77453C6.28531 5.84595 6.17119 5.89244 6.05101 5.91L2.95401 6.36L5.19401 8.544C5.28116 8.62886 5.34637 8.73365 5.384 8.84933C5.42163 8.96501 5.43056 9.0881 5.41001 9.208L4.88201 12.292L7.65101 10.836C7.75864 10.7794 7.87842 10.7499 8.00001 10.7499C8.12161 10.7499 8.24138 10.7794 8.34901 10.836L11.119 12.292L10.589 9.208C10.5685 9.0881 10.5774 8.96501 10.615 8.84933C10.6527 8.73365 10.7179 8.62886 10.805 8.544L13.045 6.361L9.94901 5.911C9.82883 5.89344 9.71471 5.84695 9.61647 5.77553C9.51822 5.70411 9.4388 5.6099 9.38501 5.501L8.00001 2.694V2.695Z"></path></svg>
                        {{codeBasicInfo().viewerHasStarred ? "Unstar" : "Star"}}   
                        <AnimatedWidthWrapper class="v-align-bottom">
                            <span class="Counter d-inline-block no-wrap">{{repoBasicInfo().stargazers_count | thousands}}</span>
                        </AnimatedWidthWrapper> 
                    </button>
                </StarItOrNot>
                <WatchItOrNot class="flex-auto text-center" style="border-left: 1px solid #d1d5da;">
                    <button  class="px-2">
                        <svg v-if="!codeBasicInfo().viewerSubscription || codeBasicInfo().viewerSubscription === 'SUBSCRIPTION'" class="octicon octicon-eye" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.67884 7.93165C2.09143 7.31094 2.9206 6.18152 4.0447 5.21477C5.17567 4.2421 6.52738 3.5 8.00001 3.5C9.47264 3.5 10.8244 4.2421 11.9553 5.21477C13.0794 6.18152 13.9086 7.31094 14.3212 7.93165C14.35 7.975 14.35 8.025 14.3212 8.06835C13.9086 8.68906 13.0794 9.81848 11.9553 10.7852C10.8244 11.7579 9.47264 12.5 8.00001 12.5C6.52738 12.5 5.17567 11.7579 4.0447 10.7852C2.9206 9.81848 2.09143 8.68906 1.67884 8.06835C1.65002 8.025 1.65002 7.975 1.67884 7.93165ZM8.00001 2C6.01865 2 4.32919 2.99167 3.06662 4.07751C1.79718 5.16926 0.880454 6.42307 0.429635 7.10129C0.0664231 7.64771 0.0664245 8.35229 0.429635 8.89871C0.880455 9.57693 1.79718 10.8307 3.06662 11.9225C4.32919 13.0083 6.01865 14 8.00001 14C9.98137 14 11.6708 13.0083 12.9334 11.9225C14.2028 10.8307 15.1196 9.57693 15.5704 8.89871C15.9336 8.35229 15.9336 7.64771 15.5704 7.10129C15.1196 6.42307 14.2028 5.16926 12.9334 4.07751C11.6708 2.99167 9.98137 2 8.00001 2ZM8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"></path></svg>
                        <svg v-else-if="codeBasicInfo().viewerSubscription === 'IGNORED'" class="octicon octicon-bell-slash" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.00005 1.5C7.00314 1.5 6.1046 1.91582 5.4662 2.58554C5.1804 2.88536 4.70566 2.89673 4.40584 2.61093C4.10602 2.32513 4.09465 1.85039 4.38045 1.55057C5.29016 0.596222 6.5761 0 8.00005 0C10.7615 0 13.0001 2.23858 13.0001 5V7.37362C13.0001 7.78783 12.6643 8.12362 12.2501 8.12362C11.8358 8.12362 11.5001 7.78783 11.5001 7.37362V5C11.5001 3.067 9.93305 1.5 8.00005 1.5ZM4.1824 4.3095L1.18994 2.14254C0.854447 1.8996 0.385538 1.97462 0.142598 2.31011C-0.100343 2.6456 -0.0253172 3.11451 0.310172 3.35745L3.00005 5.30529V7.94722C3.00005 7.99658 2.98544 8.04483 2.95807 8.0859L1.25493 10.6406C1.08874 10.8899 1.00005 11.1828 1.00005 11.4824C1.00005 12.3206 1.6795 13 2.51765 13H13.6261L14.8102 13.8574C15.1457 14.1004 15.6146 14.0254 15.8575 13.6899C16.1005 13.3544 16.0254 12.8855 15.6899 12.6425L14.3154 11.6472C14.3108 11.6438 14.3062 11.6405 14.3016 11.6372L4.19778 4.32063C4.1927 4.31686 4.18758 4.31314 4.1824 4.3095ZM11.5546 11.5L4.50005 6.3915V7.94722C4.50005 8.29272 4.39779 8.63048 4.20614 8.91795L2.50301 11.4726C2.50108 11.4755 2.50005 11.4789 2.50005 11.4824C2.50005 11.4862 2.50068 11.488 2.50113 11.489C2.50179 11.4906 2.50307 11.4927 2.50521 11.4948C2.50734 11.497 2.50947 11.4983 2.51103 11.4989C2.51209 11.4994 2.51383 11.5 2.51765 11.5H11.5546ZM8.00005 16C9.02013 16 9.86184 15.2363 9.98464 14.2495C10.0017 14.1125 9.88812 14 9.75005 14H6.25005C6.11198 14 5.99841 14.1125 6.01546 14.2495C6.13827 15.2363 6.97998 16 8.00005 16Z"></path></svg>
                        <svg v-else class="v-align-text-bottom d-inline-block" fill="currentColor" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.06 2C3 2 0 8 0 8s3 6 8.06 6C13 14 16 8 16 8s-3-6-7.94-6zM8 12c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4zm2-4c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"></path></svg>   
                        {{subscriptionActionStr}}
                    </button>
                </WatchItOrNot>
                <!-- <Sponsor v-if="codeBasicInfo().fundingLinks && (codeBasicInfo().fundingLinks.length > 0)" class="flex-auto no-wrap text-center" style="border-left: 1px solid #d1d5da;">
                    <button  class="px-2 height-full">
                        <svg class="v-align-text-bottom text-pink d-inline-block" fill="currentColor" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M9 2c-.97 0-1.69.42-2.2 1-.51.58-.78.92-.8 1-.02-.08-.28-.42-.8-1-.52-.58-1.17-1-2.2-1-1.632.086-2.954 1.333-3 3 0 .52.09 1.52.67 2.67C1.25 8.82 3.01 10.61 6 13c2.98-2.39 4.77-4.17 5.34-5.33C11.91 6.51 12 5.5 12 5c-.047-1.69-1.342-2.913-3-3z"></path></svg>
                        Sponsor
                    </button>  
                </Sponsor> -->
            </ActionPane>
        </transition> 


        <transition name="fade" appear>
             <Branches></Branches>
        </transition>

        <transition name="fade" appear>
             <Readme :readme="partialReadme" v-if="repoBasicInfo().node_id && partialReadme && !readme.is404" :loading="readme.loading"/>
        </transition>

        <transition name="fade" appear>
            <Releases/>
        </transition>

        <transition name="fade" appear>
            <Issues v-if="pinnedIssues.data.length > 0" :issues="pinnedIssues.data"/>     
        </transition>

        <transition name="fade" appear>
            <PullRequests v-if="pinnedPullRequests.data.length > 0" :pullRequests="pinnedPullRequests.data"/>
        </transition>

        <transition name="fade" appear>
            <Notifications  v-if="repoBasicInfo().node_id && subscription.loaded" :subscription="subscription"/>
        </transition>
       
    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {
        AnimatedHeightWrapper,
        AnimatedWidthWrapper,
        LoadingAndCatchErrorTemplate,
        CommonLoading,
        CommonLoadingWrapper,
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
                },
                pinnedIssues: {
                    data: [],
                    loading: false
                },
                pinnedPullRequests: {
                    data: [],
                    loading: false
                },
                subscription: {
                    data: {},
                    loading: false,
                    loaded: false
                },
                viewerHasStarred: {
                    data: false,
                    loading: false
                }
            }
        },
        inject: ['owner','repo','codeBasicInfo','repoBasicInfo'],
        computed: {
            subscriptionActionStr: function() {
                if(this.codeBasicInfo().viewerSubscription === null) return "Unwatch releases"
                if(this.codeBasicInfo().viewerSubscription === "SUBSCRIBED") return "Unwatch"
                if(this.codeBasicInfo().viewerSubscription === "IGNORED") return "Stop ignoring"
                return "Watch"
            },
            partialReadme() {
                if(!this.readme.data || this.readme.data.trim() == '')return 
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
            network_getData(){
                this.network_getReadme()
                this.network_getPinnedIssues()
                this.network_getPinnedPullRequests()
                this.network_getSubscription()
            },
        
            //获取readme数据
            async network_getReadme() {
                try{
                    this.readme.is404 = false
                    this.readme.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.name)
                    let url = api.API_README(this.owner(),this.repo())
                    let res = await authRequiredGet(url,{
                        cancelToken,
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

             async network_getPinnedIssues() {
                try{
                    this.pinnedIssues.loading = false
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_pinned_issues')
                    let url = api.API_SEARCH(
                        {
                            type: 'issues',
                            params: {
                                q:`repo:${this.owner()}/${this.repo()} is:issue state:open is:public`,
                                sort: 'updated',
                                per_page: 5
                            }
                        })
                    let res = await authRequiredGet(url,{cancelToken})
                    this.pinnedIssues.data = res.data.items
                }catch(e) {
                    console.log(e)
                }finally{
                    this.pinnedIssues.loading = false
                }
            },

             async network_getPinnedPullRequests() {
                try{
                    this.pinnedPullRequests.loading = false
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_pinned_pull')
                    let url = api.API_SEARCH(
                        {
                            type: 'issues',
                            params: {
                                q:`repo:${this.owner()}/${this.repo()} is:pr state:open is:public`,
                                sort: 'updated',
                                per_page: 5
                            }
                        })
                    let res = await authRequiredGet(url,{cancelToken})
                    this.pinnedPullRequests.data = res.data.items
                }catch(e) {
                    console.log(e)
                }finally{
                    this.pinnedPullRequests.loading = false
                }
            },

            async network_getSubscription() {
                 try{
                    this.subscription.loading = false
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_subscrtption')
                    let url = api.API_REPOSITORY_SUBSCRIPTION(this.owner(),this.repo())
                    let res = await authRequiredGet(url,{cancelToken})
                    this.subscription.data = res.data.items
                }catch(e) {
                    console.log(e)
                }finally{
                    this.subscription.loading = false
                    this.subscription.loaded = true
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
            CommonLoadingWrapper,
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

.action-disabled{
    background: #f6f8fa;
    border-color: #d1d5da;
    box-shadow: inset 0 0 10px rgba(27,31,35,.1);
    button{
        color: #586069;
    }
}
</style>