<script lang="ts">
import { gqlGetSingleProject } from '@/generated/graphql';
import { currentProjectID } from '@/stores';
import { get } from 'svelte/store';

$: query = gqlGetSingleProject({ variables: { id: get(currentProjectID) } })
</script>

{ $currentProjectID }

{ JSON.stringify($query.data.project) }
