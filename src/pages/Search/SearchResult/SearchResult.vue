<template>
    <Container>
        <SearchInputWrapper class="p-2 border-bottom">
            <input aria-label="Search GitHub"
                   v-model="localSearchQuery"
                   autocapitalize="off"
                   autocomplete="off"
                   autofocus=""
                   ref="input"
                   class="search-input form-control input-block"
                   placeholder="Search GitHub"
                   spellcheck="false"
                   type="text"/>
        </SearchInputWrapper>

        <ComplexTopTab class="mb-2 border-bottom" :tabs="tabs"/>
        <keep-alive>
            <router-view/>
        </keep-alive>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {SearchInput, ComplexTopTab, WithSearchInputMixin} from '../../../components'
    import {mapState} from "vuex";
    export default {
        mixins: [WithSearchInputMixin],
        computed: {
            tabs: function () {
                return [
                    {
                        to: `/search?q=${this.searchQuery}`,
                        label: 'Repositories',
                        meta: '337K'
                    },
                    {
                        to: `/search/code?q=${this.searchQuery}`,
                        label: 'Code',
                        meta: '37M'
                    },
                    {
                        to: `/search/commits?q=${this.searchQuery}`,
                        label: 'Commits',
                        meta: '27K'
                    },
                    {
                        to: `/search/issues?q=${this.searchQuery}`,
                        label: 'Issues',
                        meta: '62k'
                    }
                ]
            }
        },
        components: {
            SearchInput,
            ComplexTopTab,
            Container: styled.div``,
            SearchInputWrapper: styled.div``
        }
    }
</script>

<style scoped>
    .search-input::placeholder{
        color:#586069;
        opacity: 0.55;
    }
</style>