<template>
    <Container class="p-3">
        <Inner class="bubble m-0">
            <Header class="bubble-title">
                <router-link :to="`/${data.actor.login}`">
                    {{data.actor.login}}
                </router-link>
                <strong>referenced</strong>
                this pull request from another {{data.source.issue.pull_request ? 'pull request' : 'issue'}}
            </Header>

            <AnimatedHeightWrapper>
                <Body class="p-3 bubble-content">
                    <strong>
                        <router-link :to="data.source.issue.url.replace('https://api.github.com/repos','')">
                            #{{data.source.issue.number}} {{data.source.issue.title}}
                        </router-link>
                    </strong>
                </Body>
            </AnimatedHeightWrapper>
        </Inner>   
            
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {LoadingIconEx,AnimatedHeightWrapper,Popover} from '../../../../../components'
    import {mapState} from 'vuex'
    import ClipboardJS from 'clipboard';
    export default {
        data() {
            return {
                popoverStyle: {
                    top: '100%',
                    right: '-6px'
                }
            }
        },
        props: {
            data: {
                type: Object,
                required: true
            }
        },
        computed: {
           
        },
        methods: {
           
        },
        components: {
            LoadingIconEx,
            AnimatedHeightWrapper,
            Container: styled.div``,
            Inner: styled.div``,
            Header: styled.div``,
            LoadingWrapper: styled.div``,
            Body: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
.bubble-title{
    font-size: 12px;
    color: #6a737d;
    background-color: #f6f8fa;
    border-bottom: 1px solid #e1e4e8;
    a{
        color: #6a737d;
    }
}

.bubble-content {
    a{
        color: #444d56;
    }
}
</style>