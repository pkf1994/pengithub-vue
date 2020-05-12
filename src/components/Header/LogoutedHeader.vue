<template>
  <Container class="bg-primary">
    <Inner>
      <router-link to="/">
        <svg
          height="32"
          display="block"
          viewBox="0 0 16 16"
          version="1.1"
          width="32"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            fill="white"
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
          />
        </svg>
      </router-link>
      <PanelRight>
        <Button
          :inline="true"
          class="border"
          title="Sign in"
          @click.native="signIn"
          :style="signUpBtnStyle.buttonContainerStyle"
          :titleStyle="signUpBtnStyle.titleStyle"
        />

        <Menu class="d-flex flex-items-center">
          <svg height="24" viewBox="0 0 12 16" version="1.1" width="18" aria-hidden="true" @click="triggerMenu">
            <path
              fill-rule="evenodd"
              fill="white"
              d="M11.41 9H.59C0 9 0 8.59 0 8c0-.59 0-1 .59-1H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zm0-4H.59C0 5 0 4.59 0 4c0-.59 0-1 .59-1H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zM.59 11H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1H.59C0 13 0 12.59 0 12c0-.59 0-1 .59-1z"
            />
          </svg>
        </Menu>
      </PanelRight>
    </Inner>

    <transition name="slide-from-right" appear>
        <HeaderMenu class="header-menu" v-if="showMenu">
            <div class="d-flex flex-justify-end border-bottom bg-gray-light p-3">
                <button
                class="btn-link js-details-target"
                type="button"
                aria-label="Toggle navigation"
                aria-expanded="false"
                >
                <svg
                    height="24"
                    class="octicon octicon-x text-gray"
                    viewBox="0 0 12 16"
                    version="1.1"
                    width="18"
                    aria-hidden="true"
                    @click="triggerMenu"
                >
                    <path
                    fill-rule="evenodd"
                    d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"
                    />
                </svg>
                </button>
            </div>
            <nav class="mt-0 px-3 mb-5">
                <ul class="list-style-none">
                    <li class="position-relative border-bottom d-block" v-for="item in menu" :key="item.title">
                        <div class="d-flex py-3  flex-justify-between" @click="() => triggerDropdownStretch(item.title)">
                            <HyperlinkWrapper v-if="item.href" class="f4" @click="triggerMenu">
                                <a :href="item.href" class="HeaderMenu-link">{{item.title}}</a>
                            </HyperlinkWrapper>
                            <span v-else class="f4">
                                {{item.title}}
                            </span>
                            <svg v-if="item.data" x="0px" y="0px" viewBox="0 0 14 8" xml:space="preserve" fill="none" class="icon-chevon-down-mktg position-absolute">
                            <path d="M1,1l6.2,6L13,1"></path>
                            </svg>
                        </div>

                        <AnimatedHeightWrapper :stretch="stretchingDropdowns.indexOf(item.title) != -1">
                            <Dropdown class="dropdown pt-2 pb-4" v-if="item.data">
                                <div v-for="item_ in item.data" :key="item_.title">
                                    <HyperlinkWrapper v-if="!item_.notOuterLink" @click="triggerMenu">
                                        <a :href="item_.href" class="h5 lh-condensed-ultra py-2 d-block link-gray-dark no-underline">
                                            {{item_.title}}
                                        </a>
                                    </HyperlinkWrapper>
                                    <router-link @click.native="triggerMenu" v-else :to="item_.href" class="h5 lh-condensed-ultra py-2 d-block link-gray-dark no-underline">{{item_.title}}</router-link>  
                                    <ul v-if="item_.data" class="list-style-none pb-3">
                                        <li v-for="item__ in item_.data" :key="item__.title">
                                            <HyperlinkWrapper v-if="!item_.notOuterLink" @click="triggerMenu">
                                                <a :href="item__.href" class="lh-condensed-ultra py-2 d-block link-gray-dark no-underline">{{item__.title}}</a>
                                            </HyperlinkWrapper>
                                            <router-link @click.native="triggerMenu" v-if="item_.notOuterLink" :to="item__.href" class="lh-condensed-ultra py-2 d-block link-gray-dark no-underline">{{item__.title}}</router-link>
                                        </li>
                                    </ul>
                                </div> 
                            </Dropdown>
                        </AnimatedHeightWrapper>
                    </li>  
                </ul>
            </nav>
            
            <div class="px-3 d-flex flex-justify-center">
                <a :href="oauthUrl" class="f4 HeaderMenu-link d-inline-block no-underline border border-gray-dark rounded-1 px-2 py-1">Sign in</a>
            </div> 
        </HeaderMenu>
    </transition>

    
  </Container>
</template>

