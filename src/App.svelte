<script>
  import { scale } from 'svelte/transition'

  import Loading from './Loading.svelte'
  import Faq from './Faq.svelte'

  const URL = 'https://sprucehealthgroup.com/wp-json/wp/v2/'
  const FAQ_CATS = 'faq-cats'
  const FAQS_BY_CAT = 'faqs?faq-cats'

  let items = []
  let isLoaded = false

  const sortBySlug = arr => arr.sort((a, b) => (a.slug > b.slug ? 1 : -1))

  const setItems = (category, categoriesLength, faqs) => {
    items = [
      ...items,
      {
        slug: category.slug,
        name: category.name,
        faqs,
      },
    ]

    return new Promise(resolve => items.length === categoriesLength && resolve(items))
  }

  const getFaqs = (category, categoriesLength) => {
    fetch(`${URL}${FAQS_BY_CAT}=${category.id}`)
      .then(res => res.json())
      .then(faqs => setItems(category, categoriesLength, faqs))
      .then(items => sortBySlug(items))
      .catch(error => console.log('getFaqs:', error))
      .finally(() => (isLoaded = true && window.dispatchEvent(new CustomEvent('csrend'))))
  }

  const getCategories = () => {
    fetch(URL + FAQ_CATS)
      .then(res => res.json())
      .then(categories => categories.forEach(category => getFaqs(category, categories.length)))
      .catch(error => console.log('getCategories:', error))
  }
</script>

<svelte:window on:csrend={() => console.log('I am finished loading')} />

<div use:getCategories>
  {#if isLoaded}
    <div in:scale>
      {#each items as { name, faqs }}
        <h2>{name}</h2>
        {#each faqs as faq}
          <Faq {faq} />
        {/each}
      {/each}
    </div>
  {:else}
    <Loading />
  {/if}
</div>
