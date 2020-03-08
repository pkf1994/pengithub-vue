
export default {
    parse: function(raw) {
        let pattern = /:\S+?:/g
        let execResult
        while((execResult = pattern.exec(raw)) !== null)  {
            let emojiQualified = emojiMapping.filter(item => {
                return item.code === execResult[0]
            })
            if(emojiQualified.length > 0) {
                raw = raw.replace(execResult[0],emojiQualified[0].emoji)
            }
        } 
        return raw
    }
}

let emojiMapping = [
    {
        "emoji": "🎨",
        "entity": "&#x1f3a8;",
        "code": ":art:",
        "description": "Improving structure / format of the code.",
        "name": "art"
      },
      {
        "emoji": "⚡️",
        "entity": "&#x26a1;",
        "code": ":zap:",
        "description": "Improving performance.",
        "name": "zap"
      },
      {
        "emoji": "🔥",
        "entity": "&#x1f525;",
        "code": ":fire:",
        "description": "Removing code or files.",
        "name": "fire"
      },
      {
        "emoji": "🐛",
        "entity": "&#x1f41b;",
        "code": ":bug:",
        "description": "Fixing a bug.",
        "name": "bug"
      },
      {
        "emoji": "🚑",
        "entity": "&#128657;",
        "code": ":ambulance:",
        "description": "Critical hotfix.",
        "name": "ambulance"
      },
      {
        "emoji": "✨",
        "entity": "&#x2728;",
        "code": ":sparkles:",
        "description": "Introducing new features.",
        "name": "sparkles"
      },
      {
        "emoji": "📝",
        "entity": "&#x1f4dd;",
        "code": ":pencil:",
        "description": "Writing docs.",
        "name": "pencil"
      },
      {
        "emoji": "🚀",
        "entity": "&#x1f680;",
        "code": ":rocket:",
        "description": "Deploying stuff.",
        "name": "rocket"
      },
      {
        "emoji": "💄",
        "entity": "&#ff99cc;",
        "code": ":lipstick:",
        "description": "Updating the UI and style files.",
        "name": "lipstick"
      },
      {
        "emoji": "🎉",
        "entity": "&#127881;",
        "code": ":tada:",
        "description": "Initial commit.",
        "name": "tada"
      },
      {
        "emoji": "✅",
        "entity": "&#x2705;",
        "code": ":white_check_mark:",
        "description": "Updating tests.",
        "name": "white-check-mark"
      },
      {
        "emoji": "🔒",
        "entity": "&#x1f512;",
        "code": ":lock:",
        "description": "Fixing security issues.",
        "name": "lock"
      },
      {
        "emoji": "🍎",
        "entity": "&#x1f34e;",
        "code": ":apple:",
        "description": "Fixing something on macOS.",
        "name": "apple"
      },
      {
        "emoji": "🐧",
        "entity": "&#x1f427;",
        "code": ":penguin:",
        "description": "Fixing something on Linux.",
        "name": "penguin"
      },
      {
        "emoji": "🏁",
        "entity": "&#x1f3c1;",
        "code": ":checkered_flag:",
        "description": "Fixing something on Windows.",
        "name": "checkered-flag"
      },
      {
        "emoji": "🤖",
        "entity": "&#129302;",
        "code": ":robot:",
        "description": "Fixing something on Android.",
        "name": "robot"
      },
      {
        "emoji": "🍏",
        "entity": "&#127823;",
        "code": ":green_apple:",
        "description": "Fixing something on iOS.",
        "name": "green-apple"
      },
      {
        "emoji": "🔖",
        "entity": "&#x1f516;",
        "code": ":bookmark:",
        "description": "Releasing / Version tags.",
        "name": "bookmark"
      },
      {
        "emoji": "🚨",
        "entity": "&#x1f6a8;",
        "code": ":rotating_light:",
        "description": "Removing linter warnings.",
        "name": "rotating-light"
      },
      {
        "emoji": "🚧",
        "entity": "&#x1f6a7;",
        "code": ":construction:",
        "description": "Work in progress.",
        "name": "construction"
      },
      {
        "emoji": "💚",
        "entity": "&#x1f49a;",
        "code": ":green_heart:",
        "description": "Fixing CI Build.",
        "name": "green-heart"
      },
      {
        "emoji": "⬇️",
        "entity": "⬇️",
        "code": ":arrow_down:",
        "description": "Downgrading dependencies.",
        "name": "arrow-down"
      },
      {
        "emoji": "⬆️",
        "entity": "⬆️",
        "code": ":arrow_up:",
        "description": "Upgrading dependencies.",
        "name": "arrow-up"
      },
      {
        "emoji": "📌",
        "entity": "&#x1F4CC;",
        "code": ":pushpin:",
        "description": "Pinning dependencies to specific versions.",
        "name": "pushpin"
      },
      {
        "emoji": "👷",
        "entity": "&#x1f477;",
        "code": ":construction_worker:",
        "description": "Adding CI build system.",
        "name": "construction-worker"
      },
      {
        "emoji": "📈",
        "code": ":chart_with_upwards_trend:",
        "description": "Adding analytics or tracking code.",
        "name": "chart-with-upwards-trend"
      },
      {
        "emoji": "♻️",
        "entity": "&#x2672;",
        "code": ":recycle:",
        "description": "Refactoring code.",
        "name": "recycle"
      },
      {
        "emoji": "🐳",
        "entity": "&#x1f433;",
        "code": ":whale:",
        "description": "Work about Docker.",
        "name": "whale"
      },
      {
        "emoji": "➕",
        "entity": "&#10133;",
        "code": ":heavy_plus_sign:",
        "description": "Adding a dependency.",
        "name": "heavy-plus-sign"
      },
      {
        "emoji": "➖",
        "entity": "&#10134;",
        "code": ":heavy_minus_sign:",
        "description": "Removing a dependency.",
        "name": "heavy-minus-sign"
      },
      {
        "emoji": "🔧",
        "entity": "&#x1f527;",
        "code": ":wrench:",
        "description": "Changing configuration files.",
        "name": "wrench"
      },
      {
        "emoji": "🌐",
        "entity": "&#127760;",
        "code": ":globe_with_meridians:",
        "description": "Internationalization and localization.",
        "name": "globe-with-meridians"
      },
      {
        "emoji": "✏️",
        "entity": "&#59161;",
        "code": ":pencil2:",
        "description": "Fixing typos.",
        "name": "pencil"
      },
      {
        "emoji": "💩",
        "entity": "&#58613;",
        "code": ":poop:",
        "description": "Writing bad code that needs to be improved.",
        "name": "poop"
      },
      {
        "emoji": "⏪",
        "entity": "&#9194;",
        "code": ":rewind:",
        "description": "Reverting changes.",
        "name": "rewind"
      },
      {
        "emoji": "🔀",
        "entity": "&#128256;",
        "code": ":twisted_rightwards_arrows:",
        "description": "Merging branches.",
        "name": "twisted-rightwards-arrows"
      },
      {
        "emoji": "📦",
        "entity": "&#1F4E6;",
        "code": ":package:",
        "description": "Updating compiled files or packages.",
        "name": "package"
      },
      {
        "emoji": "👽",
        "entity": "&#1F47D;",
        "code": ":alien:",
        "description": "Updating code due to external API changes.",
        "name": "alien"
      },
      {
        "emoji": "🚚",
        "entity": "&#1F69A;",
        "code": ":truck:",
        "description": "Moving or renaming files.",
        "name": "truck"
      },
      {
        "emoji": "📄",
        "entity": "&#1F4C4;",
        "code": ":page_facing_up:",
        "description": "Adding or updating license.",
        "name": "page-facing-up"
      },
      {
        "emoji": "💥",
        "entity": "&#x1f4a5;",
        "code": ":boom:",
        "description": "Introducing breaking changes.",
        "name": "boom"
      },
      {
        "emoji": "🍱",
        "entity": "&#1F371",
        "code": ":bento:",
        "description": "Adding or updating assets.",
        "name": "bento"
      },
      {
        "emoji": "👌",
        "entity": "&#x1f44c;",
        "code": ":ok_hand:",
        "description": "Updating code due to code review changes.",
        "name": "ok-hand"
      },
      {
        "emoji": "♿️",
        "entity": "&#9855;",
        "code": ":wheelchair:",
        "description": "Improving accessibility.",
        "name": "wheelchair"
      },
      {
        "emoji": "💡",
        "entity": "&#128161;",
        "code": ":bulb:",
        "description": "Documenting source code.",
        "name": "bulb"
      },
      {
        "emoji": "🍻",
        "entity": "&#x1f37b;",
        "code": ":beers:",
        "description": "Writing code drunkenly.",
        "name": "beers"
      },
      {
        "emoji": "💬",
        "entity": "&#128172;",
        "code": ":speech_balloon:",
        "description": "Updating text and literals.",
        "name": "speech-balloon"
      },
      {
        "emoji": "🗃",
        "entity": "&#128451;",
        "code": ":card_file_box:",
        "description": "Performing database related changes.",
        "name": "card-file-box"
      },
      {
        "emoji": "🔊",
        "entity": "&#128266;",
        "code": ":loud_sound:",
        "description": "Adding logs.",
        "name": "loud-sound"
      },
      {
        "emoji": "🔇",
        "entity": "&#128263;",
        "code": ":mute:",
        "description": "Removing logs.",
        "name": "mute"
      },
      {
        "emoji": "👥",
        "entity": "&#128101;",
        "code": ":busts_in_silhouette:",
        "description": "Adding contributor(s).",
        "name": "busts-in-silhouette"
      },
      {
        "emoji": "🚸",
        "entity": "&#128696;",
        "code": ":children_crossing:",
        "description": "Improving user experience / usability.",
        "name": "children-crossing"
      },
      {
        "emoji": "🏗",
        "entity": "&#1f3d7;",
        "code": ":building_construction:",
        "description": "Making architectural changes.",
        "name": "building-construction"
      },
      {
        "emoji": "📱",
        "entity": "&#128241;",
        "code": ":iphone:",
        "description": "Working on responsive design.",
        "name": "iphone"
      },
      {
        "emoji": "🤡",
        "entity": "&#129313;",
        "code": ":clown_face:",
        "description": "Mocking things.",
        "name": "clown-face"
      },
      {
        "emoji": "🥚",
        "entity": "&#129370;",
        "code": ":egg:",
        "description": "Adding an easter egg.",
        "name": "egg"
      },
      {
        "emoji": "🙈",
        "entity": "&#8bdfe7;",
        "code": ":see_no_evil:",
        "description": "Adding or updating a .gitignore file",
        "name": "see-no-evil"
      },
      {
        "emoji": "📸",
        "entity": "&#128248;",
        "code": ":camera_flash:",
        "description": "Adding or updating snapshots",
        "name": "camera-flash"
      },
      {
        "emoji": "⚗",
        "entity": "&#128248;",
        "code": ":alembic:",
        "description": "Experimenting new things",
        "name": "alembic"
      },
      {
        "emoji": "🔍",
        "entity": "&#128269;",
        "code": ":mag:",
        "description": "Improving SEO",
        "name": "mag"
      },
      {
        "emoji": "☸️",
        "entity": "&#9784;",
        "code": ":wheel_of_dharma:",
        "description": "Work about Kubernetes",
        "name": "wheel-of-dharma"
      },
      {
        "emoji": "🏷️",
        "entity": "&#127991;",
        "code": ":label:",
        "description": "Adding or updating types (Flow, TypeScript)",
        "name": "label"
      },
      {
        "emoji": "🌱",
        "entity": "&#127793;",
        "code": ":seedling:",
        "description": "Adding or updating seed files",
        "name": "seedling"
      },
      {
        "emoji": "🚩",
        "entity": "&#x1F6A9;",
        "code": ":triangular_flag_on_post:",
        "description": "Adding, updating, or removing feature flags",
        "name": "triangular-flag-on-post"
      },
      {
        "emoji": "🥅",
        "entity": "&#x1F945;",
        "code": ":goal_net:",
        "description": "Catching errors",
        "name": "goal-net"
      },
      {
        "emoji": "💫",
        "entity": "&#x1f4ab;",
        "code": ":dizzy:",
        "description": "Adding or updating animations and transitions",
        "name": "animation"
      },
      {
        "emoji": "🗑",
        "entity": "&#x1F5D1;",
        "code": ":wastebasket:",
        "description": "Deprecating code that needs to be cleaned up.",
        "name": "wastebasket"
      }
]