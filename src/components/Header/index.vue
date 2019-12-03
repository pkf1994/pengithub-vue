<template>
    <Container :theme="theme">
        <Logo>
            <LogoInner class="logo"/>
        </Logo>


        <BtnGroupRight>
            <Search @click="trigger">
                <i class="iconfont icon-search" style="font-size: 20px"/>
            </Search>
            <User>
                <i class="iconfont icon-LC_icon_user_fill_3" style="font-size: 22px"/>
            </User>
        </BtnGroupRight>

        <FadeTransition>
            <SearchHeader :theme="theme" v-show="searchFlag">
                <InputWrapper>
                    <input ref="searchInput" placeholder="搜索" class="search-input" type="text">
                </InputWrapper>
                <Search>
                    <i class="iconfont icon-search" style="font-size: 20px"/>
                </Search>
                <Cancel @click="trigger">
                    <i class="iconfont icon-guanbi" style="font-size: 18px"/>
                </Cancel>
            </SearchHeader>
        </FadeTransition>

        <FadeTransition>
            <Cover v-show="searchFlag" @click="trigger"/>
        </FadeTransition>

    </Container>
</template>

<script>
    import {
        Container,
        Logo,
        Title,
        LogoInner,
        BtnGroupRight,
        Search,
        User,
        SearchHeader,
        InputWrapper,
        Cancel,
        Cover
    } from './style'
    import ScrollTopListenerMixin from "../ScrollTopListenerMixin";
    import {mapState} from "vuex";
    import FadeTransition from '../FadeTransition'
    export default {
        mixins:[ScrollTopListenerMixin],
        props: {

        },
        data() {
            return {
                searchFlag: false
            }
        },
        computed: {
                ...mapState({
                    theme: state => state.ui.theme
                }),
            showLogo() {
                return this.scrollTop > 0 || this.alwaysShowLogo
            }
        },
        methods: {
            trigger:function() {
                if(!this.searchFlag){
                    setTimeout(() => {
                        this.$refs.searchInput.focus()
                    },0)
                }else{
                    setTimeout(() => {
                        this.$refs.searchInput.blur()
                    },0)
                }
                this.searchFlag = !this.searchFlag
            }
        },
        components: {
            Container,
            Logo,
            Title,
            LogoInner,
            BtnGroupRight,
            Search,
            User,
            SearchHeader,InputWrapper,
            Cancel,
            FadeTransition,
            Cover
        }
    }
</script>

<style scoped lang="scss">
    @import "../../scss";
    .header-without-border{
        border-width: 0px;
    }
    .logo{
        background: url("../../assets/image/github-icon.svg") no-repeat center;
        background-size: contain;
    }
    .search-input{
        flex-grow: 1;
        box-sizing: border-box;
        font-size: 16px;
        outline: none;
        border-width: 0;
        margin: 5px;
        padding: 5px;
        margin-left: 15px;
        border-color: gray;
        border-bottom-width: 1px;
        line-height: 1;
    }

    .search-input:focus{
        border-color: $primary-color;
        border-bottom-width: 2px;
    }
</style>