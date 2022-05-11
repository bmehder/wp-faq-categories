<script>
  import { slide } from 'svelte/transition'

  export let faq

  let isOpen = false

  const handleClick = () => (isOpen = !isOpen)
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
  />
</svelte:head>

<div class="faqs">
  <h3 class="question" on:click={handleClick} on:keypress={e => e.key === 'Enter' && handleClick()}>
    <span>{faq.title.rendered}</span>
    <i class:isOpen class="fa-solid fa-chevron-down" />
  </h3>
  {#if isOpen}
    <div class="answer" transition:slide>{@html faq.content.rendered}</div>
  {/if}
</div>

<style>
  .question {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    cursor: pointer;
  }
  .fa-chevron-down {
    transition: transform 400ms ease;
    transform-origin: center;
  }
  .isOpen {
    transform: rotate(180deg);
  }
</style>
