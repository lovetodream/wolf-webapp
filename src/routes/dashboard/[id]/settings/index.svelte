<script lang="ts">
import { 
  gqlArchiveProject, 
  gqlDeleteApp, 
  gqlDeleteProject, 
  gqlGetSingleProject, 
  GqlGetSingleProjectDoc, 
  gqlResetProjectAvatar, 
  gqlUpdateGeneralProjectInfo, 
  gqlUpdateProjectAvatar } from '@/generated/graphql';
import Modal, { getModal } from '@/components/Modal.svelte';
import { currentProjectID } from '@/stores';
import { get } from 'svelte/store';
import { formula } from 'svelte-formula'
import { addNotification } from '@/components/NotificationWrapper.svelte';

const projectID = get(currentProjectID);
const projectQ = gqlGetSingleProject({ variables: { id: projectID } })
const { form, isFormValid, dirty, formValues, submitValues } = formula()
const emptyAvatar = "data:image/gif;base64,R0lGODlhAQABAIAAAP7//wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="

// project info values
let projectName: string;
let projectBio: string;
let projectAlias: string;
let projectDesc: string;
let projectUrl: string;
let projectAvatar: string;

$: query = projectQ
projectQ.subscribe((resp) => {
  const project = resp.data.project;

  if (project) {
    projectName = project.name
    projectBio = project.bio
    projectAlias = project.alias
    projectDesc = project.description
    projectUrl = project.url
    projectAvatar = project.avatar
  }
});
let confirmAction = "";
let appToRemove = "";

formValues.subscribe((values) => console.log(values))

function closeModal(id?: string) {
  confirmAction = "";
  getModal(id).close();
}

async function saveChanges(_: Event) {
  console.log(_);
  await gqlUpdateGeneralProjectInfo({ 
    variables: { 
      id: projectID, 
      name: projectName, 
      bio: projectBio, 
      alias: projectAlias, 
      description: projectDesc, 
      url: projectUrl 
    },
    refetchQueries: [{
      query: GqlGetSingleProjectDoc,
      variables: { id: projectID }
    }] 
  })
  .then((res) => {
    if (!res.errors) {
      addNotification("success", "Successfully saved project info!", "The general information about the project was successfully overwritten.")
      return
    }

    throw new Error();
  })
  .catch((_) => {
    addNotification("danger", "An error occured!", "Try saving the info again or report an issue.")
  })

  const avatar: File = get(submitValues).avatar[0]

  if (avatar) {
    const file = avatar
    const reader = new FileReader()

    if (projectAvatar === emptyAvatar) {
      gqlResetProjectAvatar({ 
        variables: { id: projectID }, 
        refetchQueries: [{ 
          query: GqlGetSingleProjectDoc, 
          variables: { id: projectID } 
        }] 
      })
      .then((res) => {
        if (!res.errors) {
          addNotification("success", "Successfully reset avatar!", "")
          return
        }

        throw new Error();
      })
      .catch((_) => {
        addNotification("danger", "An error occured!", "Try reseting the avatar again or report an issue.")
      })

      return
    }

    reader.addEventListener("load", async () => {
      await gqlUpdateProjectAvatar({ 
        variables: { 
          id: projectID, 
          avatar: reader.result as string 
        } 
      })
      .then((res) => {
        if (!res.errors) {
          addNotification("success", "Successfully saved avatar!", "")
          return
        }

        throw new Error();
      })
      .catch((_) => {
        addNotification("danger", "An error occured!", "Try saving the avatar again or report an issue.")
      })
    })

    if (file) {
      reader.readAsDataURL(file)
    }
  }
}

function changeAvatarVisually(e) {
  const file = e.target.files[0]
  const reader = new FileReader()

  reader.addEventListener("load", async () => {
    projectAvatar = reader.result as string 
  })

  if (file) {
    reader.readAsDataURL(file)
  }
}

async function resetProject() {
  // TODO
  addNotification("success", "Successfully reset project!", "All the data from this project is gone from now on. (To be honest, this is not even implemented at the moment, so nothing really happend at all.)")
  confirmAction = "";
  getModal("reset").close();
}

