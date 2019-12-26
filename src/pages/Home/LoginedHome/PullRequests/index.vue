<template>
    <Container>
        <PageTopTab :tabs="tabs" />
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </Container>
</template>

<script>
    import {PageTopTab} from '../../../../components'
    import styled from 'vue-styled-components'
    import {mapActions} from "vuex";
    export default {
        data() {
            return {
                tabs: [
                    {
                        label: 'Created',
                        to: '/pulls'
                    },
                    {
                        label: 'Assigned',
                        to: '/pulls/assigned'
                    },
                    {
                        label: 'Mentioned',
                        to: '/pulls/mentioned'
                    }
                ]
            }
        },
        created() {

        },
        methods: {
            ...mapActions({

            })
        },
        components: {
            PageTopTab,
            Container: styled.div``
        }
    }
</script>

<style scoped>

</style>