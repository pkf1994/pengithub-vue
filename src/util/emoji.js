
export default {
    parse: function(raw) {
        let pattern = /:\S+?:/g
        let execResult
        while((execResult = pattern.exec(raw)) !== null)  {
            let emojiQualified = emojiMapping.filter(item => {
                return item.code === execResult[0]
            })
            console.log(emojiQualified)
            if(emojiQualified.length > 0) {
                raw = raw.replace(execResult[0],emojiQualified[0].emoji)
            }
        } 
        return raw
    }
}

let emojiMapping = [
    {
        emoji:'🎉',
        code: ':tada:'
    },
    {
        emoji:'🆕',
        code: ':new:'
    },
    {
        emoji:'🔖',
        code: ':bookmark:'
    },
    {
        emoji:'🐛',
        code: ':bug:'
    },
    {
        emoji:'🚑',
        code: ':ambulance:'
    },
    {
        emoji:'🌐',
        code: ':globe_with_meridians:'
    },
    {
        emoji:'💄',
        code: ':lipstick:'
    },
    {
        emoji:'🎬',
        code: ':clapper:'
    },
    {
        emoji:'🚨',
        code: ':rotating_light:'
    },
    {
        emoji:'🔧',
        code: ':wrench:'
    },
    {
        emoji:'➕',
        code: ':heavy_plus_sign:'
    },
    {
        emoji:'➖',
        code: ':heavy_minus_sign:'
    },
    {
        emoji:'⬆️',
        code: ':arrow_up:'
    },
    {
        emoji:'⬇️',
        code: ':arrow_down:'
    },
    {
        emoji:'⚡️',
        code: ':zap:'
    },
    {
        emoji:'🐎',
        code: ':racehorse:'
    },
    {
        emoji:'📈',
        code: ':chart_with_upwards_trend:'
    },
    {
        emoji:'🚀',
        code: ':rocket:'
    },
    {
        emoji:'✅',
        code: ':white_check_mark:'
    },
    {
        emoji:'📝',
        code: ':memo:'
    },
    {
        emoji:'🔨',
        code: ':hammer:'
    },
    {
        emoji:'🎨',
        code: ':art:'
    },
    {
        emoji:'🔥',
        code: ':fire:'
    },
    {
        emoji:'✏️',
        code: ':pencil2:'
    },
    {
        emoji:'🚧',
        code: ':construction:'
    },
    {
        emoji:'🗑',
        code: ':wastebasket:'
    },
    {
        emoji:'♿️',
        code: ':wheelchair:'
    },
    {
        emoji:'👷',
        code: ':construction_worker:'
    },
    {
        emoji:'💚',
        code: ':green_heart:'
    },
    {
        emoji:'🔒',
        code: ':lock:'
    },
    {
        emoji:'🐳',
        code: ':whale:'
    },
    {
        emoji:'🍎',
        code: ':apple:'
    },
    {
        emoji:'🐧',
        code: ':penguin:'
    },
    {
        emoji:'🏁',
        code: ':checkered_flag:'
    }
]