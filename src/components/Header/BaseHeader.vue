<template>
    <Container v-if="authenticated" class="header p-3" style="align-self: stretch">
        <MainRow class="d-flex flex-items-center text-white flex-justify-between">
            <Menu class="btn-link text-white mr-3 d-flex flex-items-center" @click="triggerShowPullDown">
                <svg display="d-inline-block v-align-text-bottom" height="24" class="" viewBox="0 0 12 16" version="1.1" width="18" aria-hidden="true"><path fill-rule="evenodd" fill="currentColor" d="M11.41 9H.59C0 9 0 8.59 0 8c0-.59 0-1 .59-1H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zm0-4H.59C0 5 0 4.59 0 4c0-.59 0-1 .59-1H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zM.59 11H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1H.59C0 13 0 12.59 0 12c0-.59 0-1 .59-1z"></path></svg>
            </Menu>
            <slot></slot>
            <router-link to="/notifications">
                <Notification class="notification flex-row-center position-relative">
                    <WithUnreadNoticationIndicator v-if="unreadNotificationsCount" class="with-unread-notification-indicator"></WithUnreadNoticationIndicator>
                    <svg class="d-inline-block v-align-text-bottom" :class="{disabled:loadingUnreadNotificationsCount}" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" fill="currentColor" d="M14 12v1H0v-1l.73-.58c.77-.77.81-2.55 1.19-4.42C2.69 3.23 6 2 6 2c0-.55.45-1 1-1s1 .45 1 1c0 0 3.39 1.23 4.16 5 .38 1.88.42 3.66 1.19 4.42l.66.58H14zm-7 4c1.11 0 2-.89 2-2H5c0 1.11.89 2 2 2z"></path></svg>
                </Notification>
            </router-link>
        </MainRow>
        <AnimatedHeightWrapper :stretch="stretch">
            <MenuPullDown class="pt-3" ref="menuPullDown">
                <SearchWrapper class="search-wrapper mb-3">
                    <input class="search-input input-sm input-contrast form-control width-full"
                           placeholder="Search GitHub"
                           autocomplete="off"
                           autocorrect="off"
                           spellcheck="false"
                           type="text">
                </SearchWrapper>
                <nav class="d-flex flex-column flex-lg-row flex-self-stretch flex-lg-self-auto" aria-label="Global">
                    <router-link class="nav-item d-block d-lg-none py-2 py-lg-0 border-top border-lg-top-0 border-white-fade-15" v-for="item in staticNavList" :key="item.label" :to="item.to" @click.native="closeNav">
                        {{item.label}}
                    </router-link>
                    <router-link @click.native="closeNav" class="nav-item d-block d-lg-none py-2 py-lg-0 border-top border-lg-top-0 border-white-fade-15"  to="/">
                        <ImgWrapper>
                            <img height="20" width="20" class="avatar" :src="avatarUrl"/>
                        </ImgWrapper>
                        {{login ? login : 'user'}}
                    </router-link>
                    <button @click="signOut" class="nav-item d-lg-none py-2 py-lg-0 border-top border-lg-top-0 border-white-fade-15" style="text-align:left">
                        <svg class="d-inline-block v-align-middle" fill="currentColor" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 9V7H8V5h4V3l4 3-4 3zm-2 3H6V3L2 1h8v3h1V1c0-.55-.45-1-1-1H1C.45 0 0 .45 0 1v11.38c0 .39.22.73.55.91L6 16.01V13h4c.55 0 1-.45 1-1V8h-1v4z"></path></svg>
                        Sign out
                    </button>
                </nav>
            </MenuPullDown>
        </AnimatedHeightWrapper>
    </Container>
    <LogoutedHeader v-else></LogoutedHeader>
</template>

