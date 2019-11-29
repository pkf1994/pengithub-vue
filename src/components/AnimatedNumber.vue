<template>
    <span>
        {{numStr}}
    </span>
</template>

<script>
    import numeral from 'numeral'
    export default {
        props: {
            value: {
                default: 0,
                required: true
            }
        },
        data: () => ({
            tweeningValue: 0
        }),
        computed: {
            numStr: function(){
                if(this.tweeningValue >= 1000) {
                    return numeral(this.tweeningValue.toFixed(0)).format('0.0 a');
                }
                return numeral(this.tweeningValue.toFixed(0)).format('0 a');
            }
        },
        watch: {
            value: function(newValue){
                TweenLite.to(this.$data, 0.5, { tweeningValue: newValue });
            }
        }
    }
</script>

<style scoped>

</style>