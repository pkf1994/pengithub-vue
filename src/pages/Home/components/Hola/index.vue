<template>
    <Container>
        <LogoutedHeader/>
        <Main>
            <HolaJumbotron class="py-6 px-3 bg-sub-primary flex-column-center">
                <HolaJumbotronTitle class="h0-mktg font-inter text-white text-center mb-3 lh-1">
                    Built for developers
                </HolaJumbotronTitle>
                <HolaJumbotronParagraph class="font-inter f2-mktg mb-4 text-hsla-pale text-center">
                    GitHub is a development
                    platform inspired by the
                    way you work. From
                    <a href="/open-source" class="text-white link">open source</a>
                    to
                    <a href="/business" class="text-white link">business</a>, you can host and review
                    code, manage projects, and
                    build software alongside 40
                    million&nbsp;developers.
                </HolaJumbotronParagraph>
                <Button inline
                        style="padding-bottom: 20px;padding-top: 20px"
                        class="px-5 bg-btn-primary-green round-1 w-500 f4 text-white">
                    Sign in for GitHub
                </Button>
            </HolaJumbotron>

            <EnterpriseMktg class="pt-7 pb-6 px-3">
                <EnterpriseMktgInner class="enterprise-mktg-inner bg-white enterprise-mktg p-4 pt-6 box-shadow-large round-2">
                    <EnterpriseMktgTitle class="h2-mktg mb-3 font-inter text-center lh-125">
                        Get started with GitHub&nbsp;Enterprise
                    </EnterpriseMktgTitle>
                    <EnterpriseMktgParagraph class="text-gray f3-mktg text-center mb-3">
                        Take collaboration to the next level with
                        security and administrative features built for&nbsp;teams.
                    </EnterpriseMktgParagraph>

                    <EnterpriseMktgItem class="enterprise-mktg-item">
                        <EnterpriseMktgItemIcon class="mb-2" >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67 59.56" height="50" width="50"><path d="M56 42a1 1 0 1 1 0-2 9 9 0 0 0 0-18h-1v-1A11.47 11.47 0 0 0 43.5 9.5a10.68 10.68 0 0 0-3.84.73l-.85.33-.4-.82A13.72 13.72 0 0 0 26.01 2a14 14 0 0 0-14 14v1l-.79.17a11.56 11.56 0 0 0-2.54 21.82 1 1 0 1 1-.84 1.81 13.56 13.56 0 0 1 2.13-25.4A16 16 0 0 1 26 0a15.7 15.7 0 0 1 13.78 8.11 12.49 12.49 0 0 1 3.71-.57 13.42 13.42 0 0 1 13.47 12.5A11 11 0 0 1 56 42z" fill="#79b8ff"></path><circle cx="20.2" cy="32" r="1.7" fill="#2088ff"></circle><circle cx="20.2" cy="42.5" r="1.7" fill="#2088ff"></circle><circle cx="20.2" cy="53.1" r="1.7" fill="#2088ff"></circle><path fill="#2088ff" d="M14.6 36.2h35.7v2H14.6zm0 10.6h35.7v2H14.6z"></path><path d="M40.59 19.3h-.13a1 1 0 0 1-.87-1.12 18.48 18.48 0 0 0 .19-2.38 13.73 13.73 0 0 0-1.59-6.44A13.91 13.91 0 0 0 25.89 2a1 1 0 0 1 0-2 15.9 15.9 0 0 1 14.08 8.43 15.72 15.72 0 0 1 1.82 7.37 20.29 20.29 0 0 1-.21 2.62 1 1 0 0 1-.99.88z" fill="#79b8ff"></path><path d="M48.3 59.56H16.6a3 3 0 0 1-3-3V28.49a3 3 0 0 1 3-3h31.7a3 3 0 0 1 3 3v28.07a3 3 0 0 1-3 3zM16.6 27.49a1 1 0 0 0-1 1v28.07a1 1 0 0 0 1 1h31.7a1 1 0 0 0 1-1V28.49a1 1 0 0 0-1-1H16.6z" fill="#2088ff"></path></svg>
                        </EnterpriseMktgItemIcon>
                        <EnterpriseMktgItemTitle class="h4-mktg font-inter">
                            Enterprise Cloud
                        </EnterpriseMktgItemTitle>
                        <EnterpriseMktgItemSubTitle class="enterprise-mktg-sub-title f5 text-gray">
                            Leave the hosting to us.
                        </EnterpriseMktgItemSubTitle>

                        <Button class="btn-primary-mktg-blue py-3 px-4 mb-1 mt-2 f5 w-500"
                                inline>
                            Try Cloud for free
                        </Button>
                    </EnterpriseMktgItem>

                    <EnterpriseMktgItem class="enterprise-mktg-item">
                        <EnterpriseMktgItemIcon class="mb-2" >
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="none"><path d="M44.571 4.286a.857.857 0 0 0-1.31-.728c-8.724 5.433-13.348 8.324-13.772 8.63-1.152.833-1.9 1.876-2.046 3.142a.857.857 0 1 0 1.703.197c.076-.654.46-1.308 1.348-1.95h.002c.326-.238 4.423-2.803 12.361-7.748v37.028H39.43v-1.714a.857.857 0 0 0-.858-.857h-4.285a.857.857 0 0 0-.857.857v2.571a.857.857 0 1 0 1.714 0V42h2.571v1.714c0 .474.384.858.857.858h5.143a.857.857 0 0 0 .857-.858V4.286zM11.759 26.824a.857.857 0 0 0-1.214-.001L4.19 33.179a2.542 2.542 0 0 0-.76 1.818V42A2.576 2.576 0 0 0 6 44.572h3.429a.857.857 0 0 0 .857-.858V42H12v1.714a.857.857 0 0 0 1.714 0v-2.571a.857.857 0 0 0-.857-.857H9.43a.857.857 0 0 0-.858.857v1.714H6A.862.862 0 0 1 5.143 42v-7.003c0-.228.09-.442.246-.594l.009-.008 5.752-5.753 1.134 1.14a.857.857 0 1 0 1.215-1.21l-1.74-1.748z" fill="#79B8FF"></path><path d="M33.437 23.443c0-.473.384-.857.857-.857h4.286a.857.857 0 0 1 0 1.714h-4.286a.857.857 0 0 1-.857-.857zM34.294 19.157a.857.857 0 1 0 0 1.715h4.286a.857.857 0 1 0 0-1.715h-4.286z" fill="#79B8FF"></path><path d="M17.036 5.22c2.514-.332 4.377.488 5.69 1.547 1.337 1.08 2.088 2.4 2.308 2.97a.857.857 0 0 0 1.442.258c.616-.696 1.553-1.554 2.852-1.4.442.052.81.173 1.12.35a.857.857 0 1 0 .85-1.489 4.622 4.622 0 0 0-1.768-.564c-1.513-.179-2.674.457-3.466 1.111a10.255 10.255 0 0 0-2.262-2.57c-1.617-1.305-3.94-2.315-6.99-1.913-2.954.39-4.939 2.111-6.162 3.68a12.492 12.492 0 0 0-1.51 2.5h-.693a5.008 5.008 0 1 0 0 10.017h4.42a.857.857 0 0 0 0-1.715h-4.42a3.294 3.294 0 0 1 0-6.587h1.268c.365 0 .69-.232.81-.577l.002-.006.004-.01.009-.025a9.07 9.07 0 0 1 .322-.727c.241-.487.615-1.143 1.14-1.817 1.053-1.35 2.673-2.722 5.034-3.033zM18.862 21.858c0-.473.384-.857.857-.857h2.565a.857.857 0 1 1 0 1.714H19.72a.857.857 0 0 1-.857-.857zM28.286 21.881a.857.857 0 1 1-1.715 0 .857.857 0 0 1 1.715 0zM18.862 31.287c0-.473.384-.857.857-.857h2.565a.857.857 0 0 1 0 1.714H19.72a.857.857 0 0 1-.857-.857zM28.286 31.31a.857.857 0 1 1-1.714 0 .857.857 0 0 1 1.714 0zM18.862 40.715c0-.473.384-.857.857-.857h2.565a.857.857 0 0 1 0 1.715H19.72a.857.857 0 0 1-.857-.858zM28.286 40.739a.857.857 0 1 1-1.715 0 .857.857 0 0 1 1.715 0z" fill="#2188FF"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M18 18a2.571 2.571 0 0 0-2.571 2.571v2.572A2.571 2.571 0 0 0 18 25.714h.857v1.715H18A2.571 2.571 0 0 0 15.429 30v2.571A2.571 2.571 0 0 0 18 35.143h.857v1.714H18a2.571 2.571 0 0 0-2.571 2.572V42A2.571 2.571 0 0 0 18 44.571h11.143A2.571 2.571 0 0 0 31.714 42v-2.571a2.571 2.571 0 0 0-2.571-2.572h-.857v-1.714h.857a2.571 2.571 0 0 0 2.571-2.572V30a2.571 2.571 0 0 0-2.571-2.571h-.857v-1.715h.857a2.571 2.571 0 0 0 2.571-2.571V20.57A2.571 2.571 0 0 0 29.143 18H18zm8.571 17.143h-6v1.714h6v-1.714zm0-9.429h-6v1.715h6v-1.715zm-9.428-5.143c0-.473.384-.857.857-.857h11.143c.473 0 .857.384.857.857v2.572a.857.857 0 0 1-.857.857H18a.857.857 0 0 1-.857-.857V20.57zm0 9.429c0-.473.384-.857.857-.857h11.143c.473 0 .857.384.857.857v2.571a.857.857 0 0 1-.857.858H18a.857.857 0 0 1-.857-.858V30zM18 38.571a.857.857 0 0 0-.857.858V42c0 .473.384.857.857.857h11.143A.857.857 0 0 0 30 42v-2.571a.857.857 0 0 0-.857-.858H18z" fill="#2188FF"></path></svg>
                        </EnterpriseMktgItemIcon>
                        <EnterpriseMktgItemTitle class="h4-mktg font-inter">
                            Enterprise Server
                        </EnterpriseMktgItemTitle>
                        <EnterpriseMktgItemSubTitle class="enterprise-mktg-sub-title f5 text-gray">
                            Deploy to your environment.
                        </EnterpriseMktgItemSubTitle>

                        <Button class="btn-primary-mktg-blue py-3 px-4 mb-1 mt-2 f5 w-500"
                                inline>
                            Try Server for free
                        </Button>
                    </EnterpriseMktgItem>

                    <EnterpriseMktgItem class="enterprise-mktg-item">
                        <EnterpriseMktgItemIcon class="mb-2" >
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="none"><path d="M6 5.143A.857.857 0 0 0 5.143 6V21.43c0 .473.384.857.857.857h5.143c.17 0 .334.05.475.144l3.81 2.54v-1.827c0-.473.384-.857.858-.857h2.571a.857.857 0 1 1 0 1.714h-1.714v2.572a.857.857 0 0 1-1.333.713L10.883 24H6a2.571 2.571 0 0 1-2.571-2.571V6A2.571 2.571 0 0 1 6 3.43h28.286A2.571 2.571 0 0 1 36.857 6v8.572a.857.857 0 1 1-1.714 0V6a.857.857 0 0 0-.857-.857H6zM26.863 22.75a8.542 8.542 0 0 1 5.708-2.178c2.198 0 4.203.827 5.72 2.187a.857.857 0 1 1-1.145 1.276 6.829 6.829 0 0 0-4.575-1.75 6.828 6.828 0 0 0-4.566 1.742.857.857 0 1 1-1.142-1.278zM40.23 38.824a.857.857 0 0 1 1.21.063c1.19 1.32 2.001 2.923 2.265 4.686a.857.857 0 1 1-1.696.254c-.209-1.398-.856-2.698-1.842-3.792a.857.857 0 0 1 .063-1.21zM38.369 33.447a.857.857 0 0 1-.064 1.21 8.543 8.543 0 0 1-5.734 2.2h-.002c-.548 0-1.087.041-1.61.12-4.075.613-7.221 3.472-7.83 6.888a.857.857 0 0 1-1.687-.3c.635-3.57 3.424-6.473 7.053-7.738a8.594 8.594 0 0 1-1.636-1.15.857.857 0 0 1 1.143-1.278 6.828 6.828 0 0 0 4.568 1.744h.001a6.828 6.828 0 0 0 4.587-1.76.857.857 0 0 1 1.21.063z" fill="#79B8FF"></path><path d="M21.7 8.596c.454.136.711.614.575 1.068l-2.585 8.594a.857.857 0 0 1-1.642-.494l2.585-8.594a.857.857 0 0 1 1.068-.574zM15.178 10.537a.857.857 0 0 1 0 1.212l-1.966 1.966 1.966 1.965a.857.857 0 1 1-1.213 1.212l-2.571-2.571a.857.857 0 0 1 0-1.212l2.571-2.572a.857.857 0 0 1 1.213 0z" fill="#2188FF"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M24.168 24.006c.451.03.929.166 1.245.59.294.394.299.871.301 1.085v.037c-.002.611 0 1.59 0 2.574v.007c.001.96.002 1.924 0 2.561v.027c0 .104-.001.262-.021.416a1.463 1.463 0 0 1-.236.648c-.356.518-.95.623-1.459.62-2.275 0-4.284-1.906-4.284-4.285 0-1.679 1-3.122 2.39-3.826 1.56-4.269 5.657-7.317 10.467-7.317 4.811 0 8.908 3.048 10.469 7.317 1.388.704 2.389 2.147 2.389 3.826 0 1.679-1 3.122-2.39 3.826a11.157 11.157 0 0 1-8.79 7.191A1.286 1.286 0 0 1 31.715 39v-.557c0-.402.327-.728.729-.728h.128a9.43 9.43 0 0 0 8.403-5.147c-.466-.022-.971-.156-1.288-.617a1.463 1.463 0 0 1-.236-.648 3.425 3.425 0 0 1-.021-.416v-.027c-.002-.639-.001-1.606 0-2.567 0-.985.002-1.963 0-2.575v-.037c.002-.214.007-.69.3-1.084.317-.425.794-.562 1.246-.59a9.429 9.429 0 0 0-8.404-5.15 9.429 9.429 0 0 0-8.403 5.15zm-.174 1.709c-1.352.003-2.565 1.166-2.565 2.571 0 1.408 1.217 2.572 2.571 2.572v-.004c.002-.593 0-1.57 0-2.545v-.003c-.001-1.004-.002-2.007 0-2.587v-.004h-.006zm17.155 0c1.352.003 2.565 1.166 2.565 2.571 0 1.408-1.217 2.572-2.571 2.572v-.004c-.002-.594 0-1.572 0-2.548v-.008c0-1.001.002-2 0-2.58v-.003h.006z" fill="#2188FF"></path><path d="M25.108 11.75a.857.857 0 0 1 1.212-1.213l2.572 2.572a.857.857 0 0 1 0 1.212l-2.572 2.571a.857.857 0 1 1-1.212-1.212l1.965-1.965-1.965-1.966z" fill="#2188FF"></path></svg>
                        </EnterpriseMktgItemIcon>
                        <EnterpriseMktgItemTitle class="h4-mktg font-inter">
                            Talk to us
                        </EnterpriseMktgItemTitle>
                        <EnterpriseMktgItemSubTitle class="enterprise-mktg-sub-title f5 text-gray">
                            Want to use both?
                        </EnterpriseMktgItemSubTitle>

                        <Button class="btn-primary-mktg-blue-outline py-3 px-4 mb-1 mt-2 f5 w-500"
                                inline>
                            Contact Sales →
                        </Button>
                    </EnterpriseMktgItem>
                </EnterpriseMktgInner>
            </EnterpriseMktg>

            <GithubUniverseExplore class="github-universe-explore text-center flex-column-center mx-3 p-5 text-white round-2">

                <GithubUniverseExploreTitle class="font-inter h2-mktg lh-125">
                    See what launched at Universe
                </GithubUniverseExploreTitle>

                <GithubUniverseExploreParagraph class="github-universe-explore-paragraph mt-4 f5 text-hsla-pale font-mono">
                    Say hello to our new GitHub for mobile experience,
                    get more from GitHub Actions and Packages,
                    and learn how we’re shaping the future of software, together.
                </GithubUniverseExploreParagraph>

                <Button inline class="btn-primary-mktg-blue my-5 py-3 px-4 f5 w-500 font-mono">
                    Explore the launches →
                </Button>
            </GithubUniverseExplore>

            <MainCustomers class="py-7 mx-3">
                <MainCustomersTitle class="font-inter h3-mktg w-normal text-gray-light text-center lh-125 mb-4">
                    More than 2.1 million businesses and organizations use GitHub
                </MainCustomersTitle>
                <MainCustomersList class="mt-2 flex-wrap flex-row-center" style="filter: grayscale(100%);">
                    <li class="img-li" v-for="item in customerList" :key="item.src">
                        <img class="logo-img px-2" :src="item.src" :alt="item.alt">
                    </li>
                </MainCustomersList>
            </MainCustomers>

            <SellingPoint title="GitHub for teams"
                          subTitle="A better way to work together"
                          paragraph="GitHub brings teams together to work through problems,
                                        move ideas forward,
                                        and learn from each other along the way."
                          btnTitle="Sign up your team →">

                <Advantage class="pt-6 px-3 flex-column">
                    <AdvantageIllustration class="col-10 col-sm-7 mx-auto mx-lg-6 mb-sm-3">
                        <img class="width-fit" src="https://github.githubassets.com/images/modules/site/home-illo-team.svg">
                    </AdvantageIllustration>

                    <AdvantageList class="advantage-list">
                        <AdvantageItem v-for="item in teamsAdvantageList"
                                       :key="item.title"
                                       class="my-4"
                                       :title="item.title"
                                       :paragraph="item.paragraph"
                                       :theLink="item.theLink"/>
                    </AdvantageList>
                </Advantage>

                <Case class="mt-6 mx-3">
                    <CaseTitle class="font-inter f2-mktg text-gray lh-15 w-normal text-center">
                        See how the world's leading companies use GitHub Enterprise.
                    </CaseTitle>

                    <CaseItem v-for="item in caseList"
                              :key="item.title"
                              :img="item.img"
                              :title="item.title"
                              :subTitle="item.subTitle"/>
                </Case>
            </SellingPoint>

            <SellingPoint title="Security and Administration"
                          subTitle="Your business needs, met"
                          paragraph="
       From flexible hosting to granular access controls, we’ve got your security requirements covered.
    "
                          btnTitle="How GitHub Enterprise works →">

                <Advantage class="px-3 flex-column">
                    <AdvantageIllustration class="mx-auto px-5">
                        <img class="width-fit" src="https://github.githubassets.com/images/modules/site/home-illo-business.png"/>
                    </AdvantageIllustration>

                    <AdvantageList class="advantage-list mt-2">
                        <AdvantageItem v-for="item in securityAdvantageList"
                                       :key="item.title"
                                       :simple="true"
                                       class="my-3"
                                       :title="item.title"
                                       :paragraph="item.paragraph"
                                       :theLink="item.theLink"/>
                    </AdvantageList>
                </Advantage>

                <HostWhereYouNeed class="flex border mx-3 p-4 pt-5 round-1">

                    <HostWhereYouNeedIcon class="mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64px"><path d="M27 13h-9a1 1 0 0 0 0 2h9a1 1 0 0 0 0-2zm15-1a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1zm4 0a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1zM27 28h-9a1 1 0 0 0 0 2h9a1 1 0 0 0 0-2zm15 3a1 1 0 0 0 1-1v-2a1 1 0 0 0-2 0v2a1 1 0 0 0 1 1zm4 0a1 1 0 0 0 1-1v-2a1 1 0 0 0-2 0v2a1 1 0 0 0 1 1z" fill="#23292f"></path><path d="M50 44h-1a13 13 0 0 0-4.68-9H48a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3h-5v-3h5a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H16a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h5v3h-5a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h11.72a13 13 0 0 0-3.79 5.21A7 7 0 0 0 13.28 44 6 6 0 0 0 14 56h36a6 6 0 0 0 0-12zM15 17v-6a1 1 0 0 1 1-1h32a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H16a1 1 0 0 1-1-1zm8 3h18v3H23zm-7 13a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h32a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-7a12.9 12.9 0 0 0-10 0H16zm34 21H14a4 4 0 1 1 .09-8 1 1 0 0 0 1-.83 5 5 0 0 1 8.6-2.55 1 1 0 0 0 1.7-.42A11 11 0 0 1 47 45a1 1 0 0 0 1 1h2a4 4 0 0 1 0 8z" fill="#23292f"></path></svg>
                    </HostWhereYouNeedIcon>

                    <HostWhereYouNeedColumn>
                        <HostWhereYouNeedTitle class="h4-mktg font-inter">
                            Hosted where you need it
                        </HostWhereYouNeedTitle>
                        <HostWhereYouNeedParagraph class="host-where-you-need-paragraph f5 text-gray mr-2">
                            Securely and reliably host your work on GitHub using GitHub Enterprise Cloud.
                            Or deploy GitHub Enterprise Server in your own data centers or in a private cloud
                            using Amazon Web Services, Azure, or Google Cloud Platform.
                        </HostWhereYouNeedParagraph>
                        <HostWhereYouNeedLinks>
                            <a href="" class="text-blue block">Compare plans →</a>
                            <a href="" class="text-blue block">Contact Sales for more information →</a>
                        </HostWhereYouNeedLinks>
                    </HostWhereYouNeedColumn>
                </HostWhereYouNeed>

            </SellingPoint>

            <SellingPoint title="Integration"
                          subTitle="Build on GitHub"
                          btnTitle="Learn about integrations →"
                          paragraph="Customize your process with GitHub apps and an intuitive API. Integrate the tools you already use or discover new favorites to create a happier, more efficient way of working.">
                <GitHubMPAppCluster class="px-3">
                    <GitHubMPAppList class="flex-row-center flex-wrap pb-6">
                        <GitHubMPAppItem class="flex-row-center round github-mp-app-item m-3"
                                         v-for="item in githubMPAppList"
                                         :key="item.src"
                                         :style="{background:item.background}">
                            <img class="github-mp-app-item-icon" :src="item.src" :alt="item.alt">
                        </GitHubMPAppItem>
                    </GitHubMPAppList>

                    <GitHubMPAppParagraph class="my-2 text-gray lh-15 f5 text-center">
                        Sometimes, there’s more than one tool for the job. Why not try something new?
                    </GitHubMPAppParagraph>

                    <GitHubMPAppLink class="text-blue f4 block text-center">
                        Browse GitHub Marketplace →
                    </GitHubMPAppLink>
                </GitHubMPAppCluster>
            </SellingPoint>

            <SellingPoint title="Community"
                          paragraph="GitHub is home to the world’s largest community of developers and their projects..."
                          subTitle="Welcome home, developers">

                <Case class="px-3 mb-3">
                    <CaseItem v-for="item in developerCaseList"
                              :key="item.title"
                              :img="item.img"
                              :title="item.title"
                              :subTitle="item.subTitle"/>
                </Case>

                <Statistics class="px-3">
                    <StatisticsTitle class="font-inter f2-mktg statistics-title text-center text-gray">
                        ...whether you’re making your first commit or sending a Rover to Mars, there’s room for you here, too.
                    </StatisticsTitle>
                    <StatisticsItem class="flex-column-center">
                        <StatisticsItemIllustration class="mt-6 p-4 mb-3 round flex-column-center text-white"
                                                    style="width:225px;height:225px;background:#f66a0a">
                            <span class="block f0-mktg mb-1 font-inter lh-1">
                                100M<sup class="f2-mktg-light relative">*</sup>
                            </span>
                            <span class="f5-mktg lh-125 w-600">respositories worldwide</span>
                        </StatisticsItemIllustration>
                        <StatisticsItemRow class="flex-row-space-between">
                            <StatisticsItemParagraph class="statistics-item-paragraph lh-15 f5-mktg">
                                GitHub’s users create and maintain influential technologies alongside the world’s largest <span class="text-orange">open source&nbsp;community</span>.
                            </StatisticsItemParagraph>

                            <svg class="text-orange-light" fill="currentColor" viewBox="0 0 6 16" version="1.1" width="6" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 14l6-6-6-6v12z"></path></svg>
                        </StatisticsItemRow>
                    </StatisticsItem>
                    <StatisticsItem class="flex-column-center">
                        <StatisticsItemIllustration class="flex-column-center mt-6 mb-3 round p-4 flex-column-center text-white bg-blue"
                                                    style="width:175px;height:175px">
                            <span class="block f0-mktg mb-1 font-inter lh-1">
                                40M<sup class="f2-mktg-light relative">*</sup>
                            </span>
                            <span class="block f5-mktg lh-125 text-center w-600">developers worldwide</span>
                        </StatisticsItemIllustration>
                        <StatisticsItemRow class="flex-row-space-between">
                            <StatisticsItemParagraph class="statistics-item-paragraph lh-15 f5-mktg">
                                <span class="text-blue">Developers</span> use GitHub for personal projects, from experimenting with new programming languages to hosting their life’s work.
                            </StatisticsItemParagraph>

                            <svg class="text-blue" fill="currentColor" viewBox="0 0 6 16" version="1.1" width="6" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 14l6-6-6-6v12z"></path></svg>
                        </StatisticsItemRow>
                    </StatisticsItem>
                    <StatisticsItem class="flex-column-center">
                        <StatisticsItemIllustration class="mt-6 mb-3 round flex-column-center text-white bg-purple"
                                                    style="width:145px;height:145px">
                            <span class="block h2-mktg w-400 mb-1 font-inter lh-1">
                                2.1M<sup class="f2-mktg-light relative">*</sup>
                            </span>
                            <span class="f5-mktg lh-125 w-600 text-center">businesses &amp; organizations worldwide</span>
                        </StatisticsItemIllustration>
                        <StatisticsItemRow class="flex-row-space-between">
                            <StatisticsItemParagraph class="statistics-item-paragraph lh-15 f5-mktg">
                                <span class="text-purple">Businesses</span> of all sizes use GitHub to support their development process and to securely build software.
                            </StatisticsItemParagraph>

                            <svg class="text-purple" fill="currentColor" viewBox="0 0 6 16" version="1.1" width="6" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 14l6-6-6-6v12z"></path></svg>
                        </StatisticsItemRow>
                    </StatisticsItem>

                    <StatisticsItemNotes class="mt-6 f6-mktg text-gray-light">
                        * As of August 2019
                    </StatisticsItemNotes>
                </Statistics>
            </SellingPoint>

            <EndJumbotron class="py-7 px-3 bg-gray-dark flex-column-center">
                <EndJumbotronTitle class="h2-mktg font-inter w-400 lh-15 text-white text-center">
                    Get started for free — join the millions of developers already using GitHub to share their code, work together, and build amazing things.
                </EndJumbotronTitle>
                <Button inline
                        style="padding-bottom: 20px;padding-top: 20px"
                        class="px-5 bg-btn-primary-green round-1 w-500 f4-mktg text-white my-4">
                    Sign up for GitHub
                </Button>
                <EndJumbotronNotes class="end-jumbotron-notes text-center">
                    By clicking “Sign up for GitHub”, you agree to our
                    <a class="text-white" href="https://help.github.com/terms" target="_blank">terms of service</a>
                    and
                    <a class="text-white" href="https://help.github.com/privacy" target="_blank">privacy statement</a>
                    .
                    <span class="js-email-notice">We’ll occasionally send you account related emails.</span>
                </EndJumbotronNotes>
            </EndJumbotron>

            <Footer></Footer>
        </Main>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {LogoutedHeader,Button} from '../../../../components'
    import {AdvantageItem,CaseItem,SellingPoint,Footer} from './components'

    export default {
        data() {
            return {
                customerList: [
                    {
                        alt: "Airbnb",
                        src: "https://github.githubassets.com/images/modules/site/logos/airbnb-logo.png"
                    },
                    {
                        alt: "SAP",
                        src: "https://github.githubassets.com/images/modules/site/logos/sap-logo.png"
                    },
                    {
                        alt: "IBM",
                        src: "https://github.githubassets.com/images/modules/site/logos/ibm-logo.png"
                    },
                    {
                        alt: "Google",
                        src: "https://github.githubassets.com/images/modules/site/logos/google-logo.png"
                    },
                    {
                        alt: "PayPal",
                        src: "https://github.githubassets.com/images/modules/site/logos/paypal-logo.png"
                    },
                    {
                        alt: "Bloomberg",
                        src: "https://github.githubassets.com/images/modules/site/logos/bloomberg-logo.png"
                    },
                    {
                        alt: "Spotify",
                        src: "https://github.githubassets.com/images/modules/site/logos/spotify-logo.png"
                    },
                    {
                        alt: "Swift",
                        src: "https://github.githubassets.com/images/modules/site/logos/swift-logo.png"
                    },
                    {
                        alt: "Facebook",
                        src: "https://github.githubassets.com/images/modules/site/logos/facebook-logo.png"
                    },
                    {
                        alt: "Node.js",
                        src: "https://github.githubassets.com/images/modules/site/logos/node-logo.png"
                    },
                    {
                        alt: "NASA",
                        src: "https://github.githubassets.com/images/modules/site/logos/nasa-logo.png"
                    },
                    {
                        alt: "Walmart",
                        src: "https://github.githubassets.com/images/modules/site/logos/walmart-logo.png"
                    }
                ],
                teamsAdvantageList: [
                    {
                        title: "Write better code",
                        paragraph: "Collaboration makes perfect. The conversations and code reviews that happen in pull requests help your team share the weight of your work and improve the software you build. ",
                        theLink: "Learn about code review."
                    },
                    {
                        title: "Manage your chaos",
                        paragraph: "Take a deep breath. On GitHub, project management happens in issues and project boards, right alongside your code. All you have to do is mention a teammate to get them involved. ",
                        theLink: "Learn about project management."
                    },
                    {
                        title: "Find the right tools",
                        paragraph: "Browse and buy apps from GitHub Marketplace with your GitHub account. Find the tools you like or discover new favorites—then start using them in minutes. ",
                        theLink: "Learn about integrations."
                    }
                ],
                securityAdvantageList: [
                    {
                        title: "Code security",
                        paragraph: "Prevent problems before they happen. Protected branches, signed commits, and required status checks protect your work and help you maintain a high standard for your code.",
                        theLink: ""
                    },
                    {
                        title: "Access controlled",
                        paragraph: "Encourage teams to work together while limiting access to those who need it with granular permissions and authentication through SAML/SSO and LDAP.",
                        theLink: ""
                    },
                ],
                caseList: [
                    {
                        img: "https://customer-stories-feed.github.com/customer_stories/mgm-resorts/hero.jpg",
                        title: "MGM Resorts International",
                        subTitle: "Hospitality"
                    },
                    {
                        img: "https://customer-stories-feed.github.com/customer_stories/nationwide/nw_hero.jpg",
                        title: "Nationwide",
                        subTitle: "Insurance"
                    },
                    {
                        img: "https://customer-stories-feed.github.com/customer_stories/sap/sap6.jpg",
                        title: "SAP",
                        subTitle: "Business Software"
                    },
                    {
                        img: "https://customer-stories-feed.github.com/customer_stories/spotify/spotifyhero.jpg",
                        title: "Spotify",
                        subTitle: "Technology/Streaming"
                    },
                ],
                githubMPAppList: [
                    {
                        src: "https://github.githubassets.com/images/modules/site/integrators/slackhq.png",
                        alt: "Slack",
                        background: "#4A154B"
                    },
                    {
                        src: "https://github.githubassets.com/images/modules/site/integrators/zenhubio.png",
                        alt: "ZenHub",
                        background: "#364e98"
                    },
                    {
                        src: "https://github.githubassets.com/images/modules/site/integrators/travis-ci.png",
                        alt: "Travis CI",
                        background: "#eff9f9"
                    },
                    {
                        src: "https://github.githubassets.com/images/modules/site/integrators/atom.png",
                        alt: "Atom",
                        background: "#5fb57d"
                    },
                    {
                        src: "https://github.githubassets.com/images/modules/site/integrators/circleci.png",
                        alt: "Circle CI",
                        background: "#022531"
                    },
                    {
                        src: "https://github.githubassets.com/images/modules/site/integrators/google.png",
                        alt: "Google",
                        background: "#f2f2f2"
                    }
                ],
                developerCaseList: [
                    {
                        img: "https://customer-stories-feed.github.com/customer_stories/freakboy3742/hero.jpg",
                        title: "Russell Keith-Magee",
                        subTitle: "Russell Keith-Magee created BeeWare to fill a gap in his own process. Today, BeeWare is the go-to project for supporting Python on every platform."
                    },
                    {
                        img: "https://customer-stories-feed.github.com/customer_stories/kris-nova/hero.jpg",
                        title: "Kris Nova",
                        subTitle: "Kris Nova quickly developed a passion for open source software. Now she gets to work on open source tooling at her day job, which includes maintaining Kubernetes Operations (kops)."
                    },
                    {
                        img: "https://customer-stories-feed.github.com/customer_stories/yyx990803/hero.jpg",
                        title: "Evan You",
                        subTitle: "In 2013, Evan You founded Vue, a Javascript framework funded by the community on Patreon. In 2016, Vue reached 2,000,000 downloads."
                    },
                    {
                        img: "https://customer-stories-feed.github.com/customer_stories/jessfraz/hero.jpg",
                        title: "Jess Frazelle",
                        subTitle: "Jess Frazelle works on Kubernetes full-time. Previously she maintained Docker, a software containerization platform used by thousands of teams."
                    },
                ]
            }
        },

        components: {
            LogoutedHeader,
            Button,
            AdvantageItem,
            CaseItem,
            SellingPoint,
            Footer,
            Container: styled.div``,
            Main: styled.div``,
            HolaJumbotron: styled.div``,
            HolaJumbotronTitle: styled.div``,
            HolaJumbotronParagraph: styled.p``,
            EnterpriseMktg: styled.div``,
            EnterpriseMktgInner: styled.div``,
            EnterpriseMktgTitle: styled.div``,
            EnterpriseMktgParagraph: styled.p``,
            EnterpriseMktgItem: styled.div``,
            EnterpriseMktgItemIcon: styled.div``,
            EnterpriseMktgItemTitle: styled.div``,
            EnterpriseMktgItemSubTitle: styled.p``,
            GithubUniverseExplore: styled.div``,
            GithubUniverseExploreTitle: styled.div``,
            GithubUniverseExploreParagraph: styled.p``,
            MainCustomers: styled.div``,
            MainCustomersTitle: styled.div``,
            MainCustomersList: styled.div``,
            Advantage: styled.div``,
            AdvantageIllustration: styled.div``,
            AdvantageList: styled.div``,
            Case: styled.div``,
            CaseTitle: styled.h3``,
            HostWhereYouNeed: styled.div``,
            HostWhereYouNeedTitle: styled.h3``,
            HostWhereYouNeedParagraph: styled.p``,
            HostWhereYouNeedLinks: styled.div``,
            HostWhereYouNeedIcon: styled.div``,
            HostWhereYouNeedColumn: styled.div``,
            GitHubMPAppCluster: styled.div``,
            GitHubMPAppList: styled.div``,
            GitHubMPAppItem: styled.div``,
            GitHubMPAppParagraph: styled.p``,
            GitHubMPAppLink: styled.a``,
            Statistics: styled.div``,
            StatisticsTitle: styled.p``,
            StatisticsItem: styled.div``,
            StatisticsItemIllustration: styled.div``,
            StatisticsItemRow: styled.div``,
            StatisticsItemParagraph: styled.p``,
            StatisticsItemNotes: styled.div``,
            EndJumbotron: styled.div``,
            EndJumbotronTitle: styled.h2``,
            EndJumbotronNotes: styled.p``,
        }
    }
