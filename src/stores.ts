import { writable } from 'svelte/store';

export type Kind = "success" | "warning" | "danger"

export const currentProjectID = writable(null)

export const notifications/*: Writable<Array<{
  visible: boolean;
  kind: Kind;
  headline: string;
  subheadline: string;
}>> */ = writable([])