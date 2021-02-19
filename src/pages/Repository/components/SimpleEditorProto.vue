<template>
    <Container class="container">
        <textarea ref="textarea" v-model="content" class="form-control" placeholder="Leave a comment" rows="5" style="width: 100%"></textarea>
        <slot>
        </slot>    
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        model: {
            prop: 'content' ,
            event: 'input'
        },
        props: {
            content: String,
        },
        data() {
            return {
                loading: false
            }
        },
        mounted() {
            this.$refs.textarea.focus()
        },
        activated() {
            this.$refs.textarea.focus()
        },
        components: {
            Container: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
.container{
    padding-right: 15px;
    padding-left: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
}
</style>