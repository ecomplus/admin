<template>
  <div class="ec-dashboard">
    <aside class="ec-dashboard__menu">
      <EcSidebar/>
    </aside>
    <article class="ec-dashboard__body">
      <header class="ec-dashboard__header">
        <div class="ec-dashboard__container">
          <EcHeader/>
        </div>
      </header>
      <main class="ec-dashboard__main">
        <div class="ec-dashboard__container">
          <!-- @slot Default slot for page content -->
          <slot/>
        </div>
      </main>
    </article>
  </div>
</template>

<script src="./index.js"></script>
<style lang="scss" src="./styles.scss"></style>
