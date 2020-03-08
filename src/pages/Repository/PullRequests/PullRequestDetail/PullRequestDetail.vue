<template>
    <Container>
        <PageTopTab :tabs="tabs"></PageTopTab>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {PageTopTab} from '@/components'
    export default {
        inject: ['owner','repo'],
        data() {
            return {
            }
        },
        computed: {
            number() {
                return this.$route.params.number
            },
            tabs() {
                let basePath = `/${this.owner()}/${this.repo()}/pull/${this.number}`
              return [
                    { 
                        label: 'Conversation',
                        to: `${basePath}`
                    },
                    { 
                        label: 'Commits',
                        to: `${basePath}/commits`
                    },
                    { 
                        label: 'Changes',
                        to: `${basePath}/changes`
                    },
                ]
            }
        },
        components: {
            PageTopTab,
            Container: styled.div``
        }
    }
</script>

<style scoped lang="scss">

</style>