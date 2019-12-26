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
        created(){
            this.action_getData()
        },
        methods: {
            recordScrollTop(event) {
                let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
                this.scrollTop = scrollTop
            }
        }
    }
</script>
