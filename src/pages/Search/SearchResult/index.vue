<template>
    <Container>
        <Search :onInput="() => {}"
                placeholder="Search GitHub"
                class="border-bottom"/>
        <ComplexTopTab :tabs="tabs"/>
        <keep-alive>
            <router-view/>
        </keep-alive>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Search,ComplexTopTab} from '../../../components'
    export default {
        data() {
            return {
                tabs: [
                    {
                        to: '/search',
                        label: 'Repositories',
                        meta: '337K'
                    },
                    {
                        to: '/search/code',
                        label: 'Code',
                        meta: '37M'
                    },
                    {
                        to: '/search/commits',
                        label: 'Commits',
                        meta: '27K'
                    },
                    {
                        to: '/search/issues',
                        label: 'Issues',
                        meta: '62k'
                    }
                ]
            }
        },
        components: {
            Search,
            ComplexTopTab,
            Container: styled.div``
        }
    }
</script>

<style scoped>

</style>