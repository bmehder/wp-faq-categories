<script>
  import { scale } from 'svelte/transition'

  import Loading from './Loading.svelte'
  import Faq from './Faq.svelte'

  const URL = 'https://sprucehealthgroup.com/wp-json/wp/v2/'
  const FAQ_CATS = 'faq-cats'
  const FAQS_BY_CAT = 'faqs?faq-cats'

  let items = []
  let isLoaded = false

  const getFaqsByCategory = (category, numberOfCategories) => {
    const isFinished = () => items.length === numberOfCategories
    const setIsLoaded = () => (isLoaded = true)

    const compareSortOrderByProp = prop => (a, b) => a[prop] > b[prop] ? 1 : -1
    const sortByProp = (array, prop) => array.sort(compareSortOrderByProp(prop))

    const setItems = ({ slug, name }, faqs) => (items = [...items, { slug, name, faqs }])

    fetch(`${URL}${FAQS_BY_CAT}=${category.id}`)
      .then(res => res.json())
      .then(faqs => setItems(category, faqs))
      .catch(error => console.error(error))
      .finally(() => isFinished() && sortByProp(items, 'slug') && setIsLoaded())
  }

  const getCategories = () => {
    fetch(URL + FAQ_CATS)
      .then(res => res.json())
      .then(categories =>
        categories.map(category => getFaqsByCategory(category, categories.length))
      )
      .catch(error => console.error(error))
  }

  const init = () => getCategories()
</script>

<div use:init>
  {#if isLoaded}
    <div in:scale>
      {#each items as item}
        {@const { name, faqs } = item}
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
