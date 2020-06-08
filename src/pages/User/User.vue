<template>
   <CommonLoadingWrapper :loading="loading" class="clearfix p-3">

       <transition name="fade" appear>
           <Main v-if="data.node_id">
                <UserBasicInfo>
                <AvatarAndName>
                    <Avatar class="float-left col-3 pr-3 mb-3">
                        <a href="" class="d-block position-relative">
                            <ImgWrapper>
                                <img :src="data.avatar_url" :alt="`@${data.login}`" width="260" height="260" class="avatar width-full height-full">
                            </ImgWrapper>
                        </a>
                    </Avatar>

                    <Names class="float-left col-9 pt-1 pb-1">
                        <h1 class="pl-2" style="line-height:1">
                            <span class="name d-block overflow-hidden">{{data.name}}</span>
                            <span class="login d-block">{{data.login}}</span>
                        </h1>  
                    </Names>
                </AvatarAndName>

                <UserStatus v-if="extraData.data.status" class="mb-3 user-status-container">
                    <div class="d-flex py-2 width-full flex-items-center" :class="{busy:extraData.data.status.indicatesLimitedAvailability}">
                        <UserStatusEmoji class="mr-1 ml-1 user-status-emoji" v-html="extraData.data.status.emojiHTML">
                        </UserStatusEmoji>
                        <UserStatusMessage class="f6 mt-1 text-gray-dark ws-normal lh-condensed">
                            <div>{{extraData.data.status.message}}</div>
                        </UserStatusMessage>
                    </div>
                </UserStatus>

                <button class="btn btn-block top-0 mb-2">
                    {{extraData.data.viewerIsFollowing ? 'Unfollow' : 'Follow'}}
                </button>
                </UserBasicInfo>

                <SponsorInfo class="mt-3">
                    <Sponsors class="border-top py-3" v-if="extraData.data.sponsorshipsAsMaintainer && extraData.data.sponsorshipsAsMaintainer.totalCount > 0">
                        <h2 class="h4 d-flex flex-items-start mb-1">Sponsors</h2>
                        <router-link class="avatar-group-item mb-0 v-align-top mr-1 mb-1" v-for="item in extraData.data.sponsorshipsAsMaintainer.nodes" :key="item.sponsor.login" :to="`/${item.sponsor.login}`">
                            <ImgWrapper>
                                <img class="avatar d-block" :src="item.sponsor.avatarUrl" :alt="`@${item.sponsor.login}`" width="35" height="35">
                            </ImgWrapper>
                        </router-link><span v-if="extraData.data.sponsorshipsAsMaintainer.totalCount - extraData.data.sponsorshipsAsMaintainer.nodes.length > 0" class="d-inline-block border text-center rounded-1" style="width:35px;height:35px;line-height:33px;">
                            +{{extraData.data.sponsorshipsAsMaintainer.totalCount - extraData.data.sponsorshipsAsMaintainer.nodes.length}}
                        </span>
                    </Sponsors>

                    <Sponsoring class="border-top py-3" v-if="extraData.data.sponsorshipsAsSponsor && extraData.data.sponsorshipsAsSponsor.totalCount > 0">
                        <h2 class="h4 d-flex flex-items-start mb-1">Sponsoring</h2>
                        <router-link class="avatar-group-item mb-0 v-align-top mr-1 mb-1" v-for="item in extraData.data.sponsorshipsAsSponsor.nodes" :key="item.maintainer.login" :to="`/${item.maintainer.login}`">
                            <ImgWrapper>
                                <img class="avatar d-block" :src="item.maintainer.avatarUrl" :alt="`@${item.maintainer.login}`" width="35" height="35">
                            </ImgWrapper>
                        </router-link><span v-if="extraData.data.sponsorshipsAsSponsor.totalCount - extraData.data.sponsorshipsAsSponsor.nodes.length > 0" class="d-inline-block border text-center rounded-1" style="width:35px;height:35px;line-height:33px;">
                            +{{extraData.data.sponsorshipsAsSponsor.totalCount - extraData.data.sponsorshipsAsSponsor.nodes.length}}
                        </span>
                    </Sponsoring>
                </SponsorInfo>

                <UserProfile>
                    <Bio class="mb-2 user-profile-bio">
                        {{data.bio}}
                    </Bio>
                    <div class="mb-3">
                        <UserProfileItem v-if="extraData.data.isDeveloperProgramMember" class="vcard-detail pt-1 css-truncate css-truncate-target">
                            <HyperlinkWrapper>
                                 <a href="https://developer.github.com/">
                                    <svg class="octicon octicon-cpu mr-2 text-gray-light" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.5 0.75C6.5 0.335786 6.16421 0 5.75 0C5.33579 0 5 0.335786 5 0.75V2H3.75C2.7835 2 2 2.7835 2 3.75V5H0.75C0.335786 5 0 5.33579 0 5.75C0 6.16421 0.335786 6.5 0.75 6.5H2V9.5H0.75C0.335786 9.5 0 9.83579 0 10.25C0 10.6642 0.335786 11 0.75 11H2V12.25C2 13.2165 2.7835 14 3.75 14H5V15.25C5 15.6642 5.33579 16 5.75 16C6.16421 16 6.5 15.6642 6.5 15.25V14H9.5V15.25C9.5 15.6642 9.83579 16 10.25 16C10.6642 16 11 15.6642 11 15.25V14H12.25C13.2165 14 14 13.2165 14 12.25V11H15.25C15.6642 11 16 10.6642 16 10.25C16 9.83579 15.6642 9.5 15.25 9.5H14V6.5H15.25C15.6642 6.5 16 6.16421 16 5.75C16 5.33579 15.6642 5 15.25 5H14V3.75C14 2.7835 13.2165 2 12.25 2H11V0.75C11 0.335786 10.6642 0 10.25 0C9.83579 0 9.5 0.335786 9.5 0.75V2H6.5V0.75ZM12.25 12.5H10.25H5.75H3.75C3.61193 12.5 3.5 12.3881 3.5 12.25V10.25V5.75V3.75C3.5 3.61193 3.61193 3.5 3.75 3.5H5.75H10.25H12.25C12.3881 3.5 12.5 3.61193 12.5 3.75V5.75V10.25V12.25C12.5 12.3881 12.3881 12.5 12.25 12.5ZM5.75 5C5.33579 5 5 5.33579 5 5.75V10.25C5 10.6642 5.33579 11 5.75 11H10.25C10.6642 11 11 10.6642 11 10.25V5.75C11 5.33579 10.6642 5 10.25 5H5.75ZM6.5 9.5V6.5H9.5V9.5H6.5Z"></path></svg>
                                    Developer Program Member
                                </a>
                            </HyperlinkWrapper>
                        </UserProfileItem> 

                        <UserProfileItem v-if="extraData.data.isCampusExpert" class="vcard-detail pt-1 css-truncate css-truncate-target">
                            <HyperlinkWrapper>
                                 <a href="https://education.github.com/experts">
                                    <svg class="octicon octicon-mortar-board mr-2 text-gray-light" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.69321 1.06562C7.88838 0.978127 8.11162 0.978127 8.30679 1.06562L15.5568 4.31562C15.8265 4.4365 16 4.70448 16 5C16 5.29552 15.8265 5.5635 15.5568 5.68438L13 6.83053V9.625C13 10.6489 12.1894 11.374 11.3406 11.7984C10.4469 12.2453 9.26479 12.5 8 12.5C7.72205 12.5 7.44922 12.4877 7.1835 12.4641C6.77091 12.4273 6.46623 12.0631 6.50295 11.6505C6.53969 11.2379 6.90392 10.9332 7.31651 10.97C7.53769 10.9897 7.76613 11 8 11C9.08242 11 10.0253 10.779 10.6698 10.4568C11.3592 10.1121 11.5 9.77468 11.5 9.625V7.50294L8.30679 8.93438C8.11162 9.02187 7.88838 9.02187 7.69321 8.93438L4 7.27881V8.94167C4.29604 9.04701 4.57477 9.21725 4.81159 9.45407C5.24974 9.89223 5.5 10.5128 5.5 11.25V14.25C5.5 14.449 5.42098 14.6397 5.28032 14.7804C5.13966 14.921 4.94889 15.0001 4.74997 15L1.74997 14.9999C1.33577 14.9999 1 14.6641 1 14.2499V11.2499C1 10.5128 1.25027 9.89215 1.68843 9.45401C1.92524 9.2172 2.20396 9.04698 2.5 8.94165V6.60639L0.443208 5.68438C0.173541 5.5635 0 5.29552 0 5C0 4.70448 0.173541 4.4365 0.443208 4.31562L7.69321 1.06562ZM2.58349 5L8 7.42809L13.4165 5L8 2.57191L2.58349 5ZM2.5 11.2499C2.5 10.8621 2.62473 10.639 2.74907 10.5147C2.88047 10.3833 3.06051 10.3125 3.24999 10.3125C3.43947 10.3125 3.61951 10.3833 3.75091 10.5147C3.87526 10.6391 4 10.8622 4 11.25V13.5L2.5 13.5V11.2499Z"></path></svg>
                                    GitHub Campus Expert
                                </a>
                            </HyperlinkWrapper>
                        </UserProfileItem> 

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

                        <UserProfileItem v-if="data.blog" class="vcard-detail pt-1 css-truncate css-truncate-target">
                            <svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>
                            <a :href="`mailto:${data.blog}`">
                                {{data.blog}}
                            </a>
                        </UserProfileItem>    
                    </div>
                </UserProfile>

                <BlockOrReport class="text-small my-1 muted-link btn-link">
                    Block or report user
                </BlockOrReport>

                <ComplexTopTab :tabs="tabs" class="ml-n3 mr-n3 border-bottom user-tab bg-white" :tabStyle="{marginRight: `0px!important`}"></ComplexTopTab>

                <router-view></router-view>
            </Main>
       </transition>
    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoadingWrapper,ComplexTopTab,ImgWrapper,HyperlinkWrapper} from '@/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {authRequiredGitHubGraphqlApiQuery,authRequiredGet,commonGet} from '@/network'
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
                extraData: {
                    data: {},
                    loading: false
                },
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
                        label: 'Overview',
                        exact: true
                    },
                    {
                        to: `/${this.login}/repositories`,
                        label: 'Repositories'
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
        created() {
            this.network_getData()
        },
        methods: {
            network_getData() {
                this.network_getBasicData()
                if(this.accessToken) this.network_getExtraData()
            },
            async network_getBasicData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)

                    let url = api.API_USER(this.login)

                    let res = await authRequiredGet(url,{cancelToken})
                    if(res.data.type == 'Organization') {
                        this.$router.replace(`/orgs/${this.login}`)
                        return
                    }
                    this.data = res.data 

                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            async network_getExtraData() {
                try{
                    this.extraData.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_extra_data')
                    let graphql_extra = graphql.GRAPHQL_USER_INFO(this.login)
                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_extra,{cancelToken})
                    try{
                        this.extraData.data = res.data.data.user || {}
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.extraData.loading = false
                }
            },
        
            generateRouterMeta() {
                return this.$route.params.login
            },
        
        },
        components: {
            CommonLoadingWrapper,
            ImgWrapper,
            ComplexTopTab,
            HyperlinkWrapper,
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
    div{
        display: flex;
        flex-direction: column,

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

.user-tab{
    position: sticky;
    top:0;
    z-index: 9;
}
</style>