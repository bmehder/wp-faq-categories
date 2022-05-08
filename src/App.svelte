<script>
  import Loading from './Loading.svelte'
  import Faq from './Faq.svelte'

  const URL = 'https://sprucehealthgroup.com/wp-json/wp/v2/'

  let items = []
  let isLoading = true

  const displayItems = numberOfCategories =>
    numberOfCategories === items.length && (isLoading = false)

  const setItems = (faqs, category, numberOfCategories) => {
    const sortBySlug = (a, b) => (a.slug > b.slug ? 1 : -1)

    items = [
      ...items,
      {
        slug: category.slug,
        name: category.name,
        faqs,
      },
    ].sort(sortBySlug)

    displayItems(numberOfCategories)
  }

  const getFaqs = (category, numberOfCategories) => {
    fetch(URL + 'faqs?faq-cats=' + category.id)
      .then(res => res.json())
      .then(faqs => setItems(faqs, category, numberOfCategories))
  }

  const getCategories = (_, route) => {
    fetch(URL + route)
      .then(res => res.json())
      .then(categories => {
        const numberOfCategories = categories.length
        categories.forEach(category => getFaqs(category, numberOfCategories))
      })
  }
</script>

<div use:getCategories={'faq-cats'}>
  {#if !isLoading}
    {#each items as item}
      <h2>{item.name}</h2>
      {#each item.faqs as faq}
        <Faq {faq} />
      {/each}
    {/each}
  {:else}
    <Loading />
  {/if}
</div>
