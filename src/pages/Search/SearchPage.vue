<template>
    <Container class="bg-white">
        <Inner  class="py-6 my-6 px-4 px-md-6 mx-md-6">
            <Title class="text-normal title">
                <svg height="24"
                     width="24"
                     class="v-align-text-bottom d-inline-block"
                     fill="currentColor"
                     viewBox="0 0 16 16"
                     version="1.1"
                     @click="switchTitle"
                     aria-hidden="true"><path fill-rule="evenodd" d="M15.7 13.3l-3.81-3.83A5.93 5.93 0 0013 6c0-3.31-2.69-6-6-6S1 2.69 1 6s2.69 6 6 6c1.3 0 2.48-.41 3.47-1.11l3.83 3.81c.19.2.45.3.7.3.25 0 .52-.09.7-.3a.996.996 0 000-1.41v.01zM7 10.7c-2.59 0-4.7-2.11-4.7-4.7 0-2.59 2.11-4.7 4.7-4.7 2.59 0 4.7 2.11 4.7 4.7 0 2.59-2.11 4.7-4.7 4.7z"></path></svg>

                Search more than
                <transition name="fade" mode="out-in">
                    <component :is="currentTitleFragment"></component>
                </transition>

            </Title>

            <SearchPane class="my-3 flex-column flex-items-stretch">
                <InputWrapper>
                    <input aria-label="Search GitHub"
                           autocapitalize="off"
                           autocomplete="off"
                           autofocus=""
                           class="search-input form-control input-block"
                           placeholder="Search GitHub"
                           spellcheck="false"
                           type="text"/>
                    </InputWrapper>
                    <button class="btn ml-sm-2 mt-2 mt-sm-0" type="submit">Search</button>
            </SearchPane>

            <ProTip>
                <strong>ProTip!</strong>
                For an
                <router-link to="/search/advanced">advanced search</router-link>, use some of our
                <a href="javascript:void(0);" @click="showModal">prefixes.</a>
            </ProTip>
        </Inner>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import Vue from 'vue/dist/vue.js';
    import {SEARCH_PAGE_MODAL_CONTENT} from './contant'
    export default {
        data(){
            return {
                modalContent: SEARCH_PAGE_MODAL_CONTENT,
                titleIndex: 0
            }
        },
        computed: {
            currentTitleFragment: function () {
                return 'TitleFragment' + this.titleIndex
            }
        },
        mounted() {
            this.interval = setInterval(() => {
                this.switchTitle()
            },5000)
        },
        destroyed() {
            window.clearInterval(this.interval)
        },
        methods: {
            showModal() {
                this.$modal("Search cheat sheet",this.modalContent)
            },
            switchTitle(e) {
                e && e.stopPropagation()
                if(this.titleIndex === 2) {
                    this.titleIndex = 0
                    return
                }
                this.titleIndex += 1
            }
        },
        components: {
            Container: styled.div``,
            Inner: styled.div``,
            Title: styled.h2``,
            SearchPane: styled.div``,
            InputWrapper: styled.div``,
            ProTip: styled.div``,
            TitleFragment0: {
                render: h => h(
                    'span',
                    [
                        h('strong', '147M'),
                        ' repositories'
                    ]
                )
            },
            TitleFragment1: {
                render: h => h(
                    'span',
                    [
                        h('strong', '466M'),
                        ' issues'
                    ]
                )
            },
            TitleFragment2: {
                render: h => h(
                    'span',
                    [
                        h('strong', '48M'),
                        ' users'
                    ]
                )
            }
        }
    }
</script>

<style scoped>
.title{
    font-size: 24px;
}
.search-input::placeholder{
    color:#586069;
    opacity: 0.55;
}
</style>