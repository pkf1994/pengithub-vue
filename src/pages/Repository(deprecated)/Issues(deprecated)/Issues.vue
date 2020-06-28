<template>
    <Container class="flex-column flex-grow-1 bg-white">
        <PageTopTab :tabs="tabs" />
        <keep-alive>
            <router-view class="flex-grow-1"></router-view>
        </keep-alive>
    </Container>
</template>

<script>
    import {PageTopTab} from '../../../components'
    import styled from 'vue-styled-components'
    export default {
        inject: ['owner','repo'],
        data() {
            return {
             
            }
        },
        computed: {
            tabs() {
                return [
                        {
                            label: 'Open',
                            to: `/${this.owner}/${this.repo}/issues`
                        },
                        {
                            label: 'Closed',
                            to: `/${this.owner}/${this.repo}/issues/closed`
                        },
                        {
                            label: 'Yours',
                            to: `/${this.owner}/${this.repo}/issues/yours`
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