<script>
    export default {
        data:() => ({
            scrollTop:0
        }),
        mounted() {
            window.addEventListener('scroll',this.recordScrollTop,false)
        },
        destroyed() {
            window.removeEventListener('scroll',this.recordScrollTop,false)
        },
        methods: {
            recordScrollTop() {
                let scrollTop =  window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
                this.scrollTop = scrollTop
            }
        }
    }
</script>
