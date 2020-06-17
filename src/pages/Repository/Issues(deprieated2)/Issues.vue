<template>
    <div>
         <keep-alive>
            <router-view name="RepositoryIssuesBrowser"></router-view>
        </keep-alive>
        <router-view name="RepositoryIssueDetail"></router-view>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style scoped>

</style>