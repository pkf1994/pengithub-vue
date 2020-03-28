<template>
    <router-link :to="`/explore/topics/${topic.name}`" class="exploregrid-item d-flex flex-column flex-justify-center p-5">
        <img :src="topic.avatar" :alt="`@${topic.displayName}`" width="64" height="64" class="mx-auto rounded-1 mb-3">
        <p class="f3 lh-condensed text-center link-gray-dark mb-0 mt-1">
            {{topic.displayName}}
        </p>
        <p class="f5 text-gray text-center mb-0 mt-1">
            {{topic.description}}
        </p>
    </router-link>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        props: {
            topic: {
                type: Object,
                required: true
            }
        },
        components: {
            Container: styled.div``,
         }
    }
</script>

<style scoped>
.exploregrid-item{
    flex: 1;
    position: relative;
    height: 100%;
    font-size: 14px;
    color: #555;
    border: 1px solid rgba(0,0,0,.075);
    border-bottom-color: rgba(0,0,0,.125);
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 5px 10px rgba(0,0,0,.05);
    transition: border-color .1s ease-in-out,box-shadow .1s ease-in-out;
}
</style>