<template>
  <section class="group">
    <header class="group__head">
      <h3 class="group__title">
        <slot name="title" />
      </h3>
      <button
        v-if="$slots.more"
        class="group__more"
        type="button"
        @click="$emit('more', $event)"
      >
        <slot name="more" />
      </button>
    </header>
    <div class="group__body">
      <slot />
    </div>
  </section>
</template>

<script setup>
defineEmits(['more'])
</script>

<style scoped>
.group {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  padding: 14px 14px 16px;
}

.group__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.group__title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
}

.group__more {
  font-size: 12px;
  color: var(--text-sub);
  background: transparent;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  transition: color 0.18s;
}

.group__more:active {
  color: var(--primary-dark);
}
</style>
