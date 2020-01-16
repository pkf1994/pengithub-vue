
export default {
    anaylseCodeLanguageByExtensions:function(fileName) {
        let fileTypeAndColor
        let indexOfLastDot = fileName.lastIndexOf(".")
        if(indexOfLastDot !== -1) {
            let extensions = fileName.substring(indexOfLastDot)
            try{
                LANGUAGE_LIST.forEach(item => {
                    if(item.extensions.indexOf(extensions) !== -1) {
                        fileTypeAndColor = {
                            type: item.name,
                            color: item.color || "#ccc"
                        }
                        throw new Error("forEach ending")
                    }
                })
            }catch(e) {
                if(e.message !== "forEach ending") {
                    throw e
                }
            }
        }
        return fileTypeAndColor || {
            type: 'Unknow',
            color: '#ccc'
        }
    },

    analyseContentTypeByFileName:function(fileName) {
        let contentType
        let extensions
        let indexOfLastDot = fileName.lastIndexOf(".")
        
        if(indexOfLastDot !== -1 && indexOfLastDot !== 0) {
            extensions = fileName.substring(indexOfLastDot)
            try{
                IMG_EXTENSIONS_LIST.forEach(item => {
                    if(item === extensions) {
                        contentType = 'image'
                        throw new Error("forEach ending")
                    }
                })
            }catch(e) {
                if(contentType) return contentType
                if(e.message !== "forEach ending") {
                    throw e
                }
            }
           
            try{
                VIDEA_EXTENSIONS_LIST.forEach(item => {
                    if(item === extensions) {
                        contentType = 'videa'
                        throw new Error("forEach ending")
                    }
                })
            }catch(e) {
                if(contentType) return contentType
                if(e.message !== "forEach ending") {
                    throw e
                }
            }
            
            try{
                AUDIO_EXTENSIONS_LIST.forEach(item => {
                    if(item === extensions) {
                        contentType = 'audio'
                        throw new Error("forEach ending")
                    }
                })
            }catch(e) {
                if(contentType) return contentType
                if(e.message !== "forEach ending") {
                    throw e
                }
            }
            try{
                BOOK_EXTENSIONS_LIST.forEach(item => {
                    if(item === extensions) {
                        contentType = 'book'
                        throw new Error("forEach ending")
                    }
                })
            }catch(e){
                if(contentType) return contentType
                if(e.message !== "forEach ending") {
                    throw e
                }
            }
            try{
                ZIP_EXTENSIONS_LIST.forEach(item => {
                    if(item === extensions) {
                        contentType = 'zip'
                        throw new Error("forEach ending")
                    }
                })
            }catch(e) {
                if(contentType) return contentType
                if(e.message !== "forEach ending") {
                    throw e
                }
            }
            try{
                BINARY_EXTENSIONS_LIST.forEach(item => {
                    if(item === extensions) {
                        contentType = 'binary'
                        throw new Error("forEach ending")
                    }
                })
            }catch(e) {
                if(contentType) return contentType
                if(e.message !== "forEach ending") {
                    throw e
                }
            }
        }

        BINARY_FILENAME_LIST.forEach(item => {
            if(item === fileName) {
                contentType = 'binary'
            }
        })

        return contentType || 'file'
    },
}

