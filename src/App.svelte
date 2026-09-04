<script lang="ts">
  let count = $state(0);
</script>

<main>
  <h1>Gym App</h1>
  <p>Scaffold 上線。這是 rebuild 的起點，之後會被 §5 P0 的記錄主流程取代。</p>
  <button onclick={() => (count += 1)}>已點擊 {count} 次</button>
</main>

<style>
  main {
    max-width: 480px;
    margin: 0 auto;
    padding: 2rem 1rem;
    font-family: system-ui, sans-serif;
    text-align: center;
  }

  button {
    margin-top: 1rem;
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #444;
    background: #1a1a1a;
    color: #fff;
  }
</style>
