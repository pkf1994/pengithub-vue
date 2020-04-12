<template>
    <Container  class="Box-row d-flex flex-items-center">
        <Left class="flex-auto">
            <Inner>
                <svg v-if="checked" class="v-align-text-bottom mr-1 text-green" fill="currentColor" aria-label="Added" viewBox="0 0 12 16" version="1.1" width="12" height="16" role="img"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
                <svg v-else class="v-align-text-bottom mr-1" fill="currentColor" style="color: #dbab09;" aria-label="Not added yet" viewBox="0 0 8 16" version="1.1" width="8" height="16" role="img"><path fill-rule="evenodd" d="M0 8c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z"></path></svg>
                <span>
                    <slot></slot>
                </span>   
            </Inner>
            <Sub v-if="subNotice.trim() !== ''">
                <router-link to="/" class="text-small mr-2 mt-1 mt-md-0">
                    {{subNotice}}
                </router-link>
            </Sub>
        </Left>    
        <router-link v-if="withProposeBtn" to="/" class="btn btn-sm">
                Propose
        </router-link>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        props: {
            checked: [Object,Boolean],
            withProposeBtn: {
                type: Boolean,
                default: false
            },
            subNotice: {
                type: String,
                default: ''
            }
        },
        components: {
            Container: styled.div``,
            Left: styled.div``,
            Inner: styled.div``,
            Sub: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/box/index.scss';
</style>