export const PROGRAMMING_LIST = [
    { 
        type: 'programming',  
        name: "ActionScript",
        extensions: [".as"],
        color: "#882B0F"
    },
    { 
        type: 'programming',  
        name: "C",
        extensions: [".c",".cats",".h",".idc"],
        color: "#555555"
    },
    { 
        type: 'programming',  
        name: "C#",
        extensions: [".cs",".cake",".csx"],
        color: "#178600"
    },
    { 
        type: 'programming',  
        name: "C++",
        extensions:[
            ".cpp",
            ".c++",
            ".cc",
            ".cp",
            ".cxx",
            ".h",
            ".h++",
            ".hh",
            ".hpp",
            ".hxx",
            ".inc",
            ".inl",
            ".ino",
            ".ipp",
            ".re",
            ".tcc",
            ".tpp"
        ],
        color: "#f34b7d"
    },
    { 
        type: 'programming',  
        name: "Clojure",
        extensions: [
            ".clj",
            ".boot",
            ".cl2",
            ".cljc",
            ".cljs",
            ".cljs.hl",
            ".cljscm",
            ".cljx",
            ".hic"
        ],
        color: "#db5855"
    },
    { 
        type: 'programming',  
        name: "CoffeeScript",
        extensions: [".rg"],
        color: "#cc0088"
    },
    { 
        type: 'programming',  
        name: "CSS",
        extensions: [
            ".css",
            ".scss"
        ],
        color: "#563d7c"
    },
    { 
        type: 'programming',  
        name: "Go",
        extensions: [
            ".go",
        ],
        color: "#00ADD8"
    },
    { 
        type: 'programming',  
        name: "Haskell",
        extensions: [
            ".hs",
            ".hs-boot",
            ".hsc"
        ],
        color: "#5e5086"
    },
    { 
        type: 'programming',  
        name: "HTML",
        extensions: [
            ".html",
            ".htm",
            ".html.hl",
            ".inc",
            ".st",
            ".xht",
            ".xhtml"
        ],
        color: "#e34c26"
    },
    { 
        type: 'programming',  
        name: "Java",
        extensions: [
            ".java"
        ],
        color: "#b07219"
    },
    { 
        type: 'programming',  
        name: "JavaScript",
        extensions: [
            ".js",
            "._js",
            ".bones",
            ".cjs",
            ".es",
            ".es6",
            ".frag",
            ".gs",
            ".jake",
            ".jsb",
            ".jscad",
            ".jsfl",
            ".jsm",
            ".jss",
            ".mjs",
            ".njs",
            ".pac",
            ".sjs",
            ".ssjs",
            ".xsjs",
            ".xsjslib"
        ],
        color: "#f1e05a"
    },
    { 
        type: 'programming',  
        name: "Lua",
        extensions: [
            ".lua",
            ".fcgi",
            ".nse",
            ".p8",
            ".pd_lua",
            ".rbxs",
            ".wlua"
        ],
        color: "#000080"
    },
    { 
        type: 'programming',  
        name: "MATLAB",
        extensions: [
            ".matlab",
            ".m"
        ],
        color: "#e16737"
    },
    { 
        type: 'programming',  
        name: "Objective-C",
        extensions: [
            ".m",
            ".h"
        ],
        color: "#438eff"
    },
    { 
        type: 'programming',  
        name: "Perl",
        extensions: [
            ".pl",
            ".al",
            ".cgi",
            ".fcgi",
            ".perl",
            ".ph",
            ".plx",
            ".pm",
            ".psgi",
            ".t"
        ],
        color: "#0298c3"
    },
    { 
        type: 'programming',  
        name: "PHP",
        extensions: [
            ".php",
            ".aw",
            ".ctp",
            ".fcgi",
            ".inc",
            ".php3",
            ".php4",
            ".php5",
            ".phps",
            ".phpt"
        ],
        color: "#4F5D95"
    },
    { 
        type: 'programming',  
        name: "Python",
        extensions: [
            ".py",
            ".bzl",
            ".cgi",
            ".fcgi",
            ".gyp",
            ".gypi",
            ".lmi",
            ".py3",
            ".pyde",
            ".pyi",
            ".pyp",
            ".pyt",
            ".pyw",
            ".rpy",
            ".spec",
            ".tac",
            ".wsgi",
            ".xpy"
        ],
        color: "#3572A5"
    },
    { 
        type: 'programming',  
        name: "R",
        extensions: [
            ".r",
            ".rd",
            ".rsx"
        ],
        color: "#198CE7"
    },
    { 
        type: 'programming',  
        name: "Ruby",
        extensions: [
            ".rb",
            ".builder",
            ".eye",
            ".fcgi",
            ".gemspec",
            ".god",
            ".jbuilder",
            ".mspec",
            ".pluginspec",
            ".podspec",
            ".rabl",
            ".rake",
            ".rbi",
            ".rbuild",
            ".rbw",
            ".rbx",
            ".ru",
            ".ruby",
            ".spec",
            ".thor",
            ".watchr"
        ],
        color: "#701516"
    },
    { 
        type: 'programming',  
        name: "Scala",
        extensions: [
            ".scala",
            ".kojo",
            ".sbt",
            ".sc"
        ],
        color: "#c22d40"
    },
    { 
        type: 'programming',  
        name: "Shell",
        extensions: [
            ".sh",
            ".bash",
            ".bats",
            ".cgi",
            ".command",
            ".fcgi",
            ".ksh",
            ".sh.in",
            ".tmux",
            ".tool",
            ".zsh"
        ],
        color: "#89e051"
    },
    { 
        type: 'programming',  
        name: "Swift",
        extensions: [
            ".swift"
        ],
        color: "#ffac45"
    },
    { 
        type: 'programming',  
        name: "TeX",
        extensions: [
            ".tex",
            ".aux",
            ".bbx",
            ".cbx",
            ".cls",
            ".dtx",
            ".ins",
            ".lbx",
            ".ltx",
            ".mkii",
            ".mkiv",
            ".mkvi",
            ".sty",
            ".toc"
        ],
        color: "#3D6117"
    },
    { 
        type: 'programming',  
        name: "Vim script",
        extensions: [
            ".vim",
            ".vba",
            ".vmb"
        ],
        color: "#199f4b"
    },
    { 
        type: 'programming',  
        name: "Vue",
        extensions: [
            ".vue"
        ],
        color: "#2c3e50"
    },
    { 
        type: 'programming',  
        name: "TypeScript",
        extensions: [
            ".ts"
        ],
        color: "#2b7489"
    },
]

