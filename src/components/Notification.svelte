<script lang="ts">
import { Kind, notifications } from '@/stores';

import Transition from 'svelte-class-transition';
import { get } from 'svelte/store';

export let visible: boolean;
export let kind: Kind;
export let index: number;

function toggleVisibility() {
  visible = !visible;
  const currentNotifications = get(notifications)
  const currentNotification = currentNotifications[index]
  currentNotifications[index] = { visible: visible, kind: currentNotification.kind, headline: currentNotification.headline, subheadline: currentNotification.subheadline }
}
</script>

<Transition 
  toggle={ visible } 
  inTransition="transform ease-out duration-300 transition" 
  outTransition="transition ease-in duration-100" 
  inState="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" 
  onState="translate-y-0 opacity-100 sm:translate-x-0" 
  outState="opacity-0"
>
  <div class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
    <div class="p-4">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          {#if kind === "success"}
          <i class="!h-6 !w-6 text-green-400 fal fa-check-circle"></i>
          {/if}
          {#if kind === "warning"}
          <i class="!h-6 !w-6 text-yellow-400 fal fa-exclamation-circle"></i>
          {/if}
          {#if kind === "danger"}
          <i class="!h-6 !w-6 text-red-400 fal fa-exclamation-triangle"></i>
          {/if}
        </div>
        <div class="ml-3 w-0 flex-1 pt-0.5">
          <p class="text-sm font-medium text-gray-900">
            <slot name="headline" />
          </p>
          <p class="mt-1 text-sm text-gray-500">
            <slot name="subheadline" />
          </p>
        </div>
        <div class="ml-4 flex-shrink-0 flex">
          <button on:click={ toggleVisibility } class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span class="sr-only">Close</span>
            <!-- Heroicon name: solid/x -->
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</Transition>