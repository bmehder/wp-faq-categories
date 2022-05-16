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

  const fetchData = options =>
    fetch(options.endpoint)
      .then(responseCb)
      .then(options.dataCb)
      .catch(errorCb)
      .finally(options.finallyCb)

  const getFaqsByCategory = (category, numberOfCategories) => {
    const finallyCb = () => isFinished() && sortByProp(items, 'slug') && setIsLoaded()

    const setIsLoaded = () => (isLoaded = true)

    const compareSortOrderByProp = prop => (a, b) => a[prop] > b[prop] ? 1 : -1

    const sortByProp = (array, prop) => array.sort(compareSortOrderByProp(prop))

    const isFinished = () => items.length === numberOfCategories

    const setItems = ({ slug, name }, faqs) => (items = [...items, { slug, name, faqs }])

    const dataCb = faqs => setItems(category, faqs)

    const endpoint = `${BASE_URL}${FAQS_BY_CAT}=${category.id}`

    const options = {
      endpoint,
      dataCb,
      finallyCb,
    }

    fetchData(options)
  }

  const getFaqCategories = () => {
    const loop = data => category => getFaqsByCategory(category, data.length)

    const dataCb = data => data.map(loop(data))

    const endpoint = `${BASE_URL}${FAQ_CATS}`

    const options = {
      endpoint,
      dataCb,
    }

    fetchData(options)
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
