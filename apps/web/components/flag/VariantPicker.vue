<template>
  <div class="ts-variants">
    <p class="detail-label">Aspect ratio</p>
    <div class="ts-variants__grid">
      <button
        v-for="r in RATIOS"
        :key="r"
        type="button"
        class="ts-variants__item"
        :class="{ 'is-active': modelValue === r }"
        @click="$emit('update:modelValue', r)"
      >
        <div class="ts-variants__thumb icon-preview-bg">
          <img
            :src="svgUrl(r, cc)"
            :alt="r"
            class="ts-variants__img"
            :class="r === '1x1' ? 'is-square' : 'is-wide'"
          >
        </div>
        <span class="ts-variants__label">{{ r }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RATIOS, type Ratio } from "~/types/flag";

defineProps<{ cc: string; modelValue: Ratio }>();
defineEmits<{ "update:modelValue": [Ratio] }>();
const { svgUrl } = useRaster();
</script>
