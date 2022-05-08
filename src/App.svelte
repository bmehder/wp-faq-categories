<script>
  import { scale } from 'svelte/transition'

  import Loading from './Loading.svelte'
  import Faq from './Faq.svelte'

  const URL = 'https://sprucehealthgroup.com/wp-json/wp/v2/'
  const FAQ_CATS = 'faq-cats'
  const FAQS_BY_CATS = 'faqs?faq-cats'

  let items = []
  let isLoaded = false

  const displayItems = () => (isLoaded = true)

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
    fetch(`${URL}${FAQS_BY_CATS}=${category.id}`)
      .then(res => res.json())
      .then(faqs => setItems(faqs, category, categoriesLength))
      .catch(error => console.log('getFaqs:', error))
  }

  const getCategories = () => {
    fetch(URL + FAQ_CATS)
      .then(res => res.json())
      .then(categories => {
        const categoriesLength = categories.length
        categories.forEach(category => getFaqs(category, categoriesLength))
      })
      .catch(error => console.log('getCategories:', error))
  }
</script>

<div use:getCategories>
  {#if isLoaded}
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
