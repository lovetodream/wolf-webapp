<script context="module" lang="ts">
import { get } from 'svelte/store';
import Notification from './Notification.svelte';
import { Kind, notifications } from '@/stores';

export function addNotification(kind: Kind, headline: string, subheadline: string) {
  const currentNotifications = get(notifications);
  currentNotifications.push({
    visible: true,
    kind,
    headline,
    subheadline
  });
  notifications.set(currentNotifications);
}
</script>

<script lang="ts">
import { onMount } from 'svelte';

let notificationWrapper: HTMLDivElement;

onMount(() => {
  document.body.appendChild(notificationWrapper);
})
</script>

<div bind:this={ notificationWrapper } aria-live="assertive" class="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start">
  <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
    {#each $notifications as message, i }
      <Notification visible={ message.visible } kind={ message.kind } index={ i }>
        <span slot="headline">{ message.headline }</span>
        <span slot="subheadline">{ message.subheadline }</span>
      </Notification>
    {/each}
  </div>
</div>