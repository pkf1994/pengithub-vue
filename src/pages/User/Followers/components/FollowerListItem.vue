<template>
    <Container class="d-flex py-4 border-bottom">

        <AvatarColumn class="col-2 mr-2">
            <router-link :to="`/${follower.login}`">
                <ImgWrapper class="avatar avatar-user" >
                    <img class="avatar avatar-user" height="50" width="50" :src="follower.avatar_url" :alt="`@${follower.login}`">
                </ImgWrapper>
            </router-link>
        </AvatarColumn> 
        
        <Content class="col-10">
            <div class="float-right mt-1 ml-1">
                    <FollowBtn class="btn-sm" :userLogin="follower.login" 
                                :viewerIsFollowing="comprehensiveFollower.viewerIsFollowing"
                                :viewerCanFollow="comprehensiveFollower.viewerCanFollow"></FollowBtn>
            </div>

             <router-link :to="`/${follower.login}`" class="mb-1 no-underline d-flex flex-items-center flex-wrap">
                <span v-if="data.name" class="f4 link-gray-dark no-wrap">{{data.name}}</span>
                <span class="link-gray pl-1 d-inline-block">{{follower.login}}</span>
            </router-link>

            <AnimatedHeightWrapper>
                <Bio v-if="data.bio" class="text-gray text-small mb-2">
                    {{data.bio}}
                </Bio>
         
                <TheMeta class="text-gray text-small mb-0">
                    <Company class="mr-3" v-if="data.company">
                        <svg class="octicon octicon-organization" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M16 12.999c0 .439-.45 1-1 1H7.995c-.539 0-.994-.447-.995-.999H1c-.54 0-1-.561-1-1 0-2.634 3-4 3-4s.229-.409 0-1c-.841-.621-1.058-.59-1-3 .058-2.419 1.367-3 2.5-3s2.442.58 2.5 3c.058 2.41-.159 2.379-1 3-.229.59 0 1 0 1s1.549.711 2.42 2.088C9.196 9.369 10 8.999 10 8.999s.229-.409 0-1c-.841-.62-1.058-.59-1-3 .058-2.419 1.367-3 2.5-3s2.437.581 2.495 3c.059 2.41-.158 2.38-1 3-.229.59 0 1 0 1s3.005 1.366 3.005 4z"></path></svg>
                        {{data.company}}
                    </Company>

                    <Location v-if="data.location">
                        <svg class="octicon octicon-location" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M6 0C2.69 0 0 2.5 0 5.5 0 10.02 6 16 6 16s6-5.98 6-10.5C12 2.5 9.31 0 6 0zm0 14.55C4.14 12.52 1 8.44 1 5.5 1 3.02 3.25 1 6 1c1.34 0 2.61.48 3.56 1.36.92.86 1.44 1.97 1.44 3.14 0 2.94-3.14 7.02-5 9.05zM8 5.5c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"></path></svg>
                        {{data.location}}
                    </Location>
                </TheMeta>
            </AnimatedHeightWrapper>
            
        </Content>
       
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {AnimatedHeightWrapper,ImgWrapper,FollowBtn} from '@/components'
    import {authRequiredGet} from '@/network'
    export default {
        inject: ['extraDataProvided'],
        props: {
            follower: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                data: {},
                loading: false
            }
        },
        computed: {
            comprehensiveFollower() {
                let extraData = this.extraDataProvided().filter(i => {
                    return i.id == this.follower.node_id
                })[0] || {}
                return Object.assign({},this.follower,extraData)
            },
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let res = await authRequiredGet(this.follower.url)
                    this.data = res.data
                }catch(e) {
                    console.log(e)
                }finally{
                    this.loading = false
                }
            }
        },
        components: {
            AnimatedHeightWrapper,
            ImgWrapper,
            FollowBtn,
            Container: styled.div``,
            AvatarColumn: styled.div``,
            Content: styled.div``,
            Bio: styled.p``,
            TheMeta: styled.p``,
            Company: styled.span``,
            Location: styled.span``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/layout/index.scss';
@import 'node_modules/@primer/css/avatars/index.scss';
</style>