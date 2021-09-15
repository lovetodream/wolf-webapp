<script context="module" lang="ts">
  let highestModal
  const modals = {}

  export const getModal = (id: string = "") => {
    return modals[id]
  }
</script>

<script lang="ts">
import { onDestroy } from 'svelte'
import { fade } from 'svelte/transition';

let topDiv
let visible = false
let prevHighest
let closeCallback

export let id = ''

const keyPress = (ev: KeyboardEvent) => {
  if (ev.key === "Escape" && highestModal === topDiv) {
    close()
  }
} 

const open = (callback) => {
  closeCallback = callback
  
  if (visible) {
    return
  }

  prevHighest = highestModal
  highestModal = topDiv

  document.body.style.overflow = "hidden"

  visible = true

  document.body.appendChild(topDiv)
}

const close = (returnValue: any = null) => {
  if (!visible) {
    return
  }

  highestModal = prevHighest

  if (highestModal === null) {
    document.body.style.overflow = ""
  }

  visible = false

  if (closeCallback) {
    closeCallback(returnValue)
  }
}

modals[id] = { open, close }

onDestroy(() => {
  delete modals[id]
})
</script>

<svelte:window on:keydown="{keyPress}" />

<div id="modal-wrapper" class="fixed z-50 inset-0 overflow-y-auto { visible ? 'visible' : 'invisible' }" transition:fade bind:this={ topDiv } aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <div id="modal" class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" on:click="{ () => close() }" />

    <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

    <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
      <slot></slot>
    </div>
  </div>
</div>
