<template>
    <Container class="d-flex py-3 flex-items-center border-bottom">
        <Avatar class="flex-shrink-0">
            <router-link :to="`/${member.login}`">
                <ImgWrapper class="avatar avatar-user">
                    <img class="avatar avatar-user" :src="member.avatar_url" :alt="`@${member.login}`" width="48" height="48">
                </ImgWrapper>
            </router-link>
        </Avatar>

        <Name class="table-list-cell py-3 v-align-middle css-truncate pl-3 flex-grow-1">
            <AnimatedHeightWrapper>
                <router-link v-if="extraData && extraData.name" :to="`/${member.login}`" class="css-truncate-target f4">
                    {{extraData.name}}
                </router-link> 
                <router-link v-else-if="member.name" :to="`/${member.login}`" class="css-truncate-target f4">
                    {{member.name}}
                </router-link> 
            </AnimatedHeightWrapper>
            <span class="d-block css-truncate-target f5 text-gray-dark">{{member.login}}</span>
        </Name>

        <FollowBtnWrapper class="flex-shrink-0">
            <button :disabled="!extraData || !extraData.viewerCanFollow" class="btn btn-sm">
                {{extraData && extraData.viewerIsFollowing ? 'Unfollow' : 'Follow'}}
            </button>
        </FollowBtnWrapper>

    </Container>

</template>

<script>
    import styled from 'vue-styled-components'
    import {ImgWrapper,AnimatedHeightWrapper} from '@/components'
    export default {
        inject: ['memberExtraDataProvided'],
        props: {
            member: {
                type: Object,
                required: true
            }
        },
        computed: {
            extraData() {
                return this.memberExtraDataProvided().filter(i => {
                    return i.login == this.member.login
                })[0]
            }
        },
        components: {
            ImgWrapper,
            AnimatedHeightWrapper,
            Container: styled.div``,
            Avatar: styled.div``,
            Name: styled.div``,
            FollowBtnWrapper: styled.div``,
        }
    }
</script>
<style scoped lang="scss">
@import 'node_modules/@primer/css/avatars/index.scss';
@import 'node_modules/@primer/css/truncate/index.scss';
</style>