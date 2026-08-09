<script setup>
defineProps({
  text: { type: String, required: true }
})
</script>

<template>
  <span class="tag">#{{ text }}</span>
</template>

<style scoped>
.tag {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  color: var(--text-soft);
  background: var(--bg-sunken);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
}
</style>