<script>
    import styled from 'vue-styled-components'
    import LogoutedHeader from './LogoutedHeader'
    import ImgWrapper from '../ImgWrapper'
    import {AnimatedHeightWrapper} from '../AnimatedSizeWrapper'
    import {mapState,mapActions} from "vuex";
    import {commonDelete} from '@/network'
    import {ACTION_SIGN_OUT} from '@/store/modules/oauth/actionTypes.js'
    export default {
        data() {
            return {
                stretch: false,
                computedHeight: 0,
                staticNavList: [
                    {
                        to: '/',
                        label: 'Dashboard'
                    },
                    {
                        to: '/pulls',
                        label: 'Pull requests'
                    },
                    {
                        to: '/issues',
                        label: 'Issues'
                    },
                    {
                        to: '/explore',
                        label: 'Explore'
                    }
                ],
                searchInputStyle: {
                    display: "table-cell",
                    width: "100%",
                    paddingTop: 0,
                    paddingBottom: 0,
                    fontSize: "inherit",
                    color: "inherit",
                    background: "none",
                    border: 0,
                    boxShadow: "none",
                }
            }
        },
        computed: {
            ...mapState({
                avatarUrl: state => state.oauth.viewerInfo.avatarUrl,
                login: state => state.oauth.viewerInfo.login,
                authenticated: state => state.oauth.accessToken.authenticated,
                unreadNotificationsCount: state => state.notifications.unread.count,
                loadingUnreadNotificationsCount: state => state.notifications.unread.loading,
                accessToken: state => state.oauth.accessToken.accessToken
            })
        },
        mounted() {
            //this.computedStretchHeight()
        },
        methods: {
           /*  computedStretchHeight() {
                this.computedHeight = this.$refs.menuPullDown.$el.offsetHeight
            }, */
            ...mapActions({
                action_signOut: ACTION_SIGN_OUT
            }),
            triggerShowPullDown() {
                this.stretch = !this.stretch
            },
            closeNav() {
                this.stretch = false
            },
            async signOut() {
                
               /*  let res = await commonDelete(`https://api.github.com/applications/125cb651f63615c6d362/tokens/${this.accessToken}`,{
                    headers: {
                        "Authorization": "basic MTI1Y2I2NTFmNjM2MTVjNmQzNjI6ZDcxYjYxNzc0NGMyMGIzMWY3ZTUyNjkzZGUwNGNhMjIxOGY3NzFlMg=="
                    }
                })
                console.log(res) */
                this.action_signOut()
            }
        },
        components: {
            LogoutedHeader,
            AnimatedHeightWrapper,
            ImgWrapper,
            Container: styled.div``,
            MainRow: styled.div``,
            Menu: styled.button``,
            Logo: styled.a``,
            Notification: styled.div``,
            Badge: styled.span``,
            MenuPullDown: styled.div``,
            SearchWrapper: styled.label``,
            DynamicHeightWrapper: styled.div``,
            WithUnreadNoticationIndicator: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
.header{
    background-color: #24292e;
}

.menu-btn{
    border-width: 0;
  background: transparent;
  outline: none;
  padding: 0
}

.search-wrapper{
    display: table;
    width: 100%;
    max-width: 100%;
    padding: 0;
    font-size: inherit;
    font-weight: 400;
    color: #fff;
    vertical-align: middle;
    background-color: hsla(0,0%,100%,.125);
    border: 0;
    box-shadow: none;
}
.search-input{
    display: table-cell;
    width: 100%;
    padding-top: 0;
    padding-bottom: 0;
    font-size: inherit;
    color: inherit;
    background: none;
    border: 0;
    box-shadow: none;
    &::placeholder{
        color: hsla(0%,0%,100%,.75)
    }
    &:focus{
        background: none;
        outline: none;
        border: 0;
        box-shadow: none;
    }
}
.nav-item{
    font-weight: 600;
    color: #fff;
    white-space: nowrap;
}
.avatar{
    display: inline-block;
    overflow: hidden;
    line-height: 1;
    vertical-align: middle;
    border-radius: 3px;
}

.with-unread-notification-indicator{
    position: absolute;
    top: -9px;
    left: 6px;
    z-index: 2;
    width: 14px;
    height: 14px;
    color: #fff;
    background-image: linear-gradient(#54a3ff,#006eed);
    background-clip: padding-box;
    border: 2px solid #24292e;
    border-radius: 50%;
    display: inline-block;
}
.notification{
    svg{
        color: white;
    }
}
.disabled{
    color: #dddddd!important;
}
</style>