async function removeApp() {
  await gqlDeleteApp({ variables: { projectId: projectID, appId: appToRemove } })
  .then((_) => {
    addNotification("success", "Successfully removed app!", "The app and all it's data is gone from now on.")
  })
  .catch((_) => {
    addNotification("danger", "An error occured!", "Try removing the app again or report an issue.")
  })
  appToRemove = "";
  confirmAction = "";
  getModal("delete-app").close();
}

async function archiveProject() {
  await gqlArchiveProject({ variables: { id: projectID } })
  .then((_) => {
    addNotification("success", "Successfully archived project!", "The project is now in read-only mode.")
  })
  .catch((_) => {
    addNotification("danger", "An error occured!", "Try archiving the project again or report an issue.")
  })
  confirmAction = "";
  getModal("archive").close();
}

async function deleteProject() {
  await gqlDeleteProject({ variables: { id: projectID } })
  .then((_) => {
    addNotification("success", "Successfully deleted project!", "The project is gone from now on.")
  })
  .catch((_) => {
    addNotification("danger", "An error occured!", "Try deleting the project again or report an issue.")
  })
  confirmAction = "";
  getModal("delete").close();
}
</script>

<div class="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
  <h1 class="text-3xl font-extrabold text-gray-900">General</h1>

  <form use:form on:submit|preventDefault={ saveChanges } class="mt-6 space-y-8 divide-y divide-y-gray-200">
    <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
      <div class="sm:col-span-6">
        <h2 class="text-xl font-medium text-gray-900">Appearance</h2>
        <p class="mt-1 text-sm text-gray-500">This information will be used to identify the project between all the others.</p>
      </div>

      <div class="sm:col-span-3">
        <label for="name" class="block text-sm font-medium text-gray-900">
          Name <span class="text-xs font-light">&mdash; required</span>
        </label>
        <input bind:value={ projectName } required type="text" name="name" id="name" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500">
      </div>

      <div class="sm:col-span-3">
        <label for="bio" class="block text-sm font-medium text-gray-900">
          Brief description
        </label>
        <input bind:value={ projectBio } maxlength="300" type="text" name="bio" id="bio" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500">
      </div>

      <div class="sm:col-span-6">
        <label for="alias" class="block text-sm font-medium text-gray-900">
          Unique alias
        </label>
        <div class="mt-1 flex rounded-md shadow-sm">
          <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
            localhost:3333/
          </span>
          <input bind:value={ projectAlias } type="text" name="alias" id="alias" placeholder={ projectID } class="flex-1 block w-full min-w-0 border-gray-300 rounded-none rounded-r-md text-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500">
        </div>
        <p class="mt-3 text-sm text-gray-500">This is an alias that can be used to prettify and shorten the API endpoints of your project.</p>
      </div>

      <div class="sm:col-span-6">
        <label for="avatar" class="block text-sm font-medium text-gray-900">
          Avatar
        </label>
        <div class="mt-1 flex items-center">
          <img class="inline-block h-12 w-12 rounded" src={ projectAvatar } alt="empty">
          <div class="ml-4 flex">
            <div class="relative bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm flex items-center cursor-pointer hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-50 focus-within:ring-blue-500">
              <label for="avatar" class="relative text-sm font-medium text-gray-900 pointer-events-none">
                <span>Change</span>
                <span class="sr-only"> avatar</span>
              </label>
              <input on:change={ changeAvatarVisually } id="avatar" name="avatar" type="file" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-md" >
            </div>
            <button on:click={ () => projectAvatar = emptyAvatar } type="button" class="ml-3 bg-transparent py-2 px-3 border border-transparent rounded-md text-sm font-medium text-gray-900 hover:text-gray-700 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-blue-500">
              Remove
            </button>
          </div>
        </div>
      </div>

      <div class="sm:col-span-6">
        <label for="description" class="block text-sm font-medium text-gray-900">
          Description
        </label>
        <div class="mt-1">
          <textarea bind:value={ projectDesc } id="description" name="description" rows="4" class="block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
        <p class="mt-3 text-sm text-gray-500">Description for your project. URLs are hyperlinked.</p>
      </div>

      <div class="sm:col-span-6">
        <label for="url" class="block text-sm font-medium text-gray-900">
          URL
        </label>
        <input bind:value={ projectUrl } type="text" name="url" id="url" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500">
        <p class="mt-3 text-sm text-gray-500">Use the GitHub or the website url of your project for example.</p>
      </div>
    </div>

    <div class="pt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
      <div class="sm:col-span-6">
        <h2 class="text-xl font-medium text-gray-900">Danger zone</h2>
        <p class="mt-1 text-sm text-gray-500">Be careful, these actions are (most likely) irreversible.</p>
      </div>

      <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6 sm:col-span-6 bg-white px-4 py-6 rounded-md border-2 border-red-700">
        <div class="sm:col-span-6 flex justify-between flex-col sm:flex-row">
          <div class="mb-4 sm:mb-0">
            <h2 class="block text-sm font-medium text-gray-900">
              Reset this project
            </h2>
            <p class="mt-1 text-xs text-gray-500">Resetting a project will remove any data collected, there is no going back. Please be certain.</p>
          </div>
          <button on:click={ () => getModal("reset").open() } type="button" class="max-w-max inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700 active:bg-red-500 transition-colors">
            Reset project
          </button>
        </div>

        <hr class="sm:col-span-6">
        
        <div class="sm:col-span-6 flex justify-between flex-col sm:flex-row">
          <div class="mb-4 sm:mb-0">
            <h2 class="block text-sm font-medium text-gray-900">
              Remove app from project
            </h2>
            <p class="mt-1 text-xs text-gray-500">Once you delete a app, there is no going back. Please be certain.</p>
          </div>
          <button on:click={ () => getModal("remove-app").open() } type="button" class="max-w-max inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700 active:bg-red-500 transition-colors">
            Remove app
          </button>
        </div>

        <hr class="sm:col-span-6">
        
        <div class="sm:col-span-6 flex justify-between flex-col sm:flex-row">
          <div class="mb-4 sm:mb-0">
            <h2 class="block text-sm font-medium text-gray-900">
              Archive this project
            </h2>
            <p class="mt-1 text-xs text-gray-500">Mark this repository as archived and read-only. All API endpoints will be disabled.</p>
          </div>
          <button on:click={ () => getModal("archive").open() } type="button" class="max-w-max inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700 active:bg-red-500 transition-colors">
            Archive project
          </button>
        </div>

        <hr class="sm:col-span-6">
        
        <div class="sm:col-span-6 flex justify-between flex-col sm:flex-row">
          <div class="mb-4 sm:mb-0">
            <h2 class="block text-sm font-medium text-gray-900">
              Delete this project
            </h2>
            <p class="mt-1 text-xs text-gray-500">Once you delete a project, there is no going back. Please be certain.</p>
          </div>
          <button 
            on:click={ () => getModal("delete").open() } 
            type="button" 
            class="max-w-max inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700 active:bg-red-500 transition-colors"
          >
            Delete project
          </button>
        </div>
      </div>

      <p class="text-sm text-gray-500 sm:col-span-6">This project was created on <time datetime={ $query.data?.project?.createdAt }>{ new Date($query.data?.project?.createdAt).toLocaleString() }</time>.</p>
    </div>

    <div class="pt-8 flex justify-end">
      <button type="button" class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        Cancel
      </button>
      <button 
        type="submit" 
        disabled={ !isFormValid || !($dirty.name || $dirty.bio || $dirty.alias || $dirty.description || $dirty.url) } 
        class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-opacity-40 disabled:cursor-not-allowed"
      >
        Save
      </button>
    </div>
  </form>
