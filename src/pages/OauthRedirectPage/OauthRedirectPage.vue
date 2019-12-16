<script src="../../store/modules/user/actions.js"></script>
<template>
    <Container class="container position-fixed width-full bg-gray-light pt-4 px-3">
        <Illustration class="illustration mx-auto">
            <Inner class="illustration-inner flex flex-justify-between flex-items-center py-4">
                <Badge class="app-icon round flex-row-center" style="width: 56px;height:56px;background:#dcffe4">
                    <img class="badge-img" src="https://github.com/identicons/app/oauth_app/1073954" height="31" width="31" alt="">
                </Badge>
                <Badge class="round flex-row-center p-1 transition-all" :class="exceptionOccurred ? 'bg-red' : 'bg-green'" style="width: 32px;height:32px">
                    <transition name="zoom">
                        <span v-if="exceptionOccurred" style="font-size: 24px" class="iconfont text-white icon-error"></span>
                        <LoadingIcon v-else color="white"/>
                    </transition>
                </Badge>
                <Badge class="round bg-white " style="width: 56px;height:56px">
                    <svg class="v-align-text-bottom width-full height-full" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                </Badge>
            </Inner>
        </Illustration>
        <Title  class="f2 text-center text-normal lh-125 mb-4">
            Getting Access Token...
        </Title>

        <Transition name="slide-up" appear>
            <MessageBox v-show="exceptionOccurred" class="message-box box box-shadow mt-5 position-fixed">



                <Message class="p-3">
                    <MessageTitle class="mb-3 lh-1">
                        Exception
                    </MessageTitle>
                    {{exception.detailMessage}}
                </Message>

                <MessageBoxFooter class="box-footer p-3">
                    <button @click="retry" class="btn block width-full mb-3">
                        Retry
                    </button>
                    <router-link to="/" replace>
                        <button class="btn block width-full">
                            Cancel
                        </button>
                    </router-link>
                </MessageBoxFooter>
            </MessageBox>
        </Transition>
    </Container>
</template>

<script>
    import styled from "vue-styled-components"
    import {LoadingIcon} from '../../components'
    import {mapActions, mapMutations, mapState} from "vuex";
    import {ACTION_OAUTH_REQUEST_ACCESS_TOKEN} from "../../store/modules/oauth/actionTypes";
    import {CROSS_MUTATION_RESOLVE_DATA} from "../../store/modules/crossMutation";
    export default {
        created() {
            this.receiveCodeAndRequestAccessToken()
        },
        computed: {
            ...mapState({
                exceptionOccurred: state => state.oauth.exceptionOccurred,
                authenticated: state => state.oauth.authenticated,
                exception: state => {
                    return state.oauth.exception || {

                    }
                }
            })
        },
        watch: {
            authenticated(newValue,oldValue) {
                if(newValue) {
                    this.$router.replace({
                        path:'/'
                    })
                }
            }
        },
        methods: {
            ...mapActions({
                action_oauth_requestAccessToken: ACTION_OAUTH_REQUEST_ACCESS_TOKEN
            }),
            ...mapMutations({
                common_mutation_resolveData: CROSS_MUTATION_RESOLVE_DATA
            }),
            retry() {
                this.receiveCodeAndRequestAccessToken()
            },
            cancel() {
                location.href = process.env.VUE_APP_HOST
            },
            receiveCodeAndRequestAccessToken() {
                if(this.authenticated) {
                    this.$router.replace({
                        path: '/'
                    })
                    return
                }
                const code = this.$router.currentRoute.query.code
                this.action_oauth_requestAccessToken({code: code})
            }
        },
        components: {
            LoadingIcon,
            Container: styled.div``,
            Illustration: styled.div``,
            Inner: styled.div``,
            Title: styled.h1``,
            Badge: styled.div``,
            MessageBox: styled.div``,
            Message: styled.div``,
            MessageTitle: styled.h3``,
            MessageBoxFooter: styled.div``
        }

    }
</script>

<style scoped lang="scss">
.container{
    top: 0;
    bottom: 0;
}

.illustration{
    width: 200px;
    position: relative;
    &:before {
        position: absolute;
        z-index: -1;
        top: 50%;
        left: 0;
        width: 100%;
        content: "";
        border-bottom: 2px dashed #e1e4e8;
    }
}
.badge-img{
    max-width: 60%;
    height: auto;
    max-height: 55%;
}
.app-icon{
    box-shadow: 0 1px 5px rgba(27,31,35,.15);
}

.message-box{
    bottom: 16px;
    left: 16px;
    right: 16px;
}
</style>