export const PROSE_LIST = [
    { 
        type: 'prose',  
        name: "Text",
        extensions: [
            ".txt",
            ".fr",
            ".nb",
            ".ncl",
            ".no"
        ]
    },
    { 
        type: 'prose',  
        name: "Markdown",
        extensions: [
            ".md",
            ".markdown",
            ".mdown",
            ".mdwn",
            ".mdx",
            ".mkd",
            ".mkdn",
            ".mkdown",
            ".ronn",
            ".workbook"
        ]
    }
]

export const DATA_LIST = [
    { 
        type: 'data',
        name: "INI",
        extensions: [
            ".ini",
            ".cfg",
            ".lektorproject",
            ".prefs",
            ".pro",
            ".properties"
        ]
    },
    { 
        type: 'data',
        name: "JSON",
        extensions: [
            ".json",
            ".avsc",
            ".geojson",
            ".gltf",
            ".har",
            ".ice",
            ".JSON-tmname",
            ".jsonl",
            ".mcmeta",
            ".tfstate",
            ".tfstate.backup",
            ".topojson",
            ".webapp",
            ".webmanifest",
            ".yy",
            ".yyp"
        ]
    },
    { 
        type: 'data',
        name: "XML",
        extensions: [
            ".xml",
            ".adml",
            ".admx",
            ".ant",
            ".axml",
            ".builds",
            ".ccproj",
            ".ccxml",
            ".clixml",
            ".cproject",
            ".cscfg",
            ".csdef",
            ".csl",
            ".csproj",
            ".ct",
            ".depproj",
            ".dita",
            ".ditamap",
            ".ditaval",
            ".dll.config",
            ".dotsettings",
            ".filters",
            ".fsproj",
            ".fxml",
            ".glade",
            ".gml",
            ".gmx",
            ".grxml",
            ".iml",
            ".ivy",
            ".jelly",
            ".jsproj",
            ".kml",
            ".launch",
            ".mdpolicy",
            ".mjml",
            ".mm",
            ".mod",
            ".mxml",
            ".natvis",
            ".ncl",
            ".ndproj",
            ".nproj",
            ".nuspec",
            ".odd",
            ".osm",
            ".pkgproj",
            ".pluginspec",
            ".proj",
            ".props",
            ".ps1xml",
            ".psc1",
            ".pt",
            ".rdf",
            ".resx",
            ".rss",
            ".sch",
            ".scxml",
            ".sfproj",
            ".shproj",
            ".srdf",
            ".storyboard",
            ".sublime-snippet",
            ".targets",
            ".tml",
            ".ts",
            ".tsx",
            ".ui",
            ".urdf",
            ".ux",
            ".vbproj",
            ".vcxproj",
            ".vsixmanifest",
            ".vssettings",
            ".vstemplate",
            ".vxml",
            ".wixproj",
            ".workflow",
            ".wsdl",
            ".wsf",
            ".wxi",
            ".wxl",
            ".wxs",
            ".x3d",
            ".xacro",
            ".xaml",
            ".xib",
            ".xlf",
            ".xliff",
            ".xmi",
            ".xml.dist",
            ".xproj",
            ".xsd",
            ".xspec",
            ".xul",
            ".zcml"
        ]
    }
]

export const LANGUAGE_LIST = [
    ...PROGRAMMING_LIST,
    ...PROSE_LIST,
    ...DATA_LIST
]