</div>

<Modal id="reset">
  <div class="sm:flex sm:items-start">
    <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
      <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
      <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
        Reset project
      </h3>
      <div class="mt-2">
        <p class="text-sm text-gray-500">
          Are you sure you want to reset your project? All of your metrics will be permanently removed from the database forever. This action cannot be undone.
          <br /><br />
          Your apps won't be removed by this action.
        </p>
      </div>
      <div class="mt-4">
        <label for="confirm-reset" class="block text-sm font-medium text-gray-700">Please type <strong>{ $query.data?.project?.name }</strong> to confirm.</label>
        <div class="mt-1">
          <input bind:value={ confirmAction } type="text" name="confirm-reset" id="confirm-reset" class="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md">
        </div>
      </div>
    </div>
  </div>
  <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
    <button on:click={ () => resetProject() } disabled={ confirmAction !== $query.data?.project?.name } type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-opacity-40 disabled:cursor-not-allowed">
      Reset project
    </button>
    <button on:click={ () => closeModal("reset") } type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
      Cancel
    </button>
  </div>
</Modal>

<Modal id="remove-app">
  <form>
    <div class="sm:flex sm:items-start">
      <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
        <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
          Remove app
        </h3>
        <div class="mt-2">
          <p class="text-sm text-gray-500">
            The app and its corresponding metrics will be completely removed from the project.
            <br /><br />
            <strong>This action cannot be undone.</strong>
          </p>
        </div>
        <div class="mt-4">
          <label for="apps" class="block text-sm font-medium text-gray-700">App</label>
          <select bind:value={ appToRemove } id="apps" name="apps" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
            <option value="" disabled selected>Not selected</option>
            {#each $query.data?.project?.app ?? [] as app}
            <option value={ app._id }>{ app.name } <span class="text-gray-700">- { app.type }</span></option>
            {/each}
          </select>
        </div>
        <div class="mt-4">
          <label for="confirm-remove-apps" class="block text-sm font-medium text-gray-700">Please type <strong>{ $query.data?.project?.name }</strong> to confirm.</label>
          <div class="mt-1">
            <input bind:value={ confirmAction } type="text" name="confirm-remove-apps" id="confirm-remove-apps" class="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md">
          </div>
        </div>
      </div>
    </div>
    <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
      <button on:click={ () => removeApp() } disabled={ confirmAction !== $query.data?.project?.name || !appToRemove } type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-opacity-40 disabled:cursor-not-allowed">
        Remove app
      </button>
      <button on:click={ () => closeModal("remove-app") } type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
        Cancel
      </button>
    </div>
  </form>
</Modal>

<Modal id="archive">
  <div class="sm:flex sm:items-start">
    <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
      <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
      <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
        Archive project
      </h3>
      <div class="mt-2">
        <p class="text-sm text-gray-500">
          Are you sure you want to archive your project? The project will become read-only and won't receive new metrics anymore.
          <br /><br />
          You can unarchive it at any time.
        </p>
      </div>
      <div class="mt-4">
        <label for="confirm-archive" class="block text-sm font-medium text-gray-700">Please type <strong>{ $query.data?.project?.name }</strong> to confirm.</label>
        <div class="mt-1">
          <input bind:value={ confirmAction } type="text" name="confirm-archive" id="confirm-archive" class="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md">
        </div>
      </div>
    </div>
  </div>
  <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
    <button on:click={ () => archiveProject() } disabled={ confirmAction !== $query.data?.project?.name } type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-opacity-40 disabled:cursor-not-allowed">
      Archive project
    </button>
    <button on:click={ () => closeModal("archive") } type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
      Cancel
    </button>
  </div>
</Modal>

<Modal id="delete">
  <div class="sm:flex sm:items-start">
    <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
      <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
      <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
        Delete project
      </h3>
      <div class="mt-2">
        <p class="text-sm text-gray-500">
          Are you sure you want to delete your project? This will permanently delete the project and everything associated with it, including apps, metrics and anything else.
          <br /><br />
          <strong>This action cannot be undone.</strong>
        </p>
      </div>
      <div class="mt-4">
        <label for="confirm-delete" class="block text-sm font-medium text-gray-700">Please type <strong>{ $query.data?.project?.name }</strong> to confirm.</label>
        <div class="mt-1">
          <input bind:value={ confirmAction } type="text" name="confirm-delete" id="confirm-delete" class="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md">
        </div>
      </div>
    </div>
  </div>
  <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
    <button on:click={ () => deleteProject() } disabled={ confirmAction !== $query.data?.project?.name } type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-opacity-40 disabled:cursor-not-allowed">
      Delete project
    </button>
    <button on:click={ () => closeModal("delete") } type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
      Cancel
    </button>
  </div>
</Modal>