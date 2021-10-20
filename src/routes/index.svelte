<script lang="ts">
import { fade } from 'svelte/transition'
import { formula } from 'svelte-formula'
import { gqlCreateProject, gqlGetProjects, GqlGetProjectsDoc } from '@/generated/graphql'
import Modal, { getModal } from '@/components/Modal.svelte'

const { form, isFormValid } = formula()

export let newProjectName = ""

$: query = gqlGetProjects({})

const createProject = (_: Event) => {
  if (!isFormValid) {
    return
  }
  gqlCreateProject({ variables: { name: newProjectName }, refetchQueries: [{ query: GqlGetProjectsDoc }] })
  newProjectName = ""
  getModal().close()
}
</script>

{#if $query.loading}
  <div transition:fade class="absolute w-screen h-screen flex justify-center items-center">
    <div class="absolute bg-black bg-opacity-40 w-full h-full z-0" />

    <div class="inline-flex items-center px-8 py-6 border border-transparent leading-6 font-medium rounded-md bg-white shadow text-xl z-10">
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Loading...
    </div>
  </div>
{/if}

<main class="flex-1 relative overflow-y-auto">
  <div class="py-6">
    <div class="md:flex md:items-center md:justify-between px-4 sm:px-6 md:px-8 mb-4">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Home
        </h2>
      </div>
    </div>

    {#if ($query.data?.projects || []).length > 0}
    <div class="px-4 sm:px-6 md:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {#each $query.data?.projects || [] as project (project._id)}
        <a href="/dashboard/{ project._id }" class="group w-full h-full relative block rounded-lg border border-gray-300 bg-white shadow-sm px-6 py-4 cursor-pointer hover:border-gray-400 sm:flex sm:justify-between focus:outline-none items-center focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <div transition:fade>
            <div class="flex items-center text-left">
              <div class="text-sm">
                <p id="server-size-3-label" class="font-medium text-gray-900">
                  { project.name }
                </p>
                <div id="server-size-3-description-0" class="text-gray-500">
                  <p class="sm:inline">{ project._id }</p>
                  <span class="hidden sm:inline sm:mx-1" aria-hidden="true">&middot;</span>
                  <p class="sm:inline">{ project.app.length } Apps</p>
                </div>
              </div>
            </div>
          </div>
          <div id="server-size-3-description-1" class="mt-2 flex text-sm sm:mt-0 sm:block sm:ml-4 sm:text-right">
            <div class="ml-1 text-gray-500 sm:ml-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <div class="absolute -inset-px rounded-lg border-2 border-transparent group-active:border-blue-500 pointer-events-none" aria-hidden="true"></div>
        </a>
        {/each}
        <button on:click="{ () => getModal().open() }" type="button" class="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-4 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <span class="mt-2 block text-sm font-medium text-gray-900">
            Create a new project
          </span>
        </button>
      </div>
    </div>
    {/if}
    
    {#if !$query.loading && ($query.data?.projects || []).length === 0}
      <div class="text-center" transition:fade>
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No projects</h3>
        <p class="mt-1 text-sm text-gray-500">
          Get started by creating a new project.
        </p>
        <div class="mt-6">
          <button on:click="{ () => getModal().open() }" type="button" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            New Project
          </button>
        </div>
      </div>
    {/if}
  </div>
</main>

<Modal>
  <form use:form on:submit|preventDefault="{ createProject }">
    <div>
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
        <svg class="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      </div>
      
      <div class="mt-3 text-center sm:mt-5">
        <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
          Create new project
        </h3>
        <div class="mt-2">
          <label for="name" class="block text-sm font-medium text-gray-700 text-left">Name</label>
          <div class="mt-1">
            <input type="text" name="name" id="name" required minlength="3" bind:value={ newProjectName } class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Death Star">
          </div>
        </div>
      </div>
    </div>
    
    <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
      <button disabled={ !$isFormValid } type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm disabled:bg-blue-400 disabled:cursor-not-allowed">
        Create
      </button>
      <button on:click={ () => getModal().close() } type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
        Cancel
      </button>
    </div>
  </form>
</Modal>
