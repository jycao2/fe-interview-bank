<script setup>
import { computed } from 'vue'

const props = defineProps({
  level: { type: String, required: true }
})

const styleMap = {
  简单: { color: 'var(--easy)', bg: 'var(--easy-bg)' },
  中等: { color: 'var(--medium)', bg: 'var(--medium-bg)' },
  困难: { color: 'var(--hard)', bg: 'var(--hard-bg)' }
}

const style = computed(() => styleMap[props.level] || styleMap.中等)
</script>

<template>
  <span class="diff-badge" :style="{ color: style.color, background: style.bg }">
    {{ level }}
  </span>
</template>

<style scoped>
.diff-badge {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  padding: 3px 8px;
  border-radius: 999px;
  white-space: nowrap;
}
</style>
