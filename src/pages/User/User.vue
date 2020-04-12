<template>
   <Container  class="clearfix p-3">

       <transition name="fade" appear>
           <Main v-if="data.id">
                <UserBasicInfo>
                <AvatarAndName>
                    <Avatar class="float-left col-3 pr-3 mb-2">
                        <a href="" class="d-block position-relative">
                            <img :src="data.avatarUrl" :alt="`@${data.login}`" width="260" height="260" class="avatar width-full height-full">
                        </a>
                    </Avatar>

                    <Names class="float-left col-9 pt-1 pb-1">
                        <h1 class="pl-2" style="line-height:1">
                            <span class="name d-block overflow-hidden">{{data.name}}</span>
                            <span class="login d-block">{{data.login}}</span>
                        </h1>  
                    </Names>
                </AvatarAndName>

                <UserStatus v-if="data.status" class="mb-1 user-status-container">
                    <div class="d-flex py-2 width-full flex-items-center" :class="{busy:data.status.indicatesLimitedAvailability}">
                        <UserStatusEmoji class="mr-1 ml-1 user-status-emoji" v-html="data.status.emojiHTML">
                        </UserStatusEmoji>
                        <UserStatusMessage class="f6 mt-1 text-gray-dark ws-normal lh-condensed">
                            <div>{{data.status.message}}</div>
                        </UserStatusMessage>
                    </div>
                </UserStatus>

                <button class="btn btn-block top-0 mb-2">
                    {{data.viewerIsFollowing ? 'Unfollow' : 'Follow'}}
                </button>
                </UserBasicInfo>

                <SponsorInfo class="mt-3">
                    <Sponsors class="border-top py-3" v-if="data.sponsorshipsAsMaintainer && data.sponsorshipsAsMaintainer.totalCount > 0">
                        <h2 class="h4 d-flex flex-items-start mb-1">Sponsors</h2>
                        <router-link class="avatar-group-item mb-0 v-align-top mr-1 mb-1" v-for="item in data.sponsorshipsAsMaintainer.nodes" :key="item.sponsor.login" :to="`/${item.sponsor.login}`">
                            <img class="avatar d-block" :src="item.sponsor.avatarUrl" :alt="`@${item.sponsor.login}`" width="35" height="35">
                        </router-link><span v-if="data.sponsorshipsAsMaintainer.totalCount - data.sponsorshipsAsMaintainer.nodes.length > 0" class="d-inline-block border text-center rounded-1" style="width:35px;height:35px;line-height:33px;">
                            +{{data.sponsorshipsAsMaintainer.totalCount - data.sponsorshipsAsMaintainer.nodes.length}}
                        </span>
                    </Sponsors>

                    <Sponsoring class="border-top py-3" v-if="data.sponsorshipsAsSponsor && data.sponsorshipsAsSponsor.totalCount > 0">
                        <h2 class="h4 d-flex flex-items-start mb-1">Sponsoring</h2>
                        <router-link class="avatar-group-item mb-0 v-align-top mr-1 mb-1" v-for="item in data.sponsorshipsAsSponsor.nodes" :key="item.maintainer.login" :to="`/${item.maintainer.login}`">
                            <img class="avatar d-block" :src="item.maintainer.avatarUrl" :alt="`@${item.maintainer.login}`" width="35" height="35">
                        </router-link><span v-if="data.sponsorshipsAsSponsor.totalCount - data.sponsorshipsAsSponsor.nodes.length > 0" class="d-inline-block border text-center rounded-1" style="width:35px;height:35px;line-height:33px;">
                            +{{data.sponsorshipsAsSponsor.totalCount - data.sponsorshipsAsSponsor.nodes.length}}
                        </span>
                    </Sponsoring>
                </SponsorInfo>

                <UserProfile>
                    <Bio class="mb-2 user-profile-bio" v-html="data.bioHTML">

                    </Bio>
                    <div class="mb-3">
                        <UserProfileItem v-if="data.company" class="vcard-detail pt-1 css-truncate css-truncate-target">
                            <svg class="octicon octicon-organization" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M16 12.999c0 .439-.45 1-1 1H7.995c-.539 0-.994-.447-.995-.999H1c-.54 0-1-.561-1-1 0-2.634 3-4 3-4s.229-.409 0-1c-.841-.621-1.058-.59-1-3 .058-2.419 1.367-3 2.5-3s2.442.58 2.5 3c.058 2.41-.159 2.379-1 3-.229.59 0 1 0 1s1.549.711 2.42 2.088C9.196 9.369 10 8.999 10 8.999s.229-.409 0-1c-.841-.62-1.058-.59-1-3 .058-2.419 1.367-3 2.5-3s2.437.581 2.495 3c.059 2.41-.158 2.38-1 3-.229.59 0 1 0 1s3.005 1.366 3.005 4z"></path></svg>
                            <span>
                                {{data.company}}
                            </span>
                        </UserProfileItem>   

                        <UserProfileItem v-if="data.location" class="vcard-detail pt-1 css-truncate css-truncate-target">
                            <svg class="octicon octicon-location" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M6 0C2.69 0 0 2.5 0 5.5 0 10.02 6 16 6 16s6-5.98 6-10.5C12 2.5 9.31 0 6 0zm0 14.55C4.14 12.52 1 8.44 1 5.5 1 3.02 3.25 1 6 1c1.34 0 2.61.48 3.56 1.36.92.86 1.44 1.97 1.44 3.14 0 2.94-3.14 7.02-5 9.05zM8 5.5c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"></path></svg>
                            <span>
                                {{data.location}}
                            </span>
                        </UserProfileItem>   

                        <UserProfileItem v-if="data.email" class="vcard-detail pt-1 css-truncate css-truncate-target">
                            <svg class="octicon octicon-mail" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 4v8c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H1c-.55 0-1 .45-1 1zm13 0L7 9 1 4h12zM1 5.5l4 3-4 3v-6zM2 12l3.5-3L7 10.5 8.5 9l3.5 3H2zm11-.5l-4-3 4-3v6z"></path></svg>
                            <a :href="data.email">
                                {{data.email}}
                            </a>
                        </UserProfileItem>    

                        <UserProfileItem v-if="data.websiteUrl" class="vcard-detail pt-1 css-truncate css-truncate-target">
                            <svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>
                            <a :href="`mailto:${data.websiteUrl}`">
                                {{data.websiteUrl}}
                            </a>
                        </UserProfileItem>    
                    </div>
                </UserProfile>

                <BlockOrReport class="text-small my-1 muted-link btn-link">
                    Block or report user
                </BlockOrReport>

                <ComplexTopTab :tabs="tabs" class="ml-n3 mr-n3 border-bottom" :tabStyle="{marginRight: `0px!important`}"></ComplexTopTab>

                <router-view></router-view>
            </Main>
       </transition>
       
       

        <transition name="fade" appear>
            <CommonLoading v-if="loading"></CommonLoading>
        </transition>
       
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoading,ComplexTopTab} from '@/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {authRequiredGitHubGraphqlApiQuery,authRequiredGet } from '@/network'
    import * as graphql from './graphql'
    import * as api from '@/network/api'
    export default {
        name: 'user_page',
        mixins: [RouteUpdateAwareMixin],
        provide() {
            return {    
                loadingUserBasicInfoProvided: () => this.loading
            }
        },
        data() {
            return {
                data: {},
                loading: false
            }
        },
        computed: {
            login() {
                return this.$route.params.login
            },
            tabs() {
                return [
                    {
                        to: `/${this.login}`,
                        label: 'Overview'
                    },
                    {
                        to: `/${this.login}/repositories`,
                        label: 'Repositories'
                    },
                    {
                        to: `/${this.login}/projects`,
                        label: 'Projects'
                    },
                    {
                        to: `/${this.login}/stars`,
                        label: 'Stars'
                    },
                    {
                        to: `/${this.login}/followers`,
                        label: 'Followers'
                    },
                    {
                        to: `/${this.login}/following`,
                        label: 'Following'
                    },
                ]
            }
        },
        async created() {
            this.network_getData()
/*              let graphql_ = `
{
  organization(login: "30-seconds") {
    descriptionHTML
    location
    websiteUrl
    avatarUrl
    login
    isVerified
    registryPackages(first: 10) {
      totalCount
      nodes {
        name
        packageType
        color
        latestVersion {
          version
          statistics {
            downloadsTotalCount
          }
        }
      }
    }
   }
}
                    `
                let res = await authRequiredGitHubGraphqlApiQuery(graphql_)
                console.log(res.data) */
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let graphql_userInfo = graphql.GRAPHQL_USER_INFO(this.login)
                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_userInfo,{cancelToken})
                    this.data = res.data.data.user || {}
                    this.loading = false
                }catch(e) {
                    console.log(e)
                    this.loading = false
                }
            },
            generateRouterMeta() {
                return this.$route.params.login
            },
        },
        components: {
            CommonLoading,
            ComplexTopTab,
            Container: styled.div``,
            Main: styled.div``,
            UserBasicInfo: styled.div``,
            AvatarAndName: styled.div``,
            Avatar: styled.div``,
            Names: styled.div``,
            UserStatus: styled.div``,
            UserStatusEmoji: styled.div``,
            UserStatusMessage: styled.div``,
            SponsorInfo: styled.div``,
            Sponsors: styled.div``,
            Sponsoring: styled.div``,
            UserProfile: styled.div``,
            UserProfileItem: styled.div``,
            Bio: styled.div``,
            BlockOrReport: styled.div``,
        }   
    }
</script>

<style lang="scss">
.user-status-emoji{
    g-emoji{
        display: block;
    }
}
</style>

<style scoped lang="scss">
@import 'node_modules/@primer/css/layout/index.scss';
@import 'node_modules/@primer/css/avatars/index.scss';
@import 'node_modules/@primer/css/truncate/index.scss';
.name{
    font-size: 26px;
    line-height: 30px;
}
.login{
    font-size: 20px;
    font-style: normal;
    font-weight: 300;
    line-height: 24px;
    color: #666;
}
.user-status-container{
    word-break: break-word;
    word-wrap: break-word;
    white-space: normal;
}
.busy{
    background-color: #fffbdd;
    border: 1px solid #ffdf5d;
}
.vcard-detail{
    display: block!important;
    width: 100%;
    padding-left: 22px;
    max-width: 100%!important;
    svg {
        color: #6a737d;
        float: left;
        width: 16px;
        margin-top: 3px;
        margin-left: -22px;
    }
}
.user-mention {
    font-weight: 600;
    color: #24292e;
    white-space: nowrap;
}
</style>