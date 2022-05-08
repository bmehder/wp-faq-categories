import App from './App.svelte'

export default function (target, props, anchor = null) {
  new App({
    target,
    props,
    anchor,
  })
}
