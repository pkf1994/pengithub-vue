<template>
    <svg class="container width-full height-full" viewBox="0 0 10 10">
        <circle cy="50%"
                cx="50%"
                r="40%"
                fill="none"
                :stroke="iconColor"
                stroke-dasharray="200%"
                stroke-dashoffset="200%"
                stroke-width="10%">
        </circle>
    </svg>
</template>

<script>
    export default {
        props: {
            color: {
                type: String
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