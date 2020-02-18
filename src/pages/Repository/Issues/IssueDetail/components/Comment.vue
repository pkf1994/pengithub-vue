<template>
    <Container class="container">
        <Header class="px-3 py-2 header text-normal f5">
            <Action class="action py-2 px-1 ml-2">
                <svg class="octicon" viewBox="0 0 13 16" version="1.1" width="13" height="16" role="img"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>
            </Action>
            <router-link class="d-inline-block">
                <img    class="avatar" 
                        :src="data.user.avatar_url"
                        height="20" 
                        width="20" 
                        :alt="`@${data.user.login}`">
            </router-link>
            <strong class="no-wrap">
                {{data.user.login}}
            </strong>
            commented
            <span class="no-wrap">{{createdAt}}</span>
        </Header>
        <Body v-html="data.bodyHTML">

        </Body>
        <Reaction>

        </Reaction>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_dateFormat} from '../../../../../util'
    export default {
        props: {
            data: {
                type: Object,
                required: true
            }
        },
        computed: {
            createdAt() {
                return util_dateFormat.dateFormat('dd zzz yyyy',new Date(this.data.created_at))
            }
        },
        components: {
            Container: styled.div``,
            Header: styled.div``,
            Body: styled.div``,
            Reaction: styled.div``,
            Action: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
.container{
    position: relative;
    color: #24292e;
    background-color: #fff;
    border: 1px solid #d1d5da;
    border-radius: 3px;
    .header{
        padding-right: 16px;
        padding-left: 16px;
        color: #586069;
        background-color: #f6f8fa;
        border-bottom: 1px solid #d1d5da;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        .action{
            float: right;
            margin-left: 8px;
        }
    }
}
</style>