<script>
import Button from "../Button";
import styled from "vue-styled-components";
import HyperlinkWrapper from "../HyperlinkWrapper.vue";
import {AnimatedHeightWrapper} from '../AnimatedSizeWrapper'
import {API_OAUTH2} from '@/network/api'
export default {
  data() {
    return {
      oauthAuthorizeSite: API_OAUTH2,
      signUpBtnStyle: {
        buttonContainerStyle: {
          padding: "4px",
          paddingRight: "8px",
          paddingLeft: "8px",
          background: "transparent",
          borderColor: "white",
          marginRight: "16px",
          borderRadius: "6px"
        },
        titleStyle: {
          fontSize: "14px",
          lineHeight: "21px",
          color: "white"
        }
      },
      oauthUrl: API_OAUTH2,
      stretchingDropdowns: [],
      showMenu: false,
      menu: [
        {
          title: "Why GitHub?",
          data: [
            {
              title: "Features",
              href: "https://github.com/features",
              data: [
                {
                  title: "Code review",
                  href: "https://github.com/features/code-review/"
                },
                {
                  title: "Project management",
                  href: "https://github.com/features/project-management/"
                },
                {
                  title: "Integrations",
                  href: "https://github.com/features/integrations"
                },
                {
                  title: "Actions",
                  href: "https://github.com/features/actions"
                },
                {
                  title: "Packages",
                  href: "https://github.com/features/packages"
                },
                {
                  title: "Security",
                  href: "https://github.com/features/security"
                },
                {
                  title: "Team management",
                  href: "https://github.com/features#team-management"
                },
                {
                  title: "Hosting",
                  href: "https://github.com/features#hosting"
                }
              ]
            },
            {
              title: "Customer stories",
              href: "https://github.com/customer-stories"
            },
            {
              title: "Security",
              href: "https://github.com/security"
            }
          ]
        },
        {
          title: "Team",
          href: "https://github.com/team"
        },
        {
          title: "Enterprise",
          href: "https://github.com/enterprise"
        },
        {
            title: "Explore",
            data: [
                {
                    title:'Explore Github',
                    href: '/explore',
                    notOuterLink: true,
                    data: [
                        {
                            title: 'Topics',
                            href: '/explore/topics',
                            notOuterLink: true
                        },
                        {
                            title: 'Collections',
                            href: '/explore/collections',
                            notOuterLink: true
                        },
                        {
                            title: 'Trending',
                            href: '/explore/trending',
                            notOuterLink: true
                        },
                        {
                            title: 'Learning Lab',
                            href: 'https://lab.github.com/'
                        },
                        {
                            title: 'Open source guides',
                            href: 'https://opensource.guide/'
                        },
                        {
                            title: 'Events',
                            href: 'https://github.com/events'
                        },
                        {
                            title: 'Community forum',
                            href: 'https://github.community/'
                        },
                        {
                            title: 'Github Education',
                            href: 'https://education.github.com/'
                        },
                    ]
                }
            ]
        },
        {
            title: 'Marketplace',
            href: 'https://github.com/marketplace'
        },
        {
            title: "Pricing",
            data: [
                {
                    title: 'Plans',
                    href: "https://github.com/pricing",
                    data: [
                       { 
                           title: 'Compare plans',
                            href: 'https://github.com/pricing#feature-comparison'
                        },
                        {
                            title: 'Contact Sales',
                            href: 'https://enterprise.github.com/contact'
                        }
                    ]
                },
                {
                    title: 'Nonprofit',
                    href: 'https://github.com/nonprofit'
                },
                {
                    title: 'Education',
                    href: 'https://education.github.com/'
                },
            ]
        }
      ]
    };
  },
  methods: {
    /* requestUserIdentity() {
      window.location.href = API_OAUTH2;
    }, */
    triggerDropdownStretch(payload) {
        if(!this.stretchingDropdowns.some(i => i == payload)){
            this.stretchingDropdowns.push(payload)
        }else{
            let idx = this.stretchingDropdowns.indexOf(payload)
            this.stretchingDropdowns.splice(idx,1)
        }
    },
    triggerMenu() {
        this.showMenu = !this.showMenu
    }
  },
  components: {
    HyperlinkWrapper,
    AnimatedHeightWrapper,
    Button,
    Container: styled.div`
      padding-top: 8px;
      padding-bottom: 8px;
      padding-right: 16px;
      padding-left: 16px;
    `,
    Inner: styled.div`
      display: flex;
      justify-content: space-between;
      align-items: center;
    `,
    Logo: styled.a`
      align-self: stretch;
    `,
    PanelRight: styled.div`
      display: flex;
      align-items: center;
    `,
    Menu: styled.button`
      outline: none;
      background: transparent;
      border-width: 0;
      padding-right: 0;
      padding-left: 0;
    `,
    HeaderMenu: styled.div``,
    Dropdown: styled.div``,
  }
};
</script>

<style scoped>
.header-menu {
  position: fixed;
  top: 0px;
  bottom: 0px;
  right: 0px;
  z-index: 100;
  width: 300px;
  overflow: auto;
  background-color: #fff;
  box-shadow: 0 10px 50px rgba(27, 31, 35, 0.15);
  transition: all .4s ease;
}

.HeaderMenu-link {
    color: #444d56;
    background: transparent;
}

.icon-chevon-down-mktg{
    top: 24px;
    right: 0;
    width: 14px;
    stroke: #24292e;
    transition: stroke .4s;
}

.dropdown{

}

.slide-from-right-enter,
.slide-from-right-leave-to{
    transform: translateX(100%);
}


</style>