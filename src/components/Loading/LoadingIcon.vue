<template>
     <img alt="loading"
            :height="size"
            :width="size"
            class="width-fit height-fit"
            src="../../assets/image/octocat-spinner-128.gif"/>
</template>

<script>
    export default {
        props: {
            color: {
                type: String
            },
            size: {
                type: Number,
                default: 35
            }
        },
        computed: {
            iconColor() {
                return this.color ? this.color : this.primaryColor
            }
        }
    }
</script>

<style scoped lang="scss">
    .container{
        animation: rotate 2s linear infinite;
        circle{
            animation: animate 4s linear infinite;
        }
    }
    @keyframes rotate {
        0%{
            transform: rotate(0deg);
        }
        100%{
            transform: rotate(360deg);
        }
    }
    @keyframes animate {
        0%,100%{
            stroke-dashoffset: 200%
        }
        50%{
            stroke-dashoffset: 0%
        }
        50.1%{
            stroke-dashoffset: 400%
        }
    }
</style>