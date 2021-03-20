<template>
    <div v-if="commitAuthors" class="AvatarStack flex-self-start" :style="{marginRight: (commitAuthors.length - 1) * 8 + 'px'}">
       <div class="AvatarStack-body">
           <template v-for="item in commitAuthors">
                <router-link class="avatar" v-if="item.user && item.user.login" :to="`/${item.user.login}`"  :key="item.name">
                    <ImgWrapper class="avatar-url" >
                        <img height="20" width="20" class="avatar-url" :src="item.user.avatarUrl">
                    </ImgWrapper>
                </router-link>
           </template>
        </div> 
    </div> 
</template>
<script>
import styled from 'vue-styled-components'
import {ImgWrapper} from '@/components'
export default {
    props: {
        commit: Object
    },
    computed: {
        nodeId() {
            return this.commit.node_id
        },
        commitAuthors() {
            if(this.graphqlData) {
                return this.graphqlData.authors.nodes
            }
        }
    },
    components: {
        ImgWrapper,
        Container: styled.div``
    }
}
</script>
<style scoped lang="scss">
@import 'node_modules/@primer/css/avatars/index.scss';
.avatar{
    border-radius: 50%!important;
}
</style>