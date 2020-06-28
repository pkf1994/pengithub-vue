<template>
    <Container class="d-flex flex-items-baseline border-bottom border-gray py-3">
        <AvatarColumn class="mr-3">
            <router-link :to="'/' + activity.actor.login">
                <img class="avatar avatar-user" :src="activity.actor.avatar_url" width="32" height="32" :alt="`@${activity.actor.login}`">
            </router-link>
        </AvatarColumn>

        <!-- ForkEvent -->
        <Content v-if="activity.type == 'ForkEvent'"  class="d-flex flex-column width-full">

            <WhoDidWhat>
                <router-link :to="`/${activity.actor.login}`" class="link-gray-dark no-underline text-bold wb-break-all d-inline-block">{{activity.actor.login}}</router-link>
                forked
                <router-link :to="`/${activity.payload.forkee.full_name}`" class="link-gray-dark no-underline text-bold wb-break-all d-inline-block">{{activity.payload.forkee.full_name}}</router-link>
                from
                <router-link :to="`/${activity.repo.name}`" class="link-gray-dark no-underline text-bold wb-break-all d-inline-block">{{activity.repo.name}}</router-link>
                <span class="f6 text-gray-light no-wrap ml-1">
                    {{activity.created_at | getDateDiff}}
                </span>
            </WhoDidWhat>

            <Payload class="Box p-3 mt-2">
                <button :disabled="extraData.data.viewerHasStarred === undefined" class="btn btn-sm ml-2 mb-2 float-right">
                    <svg v-if="!extraData.data.viewerHasStarred" class="octicon octicon-star mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>
                    <svg v-else height="16" class="octicon octicon-star-fill" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"></path></svg>
                    {{extraData.data.viewerHasStarred ? 'Unstar' : 'Star'}}
                </button>

                <div class="f4 lh-condensed text-bold text-gray-dark">
                    <router-link :to="`/${activity.repo.name}`" class="link-gray-dark no-underline text-bold wb-break-all d-inline-block">
                        {{activity.repo.name}}
                    </router-link>
                </div>

                <div class="text-gray mt-1 repo-description break-word">
                    <p>{{extraData.data.description}}</p>
                </div>

                <p class="f6 text-gray mt-2 mb-0">
                    <span class="d-inline-block mr-3">
                        <router-link class="muted-link" :to="`/${activity.repo.name}/stargazers`">
                            <svg class="octicon octicon-star mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>1
                        </router-link>              
                    </span>
                    <span v-if="extraData.data.updatedAt">Update {{extraData.data.updatedAt | getDateDiff}}</span>
                </p>
            </Payload>
        </Content>

        <!-- WatchEvent -->
        <Content v-else-if="activity.type == 'WatchEvent'"  class="d-flex flex-column width-full">

            <WhoDidWhat>
                <router-link :to="`/${activity.actor.login}`" class="link-gray-dark no-underline text-bold wb-break-all d-inline-block">
                    {{activity.actor.login}}
                </router-link>
                <span>
                    starred
                </span>
                <router-link :to="`/${activity.repo.name}`" class="link-gray-dark no-underline text-bold wb-break-all d-inline-block">
                    {{activity.repo.name}}
                </router-link>
                <span class="f6 text-gray-light no-wrap ml-1">
                    {{activity.created_at | getDateDiff}}
                </span>
            </WhoDidWhat>

            <Payload class="Box p-3 mt-2">
                <button :disabled="extraData.data.viewerHasStarred === undefined" class="btn btn-sm ml-2 mb-2 float-right">
                    <svg v-if="!extraData.data.viewerHasStarred" class="octicon octicon-star mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>
                    <svg v-else height="16" class="octicon octicon-star-fill" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"></path></svg>
                    {{extraData.data.viewerHasStarred ? 'Unstar' : 'Star'}}
                </button>

                <div class="f4 lh-condensed text-bold text-gray-dark">
                    <router-link :to="`/${activity.repo.name}`" class="link-gray-dark no-underline text-bold wb-break-all">
                        {{activity.repo.name}}
                    </router-link>
                </div>

                <div class="text-gray mt-1 repo-description break-word">
                    <p>{{extraData.data.description}}</p>
                </div>

                <p class="f6 text-gray mt-2 mb-0">
                    <span class="d-inline-block mr-3">
                        <router-link class="muted-link" :to="`/${activity.repo.name}/stargazers`">
                            <svg class="octicon octicon-star mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>1
                        </router-link>              
                    </span>
                    <span v-if="extraData.data.updatedAt">Update {{extraData.data.updatedAt | getDateDiff}}</span>
                </p>
            </Payload>
        </Content>

        <!-- PushEvent -->
        <Content v-else-if="activity.type == 'PushEvent'"  class="d-flex flex-column width-full">

            <WhoDidWhat>
                <router-link :to="`/${activity.actor.login}`" class="link-gray-dark no-underline text-bold wb-break-all d-inline-block">{{activity.actor.login}}</router-link>
                pushed to
                <router-link :to="`/${activity.repo.name}`" class="link-gray-dark no-underline text-bold wb-break-all d-inline-block">{{activity.repo.name}}</router-link>
                <span class="f6 text-gray-light no-wrap ml-1">
                    {{activity.created_at | getDateDiff}}
                </span>
            </WhoDidWhat>

            <Payload class="Box p-3 mt-2">

                <span>
                    {{activity.payload.commits.length}} {{activity.payload.commits.length > 1 ? 'commits' : 'commit'}} to 
                    <router-link :to="`/${activity.repo.name}/${activity.payload.ref.replace('refs/heads/','')}`" class="branch-name">
                        {{activity.payload.ref.replace('refs/heads/','')}}
                    </router-link>
                </span>    

                <ul>
                    <li v-for="item in activity.payload.commits" :key="item.sha" class="list-style-none">
                        <span>
                            {{item.author.name}}
                        </span>
                        <span class="break-word lh-condensed">
                            {{item.message}}
                        </span>
                    </li>
                </ul>
            </Payload>
        </Content>
        
    </Container>
</template>
<script>
    import styled from 'vue-styled-components'
    import * as graphql from '../graphql'
    import {authRequiredGitHubGraphqlApiQuery} from '@/network'
    export default {
        props: {
            activity: Object
        },
        data() {
           return {
                extraData: {
                    data: {},
                    loading: false
                }
           }
        },
        created() {
            this.network_getExtraData()
        },
        methods: {
            network_getExtraData() {
                if(this.activity.type == 'ForkEvent') this.network_getRepository()
                if(this.activity.type == 'WatchEvent') this.network_getRepository()
            },
            async network_getRepository(){
                try{
                    this.extraData.loading = true
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_REPOSITORY,
                        {
                            variables: {
                                name: this.activity.repo.name.split('/')[1],
                                owner: this.activity.repo.name.split('/')[0]
                            }
                        }
                    )
                    try{
                        this.extraData.data = res.data.data.repository
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                }catch(e) {
                    console.log(e)
                }finally{
                    this.extraData.loading = false
                }
            }
        },
        components: {
            Container: styled.div``,
            AvatarColumn: styled.div``,
            Content: styled.div``,
            WhoDidWhat: styled.div``,
            Payload: styled.div``
        }
    }
</script>
<style scoped lang="scss">
@import "node_modules/@primer/css/avatars/index.scss";
@import "node_modules/@primer/css/box/index.scss";
@import "node_modules/@primer/css/branch-name/index.scss";
.avatar-user{
    border-radius: 50%!important;
}
</style>