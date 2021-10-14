<script context="module" lang="ts">
import axios from "axios";
  
export async function load({ page, fetch, session, context }) {
  const result = await axios.get("http://localhost:3333/project/" + page.params.id).then((response) => { return { status: response.status } }).catch((error) => {
    if (error.response) {
      return {
        status: error.response.status,
        error: error.response.data.message
      }
    }

    return {
      status: error.status,
      error: new Error("Backend not reachable via http://localhost:3333 on route /project/" + page.params.id)
    }
  })

  currentProjectID.set(page.params.id);

  return {
    ...result, 
    props: { 
      projectID: page.params.id
    }
  }
}
</script>

<script lang="ts">
import { page } from '$app/stores';
import { currentProjectID } from '@/stores';

export let projectID;

const routes = [
  { href: `/dashboard/${ projectID }/settings`, headline: 'General', subheadline: 'General project settings, such as name and avatar.', icon: 'fal fa-cog' },
  { href: `/dashboard/${ projectID }/settings/security`, headline: 'Security', subheadline: 'Additional settings for securing the API interfaces and the like.', icon: 'fal fa-key' },
  { href: `/dashboard/${ projectID }/settings/help`, headline: 'Additional Resources', subheadline: 'Documentation, Codebase, Sponsoring and more.', icon: 'fal fa-question-circle' }
]
</script>

<main class="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last bg-gray-50">
  <slot></slot>
</main>
<aside class="hidden relative xl:order-first xl:flex xl:flex-col flex-shrink-0 w-96 border-r border-gray-200">
  <nav aria-label="Sections" class="hidden flex-shrink-0 w-96 bg-white border-r border-gray-200 xl:flex xl:flex-col">
    <div class="flex-shrink-0 h-16 px-6 border-b border-gray-200 flex items-center">
      <p class="text-lg font-medium text-gray-900">Settings</p>
    </div>
    <div class="flex-1 min-h-0 overflow-y-auto">
      {#each routes as route}
      <a href={ route.href } class="flex p-6 border-b border-gray-200 { route.href === $page.path ? 'bg-blue-50 bg-opacity-50' : 'hover:bg-blue-50 hover:bg-opacity-50' }" aria-current="page">
        <i class="{ route.icon } flex-shrink-0 -mt-0.5 !h-6 !w-6 text-gray-400" />
        <div class="ml-3 text-sm">
          <p class="font-medium text-gray-900">{ route.headline }</p>
          <p class="mt-1 text-gray-500">{ route.subheadline }</p>
        </div>
      </a>
      {/each}
    </div>
  </nav>
</aside>