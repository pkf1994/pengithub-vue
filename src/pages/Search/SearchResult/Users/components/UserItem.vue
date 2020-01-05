<template>
        <Container class="py-4 mx-3 flex">
            <AvatarColumn class="flex-shrink-0 mr-2">
                <router-link to="/search">
                    <img :src="user.avatar_url" 
                    width="20" 
                    height="20" 
                    class="rounded-1" :alt="'@' + user.login">
                </router-link>
               
            </AvatarColumn>
            <Main class="ml-1  flex-grow-1">
                <NameLoginStarBtn class="f4 text-normal flex">
                    <NameLogin>
                        <AnimatedWidthWrapper class="v-align-bottom">
                            <router-link to="/search"  
                                        v-if="user.name && user.name.trim() !== ''" 
                                        :meta="randomMeta" 
                                        class="mr-1 no-wrap">{{user.name}}</router-link>&nbsp;
                        </AnimatedWidthWrapper>
                        <router-link to="/search" :meta="randomMeta" class="text-gray" >{{user.login}}</router-link>
                    </NameLogin>
                    <transition name="fade">
                        <FollowButton class="text-right flex-auto" v-if="user.viewerCanFollow">
                            <button class="btn btn-sm">
                                {{user.viewerIsFollowing ? 'Unfollow':'Follow'}}
                            </button>
                        </FollowButton>
                    </transition>
                </NameLoginStarBtn>

                <AnimatedHeightWrapper>
                    <Bio class="mb-1" :meta="randomMeta"  v-if="user.bio && user.bio.trim() !== ''">
                        {{user.bio}}
                    </Bio>
                
                    <MultiInfo class="d-flex flex-wrap text-small text-gray">
                        <Location class="mr-3" v-if="user.location && user.location.trim() !== ''">
                            {{user.location}}
                        </Location>
                        <Email v-if="user.email && user.email.trim() !== ''" class="mr-3">
                            {{user.email}}
                        </Email>
                    </MultiInfo>
                </AnimatedHeightWrapper>  
            </Main>
        </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {mapState} from "vuex";
    import {util_adjustStyle} from '../../../../../util'
    import {
        AnimatedWidthWrapper,
        AnimatedHeightWrapper} from '../../../../../components'
    import {
        WithRandomMetaMixin,
        CancelNetworkOnDestroyMixin} from '../../../../../mixins'
    import {authRequiredGitHubGraphqlApiQuery} from '../../../../../store/modules/network'
    export default {
        mixins: [WithRandomMetaMixin],
        props: {
            user: {
                type: Object,
                required: true
            }
        },
        computed: {
            ...mapState({
                searchQuery: state => state.search.searchQuery
            }),
        },
        mounted() {
            util_adjustStyle.highlightKeyword(`[meta=${this.randomMeta}]`,this.searchQuery)
        },
        watch: {
          
        },
        methods: {
           
        },
        components: {
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