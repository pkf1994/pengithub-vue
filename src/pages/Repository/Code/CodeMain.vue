<template>
    <container>
        <AnimatedHeightWrapper :class="{'mt-3' : data.description && data.description !== ''}">  
            <Description class="repository-meta mb-0 mx-3" v-if="data.description && data.description !== ''">
                {{data.description}}
                <span v-if="data.homepageUrl && data.homepageUrl.trim() !== ''">-</span>
                <a v-if="data.homepageUrl && data.homepageUrl.trim() !== ''" 
                :href="data.homepageUrl">{{data.homepageUrl}}</a>   
            </Description>
            <Topics v-if="data.repositoryTopics && data.repositoryTopics.nodes && data.repositoryTopics.nodes.length > 0" class="repository-meta mx-3 mt-2 d-inline-flex flex-wrap">
                <router-link 
                            :key="item.topic.name"
                            to="/search"
                            class="topic-item f6"
                            v-for="item in data.repositoryTopics.nodes">
                            {{item.topic.name}}
                </router-link>
            </Topics>
        </AnimatedHeightWrapper>   

        <ActionPane class="bubble flex mt-3">
            <StarItOrNot class="flex-auto text-center">
                <button class="px-2">
                    <svg class="v-align-text-bottom d-inline-block" fill="currentColor" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>
                    {{data.viewerHasStarred ? "Unstar" : "Star"}}   
                    <AnimatedWidthWrapper class="v-align-bottom">
                        <span class="Counter d-inline-block no-wrap">{{starNumber}}</span>
                    </AnimatedWidthWrapper> 
                </button>
            </StarItOrNot>
            <WatchItOrNot class="flex-auto text-center" style="border-left: 1px solid #d1d5da;">
                <button  class="px-2">
                    <svg v-if="data.viewerSubscription === 'IGNORED'" class="v-align-text-bottom d-inline-block" fill="currentColor" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2.81v10.38c0 .67-.81 1-1.28.53L3 10H1c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h2l3.72-3.72C7.19 1.81 8 2.14 8 2.81zm7.53 3.22l-1.06-1.06-1.97 1.97-1.97-1.97-1.06 1.06L11.44 8 9.47 9.97l1.06 1.06 1.97-1.97 1.97 1.97 1.06-1.06L13.56 8l1.97-1.97z"></path></svg>
                    <svg v-else class="v-align-text-bottom d-inline-block" fill="currentColor" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.06 2C3 2 0 8 0 8s3 6 8.06 6C13 14 16 8 16 8s-3-6-7.94-6zM8 12c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4zm2-4c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"></path></svg>   
                    {{subscriptionActionStr}}
                </button>
            </WatchItOrNot>
            <AnimatedWidthWrapper>
                <Sponsor v-if="data.fundingLinks && (data.fundingLinks.length > 0)" class="flex-auto no-wrap text-center" style="border-left: 1px solid #d1d5da;">
                    <button  class="px-2">
                        <svg class="v-align-text-bottom text-pink d-inline-block" fill="currentColor" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M9 2c-.97 0-1.69.42-2.2 1-.51.58-.78.92-.8 1-.02-.08-.28-.42-.8-1-.52-.58-1.17-1-2.2-1-1.632.086-2.954 1.333-3 3 0 .52.09 1.52.67 2.67C1.25 8.82 3.01 10.61 6 13c2.98-2.39 4.77-4.17 5.34-5.33C11.91 6.51 12 5.5 12 5c-.047-1.69-1.342-2.913-3-3z"></path></svg>
                        Sponsor
                    </button>  
                </Sponsor>
            </AnimatedWidthWrapper>    
        </ActionPane>

        <Branchs></Branchs>

        <Readme :readme="readme" v-if="!readme404" :loading="loading || loadingReadme"/>

        <Releases v-if="data.releases && data.releases.nodes.length > 0" :loading="loading" :releases="data.releases"/>

        <Issues :loading="loading" 
                        :issues="data.issues && data.issues.nodes" 
                        :totalCount="data.issues && data.issues.totalCount"/>      
 
        <PullRequests 
            :loading="loading" 
            :pullRequests="data.pullRequests && data.pullRequests.nodes" 
            :totalCount="data.pullRequests && data.pullRequests.totalCount"/>

        <Notifications :loading="loading" :viewerSubscription="data.viewerSubscription"/>

    </container>
</template>

<script>
    import styled from 'vue-styled-components'
    import { mapState,mapActions } from 'vuex'
    import {
        AnimatedHeightWrapper,
        AnimatedWidthWrapper,
        LoadingAndCatchErrorTemplate,
        ComplexBubble} from '../../../components'
    import {
        ACTION_REPOSITORY_REQUEST_CODE_BASIC_DATA,
        ACTION_REPOSITORY_REQUEST_README_DATA} from '../../../store/modules/repository/actionTypes'
    import { util_numberFormat } from '../../../util'
    import {Branchs,Readme,Releases,Issues,PullRequests,Notifications} from './components'
    export default {
        data() {
            return {
                readme404: false
            }
        },
        inject: ['owner','repo'],
        computed: {
            ...mapState({
                data: state => state.repository.code.data,
                loading: state => state.repository.code.loading,
                loadingReadme: state => state.repository.code.readme.loading,
                readme: state => {
                    let reg4Article = /<\/article>/
                    let reg4H = /<h[1|2|3|4][^>]*>.*<\/h[1|2|3|4]>/gi
                    let readme = state.repository.code.readme.data
                    if(readme) {
                        let matchArray = readme.match(reg4H)
                        let matchArrayArticle = readme.match(reg4Article)
                        if(matchArray && matchArray.length > 1) {
                            return readme.substring(0, readme.indexOf(matchArray[1])) + readme.substring(readme.indexOf(matchArrayArticle[0]),readme.lenght)
                        }
                    }
                    return state.repository.code.readme.data
                }
            }),
            starNumber: function() {
                if(this.data.stargazers)return util_numberFormat.thousands(this.data.stargazers.totalCount)
                return ""
            },
            subscriptionActionStr: function() {
                if(this.data.viewerSubscription === null) return "Unwatch releases"
                if(this.data.viewerSubscription === "SUBSCRIBED") return "Unwatch"
                if(this.data.viewerSubscription === "IGNORED") return "Stop ignoring"
                return "Watch"
            }
        },
        created() {
            this.getReadme()
        },
        methods: {
            ...mapActions({
                action_getReadme: ACTION_REPOSITORY_REQUEST_README_DATA
            }),
            async getReadme() {
                try{
                    this.readme404 = false
                    await this.action_getReadme({owner:this.owner,repo:this.repo})
                } catch (e) {
                    if(e.response && e.response.status === 404) {
                        this.readme404 = true
                    }
                }
            }
        },
        components: {
            AnimatedHeightWrapper,
            AnimatedWidthWrapper,
            LoadingAndCatchErrorTemplate,
            ComplexBubble,
            Branchs,
            Readme,
            Releases,
            Issues,
            PullRequests,
            Notifications,
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

<style scoped>
.repository-meta{
    font-size: 13px;
    color: #586069;
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