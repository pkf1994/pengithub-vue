<template>
        <Container class="py-4 mx-3 d-flex">
            <AvatarColumn class="flex-shrink-0 mr-1">
                <router-link to="/search">
                    <ImgWrapper>
                        <img :src="user.avatar_url" 
                                width="20" 
                                height="20" 
                                class="rounded-1" :alt="'@' + user.login">
                    </ImgWrapper>
                </router-link>
               
            </AvatarColumn>
            <Main class="ml-1  flex-grow-1">
                <NameLoginStarBtn class="f4 text-normal d-flex">
                    <NameLogin>
                        <AnimatedWidthWrapper class="v-align-text-top">
                            <router-link to="/search"  
                                        v-if="extraData.name && extraData.name.trim() !== ''" 
                                        :meta="randomMeta" 
                                        class="mr-1 no-wrap">{{extraData.name}}</router-link>
                        </AnimatedWidthWrapper>
                        <router-link to="/search" :meta="randomMeta" class="text-gray" >{{user.login}}</router-link>
                    </NameLogin>
                    <transition name="fade">
                        <FollowButton class="text-right flex-auto" v-if="extraData.viewerCanFollow">
                            <button class="btn btn-sm">
                                {{extraData.viewerIsFollowing ? 'Unfollow':'Follow'}}
                            </button>
                        </FollowButton>
                    </transition>
                </NameLoginStarBtn>

                <AnimatedHeightWrapper>
                    <Bio class="mb-1" :meta="randomMeta"  v-if="extraData.bio && extraData.bio.trim() !== ''">
                        {{extraData.bio}}
                    </Bio>
                
                    <MultiInfo class="d-flex flex-wrap text-small text-gray">
                        <Location class="mr-3" v-if="extraData.location && extraData.location.trim() !== ''">
                            {{extraData.location}}
                        </Location>
                        <Email v-if="extraData.email && extraData.email.trim() !== ''" class="mr-3">
                            {{extraData.email}}
                        </Email>
                    </MultiInfo>
                </AnimatedHeightWrapper>  
            </Main>
        </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {mapState} from "vuex";
    import {util_adjustStyle} from '@/util'
    import {
        AnimatedWidthWrapper,
        ImgWrapper,
        AnimatedHeightWrapper} from '@/components'
    import {
        WithRandomMetaMixin,
        CancelNetworkOnDestroyMixin} from '@/mixins'
    import {authRequiredGitHubGraphqlApiQuery} from '@/store/modules/network'
    export default {
        mixins: [WithRandomMetaMixin],
        inject: ['userExtraDataProvided','query'],
        props: {
            user: {
                type: Object,
                required: true
            }
        },
        computed: {
            extraData() {
                return this.userExtraDataProvided().filter(item => {
                    return item.id == this.user.node_id
                })[0] || {}
            }
        },
        mounted() {
            util_adjustStyle.highlightKeyword(`[meta=${this.randomMeta}]`,this.query())
        },
        updated() {
            util_adjustStyle.highlightKeyword(`[meta=${this.randomMeta}]`,this.query())
        },
        watch: {
          
        },
        methods: {
           
        },
        components: {
            ImgWrapper,
            AnimatedHeightWrapper,
            AnimatedWidthWrapper,
            Container: styled.div``,
            AvatarColumn: styled.div``,
            DefaultAvatar: styled.div``,
            Main: styled.div``,
            NameLoginStarBtn: styled.div``,
            NameLogin: styled.div``,
            FollowButton: styled.div``,
            Bio: styled.p``,
            MultiInfo: styled.div``,
            Location: styled.div``,
            Email: styled.div``,
        }
    }
</script>

<style scoped>

</style>