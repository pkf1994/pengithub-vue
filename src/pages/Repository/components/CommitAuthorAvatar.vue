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
import {mapState} from 'vuex'
export default {
    props: {
        commit: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapState({
            commitAuthors(state){
                let authorsHolder = state.graphqlListData.commits.filter(i => i.id == this.commit.node_id)[0]
                if(authorsHolder) return authorsHolder.authors.nodes
            } 
        }),
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