</script>

<style scoped lang="scss">
.link{
    border-bottom: 1px solid hsla(0,0%,100%,.125);
    text-decoration: none;
}

.enterprise-mktg:before{
    position: absolute;
    top: -31px;
    left: -31px;
    z-index: -1;
    width: 75%;
    height: 100%;
    content: "";
    background: url("../../../../assets/image/dots-small.svg");
}

.enterprise-mktg-inner{
    max-width: 1280px;
    position: relative;
}

.enterprise-mktg-item{
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.enterprise-mktg-sub-title{
    padding-bottom: 10px;
}

.github-universe-explore{
    background: #1B1F23 url(https://github.githubassets.com/images/modules/site/universe19.png) bottom right no-repeat;
    background-size: contain;
}

.github-universe-explore-paragraph{
    margin-bottom: 10px;
}

.logo-img{
    position: relative;
    display: inline-block;
    width: auto;
    height: 20px;
    margin: 10px;
    vertical-align: middle;
    box-sizing: border-box;
}

.img-li{
    list-style: none;
}

.advantage-list{
    flex-grow: 1;
}

.host-where-you-need-paragraph{
    margin-bottom: 10px
}

.github-mp-app-item{
    width: 96px;
    height: 96px;
    .github-mp-app-item-icon{
        max-width: 60%;
        height: auto;
        max-height: 55%;
    }
}

.statistics-title{
    margin-bottom: 10px;
}

.statistics-item-paragraph{
    width: 83.333%;
}

.end-jumbotron-notes{
    margin-top: 5px;
    margin-bottom: 0;
    font-size: 12px;
    color: #6a737d;
}
</style>