<script>
  import { scale } from 'svelte/transition'
  import Loading from './Loading.svelte'
  import Faq from './Faq.svelte'

  const URL = 'https://sprucehealthgroup.com/wp-json/wp/v2/'

  let items = []
  let isLoading = true

  const displayItems = () => (isLoading = false)

  const sortItems = () => items.sort((a, b) => (a.slug > b.slug ? 1 : -1))

  const setItems = (faqs, category, categoriesLength) => {
    items = [
      ...items,
      {
        slug: category.slug,
        name: category.name,
        faqs,
      },
    ]

    items.length === categoriesLength && sortItems() && displayItems()
  }

  const getFaqs = (category, categoriesLength) => {
    fetch(URL + 'faqs?faq-cats=' + category.id)
      .then(res => res.json())
      .then(faqs => setItems(faqs, category, categoriesLength))
  }

  const getCategories = () => {
    fetch(URL + 'faq-cats')
      .then(res => res.json())
      .then(categories => {
        const categoriesLength = categories.length
        categories.forEach(category => getFaqs(category, categoriesLength))
      })
  }
</script>

<div use:getCategories>
  {#if !isLoading}
    <div in:scale>
      {#each items as item}
        <h2>{item.name}</h2>
        {#each item.faqs as faq}
          <Faq {faq} />
        {/each}
      {/each}
    </div>
  {:else}
    <Loading />
  {/if}
</div>
