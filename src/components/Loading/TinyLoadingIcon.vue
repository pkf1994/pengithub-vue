<template>
    <div class="loading">
    </div>
</template>
<script>
export default {
        components: {
        }
    }
</script>
<style scoped>
.loading{
    font-size: 10px;
    position: relative;
    text-indent: -9999em;
    border-top: .2em solid rgba(255, 255, 255, 0.2);
    border-right: .2em solid rgba(255, 255, 255, 0.2);
    border-bottom: .2em solid gray;
    border-left: .2em solid gray;
    transform: translateZ(0);
    animation: load8 1.1s infinite linear;
    border-radius: 50%;
    width: 1.8em;
    height: 1.8em;
    color:black;
}

@keyframes load8{
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}


</style>