<script>
    export default {
        data:() => ({
            scrollTop:0
        }),
        mounted() {
            let scrollEl = document.getElementById('app-container')
            scrollEl.addEventListener('scroll',this.recordScrollTop,false)
        },
        destroyed() {
            let scrollEl = document.getElementById('app-container')
            scrollEl.removeEventListener('scroll',this.recordScrollTop,false)
        },
        methods: {
            recordScrollTop(event) {
                let scrollEl = document.getElementById('app-container')
                let scrollTop = scrollEl.scrollTop
                this.scrollTop = scrollTop
            }
        }
    }
</script>
