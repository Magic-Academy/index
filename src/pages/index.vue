<template>
    <div id="wrapper">
        <div id="main" text-left text-coolGrey>
            <div class="inner">
                <header id="header">
                </header>
                <section id="banner">
                    <div class="content">
                        <header>
                            <h1>Magic-Academy</h1>
                        </header>
                        <ul>
                            <li>Welcome to the Magic Academy! We are a group of tech enthusiasts who love open-source, and
                                we believe that the values of open-source and contribution are the most important in the
                                tech world. At the Magic Academy, we stand together for technology and our common beliefs,
                                and we are eager to share our experience and knowledge with anyone who is passionate and
                                curious about tech.</li>
                            <li>Our principle is simple: respect everyone's contribution, encourage sharing and learning,
                                and advocate fair and equal communication. We hope everyone can enjoy the fun of technology
                                in their own way, and contribute to the progress of technology. Whether you are an
                                experienced tech expert or a newbie just starting to learn to code, we welcome your
                                participation.</li>
                            <li>We adhere to the code of conduct of the open-source community, believing that sharing and
                                learning is our mission. At the Magic Academy, we encourage everyone to respect original
                                works, use appropriate licenses to protect their original creations, and respect and support
                                the efforts of others. We also respect and support every developer who contributes to the
                                community, and we encourage everyone to learn and grow together through sharing.</li>
                            <li>If you are passionate about technology, like sharing, discussing, asking questions, and
                                contributing, then the Magic Academy is the ideal place for you. Here, you will find a group
                                of like-minded friends, grow together, learn together, and create your own magic together in
                                the world of technology.</li>
                            <li>For more information, check out our GitHub page. We're excited to have you on board!</li>
                        </ul>
                        <ul class="actions">
                            <li>
                                <RouterLink to="invite" class="button big icon fa-file-text">Apply for Joining</RouterLink>
                            </li>
                        </ul>
                    </div>
                </section>
                <section>
                    <header class="major">
                        <h2>Members</h2>
                    </header>
                    <div class="features">
                        <article v-for="member in state.members" :key="member.id">
                            <img class="icon avatar" :src="member.avatarUrl" :alt="member.name" />
                            <div class="content">
                                <h3><a :href="'https://github.com/' + member.login" target="_blank">{{
                                    member.name ? member.name : member.login }}</a>
                                </h3>
                                <p>{{ member.bio ? `"${member.bio}"` : "" }}<br>
                                </p>
                            </div>
                        </article>
                        <button class="btn btn-primary m-auto" @click="loadMore"
                            :disabled="state.loading || !showLoadMoreButton">
                            <span v-if="state.loading">
                                <i class="fa fa-spinner fa-spin"></i> Loading...
                            </span>
                            <span v-else>
                                Load More
                            </span>
                        </button>
                    </div>
                </section>
                <p>Grateful for the outstanding contributions made by each member.</p>
                <section>
                    <header class="major">
                        <h2>other</h2>
                    </header>
                    <div class="posts">
                        <article>
                            <h3>Magic Academy Discord server</h3>
                            <ul class="actions">
                                <li><a href="https://discord.gg/G2jgHeQfy4" target="_blank"
                                        class="button icon fa-heart">Click here to enter</a></li>
                            </ul>
                        </article>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts" generic="T extends any, O extends any">
import { useQuery } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'

interface Member {
    id: string
    name: string
    login: string
    bio: string
    avatarUrl: string
}

const GET_ORGANIZATION_MEMBERS = gql`
    query GetOrganizationMembers($login: String!, $first: Int!, $after: String) {
      organization(login: $login) {
        membersWithRole(first: $first, after: $after) {
          nodes {
            id
            name
            login
            bio
            avatarUrl(size: 100)
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  `

const { result, refetch } = useQuery(GET_ORGANIZATION_MEMBERS, {
    login: 'Magic-Academy',
    first: 50,
})
const state = reactive({
    members: [] as Member[],
    offset: 0,
    loading: false,
})
let showLoadMoreButton = true

watchEffect(() => {
    if (result.value) {
        const newMembers = result.value.organization.membersWithRole.nodes.filter(
            (member: Member) => !state.members.find(m => m.id === member.id)
        )
        state.members = [...state.members, ...newMembers]
        state.loading = false
        if (!result.value.organization.membersWithRole.pageInfo.hasNextPage) {
            showLoadMoreButton = false
        }
    }
})

const loadMore = () => {
    if (!state.loading && result.value?.organization.membersWithRole.pageInfo.hasNextPage) {
        state.loading = true
        state.offset += result.value?.organization.membersWithRole.nodes.length || 0
        refetch({
            login: 'Magic-Academy',
            first: 50,
            after: result.value?.organization.membersWithRole.pageInfo.endCursor,
        })
    }
}

</script>
  

<style scoped>
@import url(../styles/index.css);

.avatar {
    width: 6em;
    height: 6em;
    border-radius: 6em;
}

h3 img {
    height: 1em;
}
</style>