export const BINARY_EXTENSIONS_LIST = [
    ".abnf",
    ".asn",
    ".asn1",
    ".afm",
    ".OutJob",
    ".PcbDoc",
    ".PrjPCB",
    ".SchDoc",
    ".apacheconf",
    - ".vhost",
    ".c-objdump",
    ".dae",
    ".cson",
    ".csv",
    ".cabal",
    ".conllu",
    ".conll",
    ".cppobjdump",
    ".c++-objdump",
    ".c++objdump",
    ".cpp-objdump",
    ".cxx-objdump",
    ".d-objdump",
    ".zone",
    ".arpa",
    ".darcspatch",
    ".dpatch",
    ".diff",
    ".patch",
    ".x",
    ".ebnf",
    ".eml",
    ".mbox",
    ".sch",
    ".brd",
    ".eb",
    ".epj",
    ".edc",
    ".flf",
    ".for",
    ".eam.fs",
    ".gn",
    ".gni",
    ".gbr",
    ".gbl",
    ".gbo",
    ".gbp",
    ".gbs",
    ".gko",
    ".gml",
    ".gpb",
    ".gpt",
    ".gtl",
    ".gto",
    ".gtp",
    ".gts",
    ".gitconfig",
    ".bdf",
    ".gradle",
    ".gml",
    ".graphql",
    ".gql",
    ".graphqls",
    ".dot",
    ".gv",
    ".cfg",
    ".http",
    ".hxml",
    ".ini",
    ".cfg",
    ".lektorproject",
    ".prefs",
    ".pro",
    ".properties",
    ".irclog",
    ".weechatlog",
    ".gitignore",
    ".json",
    ".avsc",
    ".geojson",
    ".gltf",
    ".har",
    ".ice",
    ".JSON-tmLanguage",
    ".jsonl",
    ".mcmeta",
    ".tfstate",
    ".tfstate.backup",
    ".topojson",
    ".webapp",
    ".webmanifest",
    ".yy",
    ".yyp",
    ".sublime-build",
    ".sublime-commands",
    ".sublime-completions",
    ".sublime-keymap",
    ".sublime-macro",
    ".sublime-menu",
    ".sublime-mousemap",
    ".sublime-project",
    ".sublime-settings",
    ".sublime-theme",
    ".sublime-workspace",
    ".sublime_metrics",
    ".sublime_session",
    ".json5",
    ".jsonld",
    ".properties",
    ".kicad_pcb",
    ".kicad_mod",
    ".kicad_wks",
    ".brd",
    ".sch",
    ".asy",
    ".ld",
    ".lds",
    ".x",
    ".mod",
    ".dsp",
    ".nl",
    ".nginxconf",
    ".vhost",
    ".ninja",
    ".objdump",
    ".plist",
    ".fea",
    ".pkl",
    ".prisma",
    ".pro",
    ".proto",
    ".asc",
    ".pub",
    ".pd",
    ".pytb",
    ".spec",
    ".raw",
    ".regexp",
    ".regex",
    ".sparql",
    ".rq",
    ".sql",
    ".cql",
    ".ddl",
    ".inc",
    ".mysql",
    ".prc",
    ".tab",
    ".udf",
    ".viw",
    ".ston",
    ".svg",
    ".sfd",
    ".srt",
    ".toml",
    ".ttl",
    ".tl",
    ".anim",
    ".asset",
    ".mask",
    ".mat",
    ".meta",
    ".prefab",
    ".unity",
    ".mtl",
    ".obj",
    ".owl",
    ".vtt",
    ".reg",
    ".toc",
    ".xbm",
    ".xpm",
    ".pm",
    ".xml",
    ".adml",
    ".admx",
    ".ant",
    ".axml",
    ".builds",
    ".ccproj",
    ".ccxml",
    ".clixml",
    ".cproject",
    ".cscfg",
    ".csdef",
    ".csl",
    ".csproj",
    ".ct",
    ".depproj",
    ".dita",
    ".ditamap",
    ".ditaval",
    ".dll.config",
    ".dotsettings",
    ".filters",
    ".fsproj",
    ".fxml",
    ".glade",
    ".gml",
    ".gmx",
    ".grxml",
    ".iml",
    ".ivy",
    ".jelly",
    ".jsproj",
    ".kml",
    ".launch",
    ".mdpolicy",
    ".mjml",
    ".mm",
    ".mod",
    ".mxml",
    ".natvis",
    ".ncl",
    ".ndproj",
    ".nproj",
    ".nuspec",
    ".odd",
    ".osm",
    ".pkgproj",
    ".pluginspec",
    ".proj",
    ".props",
    ".ps1xml",
    ".psc1",
    ".pt",
    ".rdf",
    ".resx",
    ".rss",
    ".sch",
    ".scxml",
    ".sfproj",
    ".shproj",
    ".srdf",
    ".storyboard",
    ".sublime-snippet",
    ".targets",
    ".tml",
    ".ts",
    ".tsx",
    ".ui",
    ".urdf",
    ".ux",
    ".vbproj",
    ".vcxproj",
    ".vsixmanifest",
    ".vssettings",
    ".vstemplate",
    ".vxml",
    ".wixproj",
    ".workflow",
    ".wsdl",
    ".wsf",
    ".wxi",
    ".wxl",
    ".wxs",
    ".x3d",
    ".xacro",
    ".xaml",
    ".xib",
    ".xlf",
    ".xliff",
    ".xmi",
    ".xml.dist",
    ".xproj",
    ".xsd",
    ".xspec",
    ".xul",
    ".zcml",
    ".plist",
    ".stTheme",
    ".tmCommand",
    ".tmLanguage",
    ".tmPreferences",
    ".tmSnippet",
    ".tmTheme",
    ".xsp-config",
    ".xsp.metadata",
    ".yml",
    ".mir",
    ".reek",
    ".rviz",
    ".sublime-syntax",
    ".syntax",
    ".yaml",
    ".yaml-tmlanguage",
    ".yaml.sed",
    ".yml.mysql",
    ".yang",
    ".desktop",
    ".desktop.in",
    ".dircolors",
    ".edn",
    ".nanorc",
]

