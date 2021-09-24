<script>
import Footer from '@/components/Footer.svelte';
import "../app.postcss";
</script>

<div class="flex flex-col justify-between min-h-screen">
  <slot></slot>
  
  <Footer />
</div>