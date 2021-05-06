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
                <router-link v-if="graphqlData && graphqlData.name" :to="`/${member.login}`" class="css-truncate-target f4">
                    {{graphqlData.name}}
                </router-link> 
                <router-link v-else-if="member.name" :to="`/${member.login}`" class="css-truncate-target f4">
                    {{member.name}}
                </router-link> 
            </AnimatedHeightWrapper>
            <span class="d-block css-truncate-target f5 text-gray-dark">{{member.login}}</span>
        </Name>

        <FollowBtn :userLogin="member.login" class="btn-sm flex-shrink-0"/>
          

    </Container>

</template>

<script>
    import styled from 'vue-styled-components'
    import {ImgWrapper,AnimatedHeightWrapper,FollowBtn} from '@/components'
    import * as graphql from './graphql'
    export default {
        props: {
            member: {
                type: Object,
                required: true
            }
        },
        computed: {
            nodeId(){
                return this.member.node_id
            },
        },
        created() {
            this.action_getGraphqlData({
                id: this.member.node_id,
                graphql: graphql.PEOPLE
            })
        },
        components: {
            ImgWrapper,
            AnimatedHeightWrapper,
            FollowBtn,
            Container: styled.div``,
            Avatar: styled.div``,
            Name: styled.div``,
        }
    }
</script>
<style scoped lang="scss">
@import 'node_modules/@primer/css/avatars/index.scss';
@import 'node_modules/@primer/css/truncate/index.scss';
</style>