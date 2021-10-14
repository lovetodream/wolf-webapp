<!-- TODO: PIN Stuff -->

<script lang="ts">
import { gqlGetProjectSecuritySettings, GqlGetSingleProjectDoc, gqlUpdateProjectSecuritySettings } from '@/generated/graphql';
import { currentProjectID } from '@/stores';
import { addNotification } from '@/components/NotificationWrapper.svelte';

import { formula } from 'svelte-formula';
import { get } from 'svelte/store';

const { form, formValues, validity } = formula()
  
let strictMode = false
let recoveryEmail = ""
let pinRequired = false
let confirmationPin: number | null = null

const projectID = get(currentProjectID);
const query = gqlGetProjectSecuritySettings({ variables: { id: projectID } })

query.subscribe((resp) => {
  const project = resp.data.project

  if (project) {
    strictMode = project.strictMode
    recoveryEmail = project.recoveryEmail
    pinRequired = project.pin
  }
})

function saveChanges(_: Event) {
  if (pinRequired && !confirmationPin) {
    // TODO: pin popup
  }

  gqlUpdateProjectSecuritySettings({ 
    variables: { 
      id: projectID, 
      strictMode, 
      recoveryEmail, 
      pin: confirmationPin
    },
    refetchQueries: [{
      query: GqlGetSingleProjectDoc,
      variables: { id: projectID }
    }]
  })
  .then((res) => {
    confirmationPin = null

    if (!res.errors) {
      addNotification("success", "Successfully saved security settings!", "The security settings about the project was successfully overwritten.")
      return
    }

    throw new Error();
  })
  .catch((_) => {
    confirmationPin = null

    addNotification("danger", "An error occured!", "Try saving the settings again or report an issue.")
  })
}
</script>

<div class="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
  <h1 class="text-3xl font-extrabold text-gray-900">Security</h1>

  <form use:form on:submit|preventDefault={ saveChanges } class="mt-6 space-y-8 divide-y divide-y-gray-200">
    <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
      <div class="sm:col-span-6">
        <h2 class="text-xl font-medium text-gray-900">Endpoints</h2>
        <p class="mt-1 text-sm text-gray-500">Protect the API endpoints with the options below.</p>
      </div>

      <div class="sm:col-span-6 flex items-center justify-between">
        <span class="flex-grow flex flex-col">
          <span class="text-sm font-medium text-gray-900" id="availability-label">Strict mode</span>
          <span class="text-sm text-gray-500" id="availability-description">Allows only predefined types of signal and blocks any other incoming signals.</span>
        </span>
        <button type="button" on:click={ () => strictMode = !strictMode } class="{ strictMode ? "bg-blue-600" : "bg-gray-200" } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" role="switch" aria-checked="false" aria-labelledby="availability-label" aria-describedby="availability-description">
          <span aria-hidden="true" class="{ strictMode ? "translate-x-5" : "translate-x-0" } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
        </button>
      </div>
    </div>

    <div class="pt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
      <div class="sm:col-span-6">
        <h2 class="text-xl font-medium text-gray-900">Project</h2>
        <p class="mt-1 text-sm text-gray-500">Settings related to the projects security</p>
      </div>

      <div class="sm:col-span-4">
        <label for="recovery-email" class="block text-sm font-medium text-gray-700">Recovery email</label>
        <div class="mt-1">
          <input bind:value={ recoveryEmail } type="email" name="recovery-email" id="recovery-email" class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="recovery@example.com" aria-describedby="recovery-email-description">
        </div>
        <p class="mt-2 text-sm text-gray-500" id="recovery-email-description">This email will be used exclusivly for recovering your projects pin.</p>
      </div>

      <div class="sm:col-span-2 sm:text-right">
        <span class="block text-sm font-medium text-gray-700">&#8203;</span>
        <button disabled={ !recoveryEmail } type="button" class="mt-1 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-opacity-40 disabled:cursor-not-allowed">
          Configure PIN-Code
        </button>
        <p class="mt-2 text-sm text-gray-500" class:opacity-0={ !!recoveryEmail && !!$validity["recovery-email"].valid }>You need to add a recovery email before setting a pin.</p>
      </div>
    </div>

    <div class="pt-8 flex justify-end">
      <button type="button" class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        Cancel
      </button>
      <button type="submit" class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Save</button>
    </div>
  </form>
</div>