export const BINARY_FILENAME_LIST = [
    "ant.xml",
    "build.xml",
    ".htaccess",
    "apache2.conf",
    "httpd.conf",
    "cabal.config",
    "cabal.project",
    "firestore.rules",
    ".editorconfig",
    ".gn",
    ".gitattributes",
    ".gitconfig",
    ".gitmodules",
    "haproxy.cfg",
    "buildozer.spec",
    ".atomignore",
    ".babelignore",
    ".bzrignore",
    ".coffeelintignore",
    ".cvsignore",
    ".dockerignore",
    ".eslintignore",
    ".gitignore",
    ".nodemonignore",
    ".npmignore",
    ".prettierignore",
    ".stylelintignore",
    ".vscodeignore",
    "gitignore-global",
    "gitignore_global",
    ".arcconfig",
    ".htmlhintrc",
    ".tern-config",
    ".tern-project",
    ".watchmanconfig",
    "composer.lock",
    "mcmod.info",
    ".babelrc",
    ".eslintrc.json",
    ".jscsrc",
    ".jshintrc",
    ".jslintrc",
    "jsconfig.json",
    "language-configuration.json",
    "tsconfig.json",
    "fp-lib-table",
    "ld.script",
    "pom.xml",
    ".npmrc",
    "nginx.conf",
    ".inputrc",
    "inputrc",
    "ssh-config",
    "ssh_config",
    "sshconfig",
    "sshconfig.snip",
    "sshd-config",
    "sshd_config",
    "Cargo.lock",
    "Gopkg.lock",
    ".wgetrc",
    "encodings.dir",
    "fonts.alias",
    "fonts.dir",
    "fonts.scale",
    ".XCompose",
    "XCompose",
    "xcompose",
    ".classpath",
    ".cproject",
    ".project",
    "App.config",
    "NuGet.config",
    "Settings.StyleCop",
    "Web.Debug.config",
    "Web.Release.config",
    "Web.config",
    "packages.config",
    ".clang-format",
    ".clang-tidy",
    ".gemrc",
    "glide.lock",
    ".curlrc",
    "_curlrc",
    ".dir_colors",
    ".dircolors",
    "DIR_COLORS",
    "_dir_colors",
    "_dircolors",
    " dir_colors",
    ".nanorc",
    "nanorc",
]

export const IMG_EXTENSIONS_LIST = [
    ".bmp",
    ".jpeg",
    ".png",
    ".tiff",
    ".gif",
    ".pcx",
    ".TGA",
    ".exif",
    ".FPX",
    ".psd"
]

export const VIDEA_EXTENSIONS_LIST = [
    ".mpg",
    ".mpeg",
    ".avi",
    ".rm",
    ".rms",
    ".rmx",
    ".rv",
    ".rvx",
    ".rmvb",
    ".mov",
    ".wmv",
    ".asf",
    ".dat",
    ".asx",
    ".wvx",
    ".mpe",
    ".mpa",
]

export const AUDIO_EXTENSIONS_LIST = [
    ".mp3",
    ".wma",
    ".wav",
    ".mid",
    ".ape",
    ".flac",
    ".aac",
    ".ra",
    ".rax",
    ".ram",
    ".ogg",
    ".aiff",
]

export const ZIP_EXTENSIONS_LIST = [
    '.rar',
    '.zip',
    '.7z',
    '.iso',
    '.tar',
    '.jar',
    '.gz',
]

export const BOOK_EXTENSIONS_LIST = [
    ".md",
    ".markdown",
    ".mdown",
    ".mdwn",
    ".mdx",
    ".mkd",
    ".mkdn",
    ".mkdown",
    ".ronn",
    ".workbook"
]