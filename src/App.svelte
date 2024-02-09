<script>
  import Router from 'svelte-spa-router'
  import HomePage from './HomePage.svelte'
  import Workspace from './Workspace.svelte'

  let routes = {
    '/': HomePage,
    '/workspace': Workspace
  }
</script>

<Router {routes} />