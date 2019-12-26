<template>
    <Container class="flex-column flex-grow-1 bg-white">
        <PageTopTab :tabs="tabs" />
        <keep-alive>
            <router-view class="flex-grow-1"></router-view>
        </keep-alive>
    </Container>
</template>

<script>
    import {PageTopTab} from '../../../../components'
    import styled from 'vue-styled-components'
    export default {
        data() {
            return {
                tabs: [
                    {
                        label: 'Created',
                        to: '/issues'
                    },
                    {
                        label: 'Assigned',
                        to: '/issues/assigned'
                    },
                    {
                        label: 'Mentioned',
                        to: '/issues/mentioned'
                    }
                ]
            }
        },
        components: {
            PageTopTab,
            Container: styled.div``
        }
    }
</script>

<style scoped>

</style>