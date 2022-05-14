<script>
  import Loading from './Loading.svelte'
  import Items from './Items.svelte'

  const BASE_URL = 'https://sprucehealthgroup.com/wp-json/wp/v2/'
  const FAQ_CATS = 'faq-cats'
  const FAQS_BY_CAT = 'faqs?faq-cats'

  let items = []
  let isLoaded = false

  const responseCb = res => res.json()
  const errorCb = error => console.error(error)

  const getFaqsByCategory = (category, numberOfCategories) => {
    const endpoint = `${BASE_URL}${FAQS_BY_CAT}=${category.id}`

    const isFinished = () => items.length === numberOfCategories

    const compareSortOrderByProp = prop => (a, b) => a[prop] > b[prop] ? 1 : -1

    const sortByProp = (array, prop) => array.sort(compareSortOrderByProp(prop))

    const setItems = ({ slug, name }, faqs) => (items = [...items, { slug, name, faqs }])

    const setIsLoaded = () => (isLoaded = true)

    const dataCb = faqs => setItems(category, faqs)

    const finallyCb = () => isFinished() && sortByProp(items, 'slug') && setIsLoaded()

    fetch(endpoint).then(responseCb).then(dataCb).catch(errorCb).finally(finallyCb)
  }

  const getFaqCategories = () => {
    const endpoint = BASE_URL + FAQ_CATS

    const loop = data => category => getFaqsByCategory(category, data.length)

    const dataCb = data => data.map(loop(data))

    fetch(endpoint).then(responseCb).then(dataCb).catch(errorCb)
  }

  const init = () => getFaqCategories()
</script>

<div use:init>
  {#if isLoaded}
    <Items {items} />
  {:else}
    <Loading />
  {/if}
</div>
