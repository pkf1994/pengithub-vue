<template>
    <Container class="p-6 flex-column-center">
        <svg height="32" class="blankslate-icon v-align-text-bottom" fill="currentColor" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M15.7 13.3l-3.81-3.83A5.93 5.93 0 0013 6c0-3.31-2.69-6-6-6S1 2.69 1 6s2.69 6 6 6c1.3 0 2.48-.41 3.47-1.11l3.83 3.81c.19.2.45.3.7.3.25 0 .52-.09.7-.3a.996.996 0 000-1.41v.01zM7 10.7c-2.59 0-4.7-2.11-4.7-4.7 0-2.59 2.11-4.7 4.7-4.7 2.59 0 4.7 2.11 4.7 4.7 0 2.59-2.11 4.7-4.7 4.7z"></path></svg>
        <Message class="text-center">
            <slot>
                We couldn’t find any item matching query.
            </slot>
        </Message> 
    </Container>            
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        name: 'empty_notice',
        components: {
            Container: styled.div``,
            Message: styled.h3``
        }
    }
</script>

<style scoped>
.blankslate-icon {
    margin-right: 4px;
    margin-bottom: 8px;
    margin-left: 4px;
    color: #a3aab1;
}
</style>