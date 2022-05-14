<script>
  import { scale } from 'svelte/transition'
  import Faq from './Faq.svelte'

  export let items
</script>

<div in:scale>
  {#each items as { name, faqs }}
    <h2>{name}</h2>
    {#each faqs as faq}
      <Faq {faq} />
    {/each}
  {/each}
</div>
