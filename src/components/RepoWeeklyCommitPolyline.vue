<template>
    <svg width="155" height="30">
        <defs>
            <linearGradient :id='`gradient-${randomMeta}`' x1="0" x2="0" y1="1" y2="0">
                <stop offset="10%" stop-color="#9be9a8"></stop>
                <stop offset="33%" stop-color="#40c463"></stop>
                <stop offset="66%" stop-color="#30a14e"></stop>
                <stop offset="90%" stop-color="#216e39"></stop>
            </linearGradient>
            <mask :id="`sparkline-${randomMeta}`" x="0" y="0" width="155" height="28">
                <polyline transform="translate(0, 28) scale(1,-1)" :points="points" fill="transparent" stroke="#8cc665" stroke-width="2">
                </polyline>
            </mask>
        </defs>

        <g>
            <rect x="0" y="0" width="155" height="30" :style="{stroke: 'none', fill: `url(#gradient-${randomMeta})`, mask: `url(#sparkline-${randomMeta})`}"></rect>
        </g>
    </svg>
</template>

<script>
    export default {
        props: {
            weeklyCommitCount: {
                type: Array,
                required: true
            }
        },
        computed: {
            activityUpperLimit() {
                let activityUpperLimit = 0
                this.weeklyCommitCount.forEach(i => {
                    if(i > activityUpperLimit) activityUpperLimit = i
                })
                return activityUpperLimit
            },
            points() {
                let points = ''
                if(this.activityUpperLimit > 28) {
                    this.weeklyCommitCount.forEach((i,index) => {
                        points = points + `${index * 3},${i * 28 / this.activityUpperLimit} `
                    })
                }else {
                    this.weeklyCommitCount.forEach((i,index) => {
                        points = points + `${index * 3},${i} `
                    })
                }
                
                return points
            },
             randomMeta: function() {
                return  `random${parseInt(Math.random() * 10000)}meta`
            }
        }
    }
</script>

<style scoped>
</style>