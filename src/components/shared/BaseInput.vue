<template>
  <div class="input-wrapper" :class="{ error: !!errorMessage }">
    <label v-if="label" :for="id">{{ label }}<span v-if="required" class="required">*</span></label>
    <div class="input-container">
      <component
        :is="type === 'textarea' ? 'textarea' : type === 'select' ? 'select' : 'input'"
        :id="id"
        :value="modelValue"
        :type="type !== 'select' && type !== 'textarea' ? type : undefined"
        :placeholder="placeholder"
        :disabled="disabled"
        :rows="type === 'textarea' ? rows : undefined"
        class="input-field"
        :class="type"
        @input="$emit('update:modelValue', $event.target.value)"
      >
        <option v-if="type === 'select'" value="" disabled>{{ placeholder }}</option>
        <option v-for="opt in normalizedOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </component>
      <div v-if="type === 'select'" class="select-arrow" />
    </div>
    <div v-if="errorMessage" class="error-text">{{ errorMessage }}</div>
    <div v-if="helperText" class="helper-text">{{ helperText }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: { type: [String, Number], required: true, default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text', validator: v => ['text', 'textarea', 'number', 'email', 'password', 'select'].includes(v) },
  placeholder: { type: String, default: '' },
  required: Boolean,
  disabled: Boolean,
  rows: { type: Number, default: 3 },
  errorMessage: { type: String, default: '' },
  helperText: { type: String, default: '' },
  id: { type: String, default: () => `input-${Math.random().toString(36).slice(2, 9)}` },
  options: { type: Array, default: () => [] },
  optionLabel: { type: String, default: 'label' },
  optionValue: { type: String, default: 'value' }
});

defineEmits(['update:modelValue']);

const normalizedOptions = computed(() => 
  props.options.map(opt => typeof opt === 'string' ? { label: opt, value: opt } 
    : { label: opt[props.optionLabel] || '', value: opt[props.optionValue] || '' })
);
</script>

<style scoped>
.input-wrapper { display: flex; flex-direction: column; gap: 0.5rem; }
.input-container { position: relative; }
label { color: var(--text-color); font-size: 0.875rem; font-weight: 500; }
.required { color: var(--danger-color); margin-left: 0.25rem; }

.input-field {
  width: 100%;
  padding: 0.5rem;
  background: var(--input-background);
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  color: var(--text-color);
  font-size: 0.875rem;
  transition: all 0.2s;
}

.input-field:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 2px var(--primary-color-alpha); }
.input-field:disabled { background: var(--disabled-color); opacity: 0.7; cursor: not-allowed; }
.select { appearance: none; padding-right: 2rem; cursor: pointer; }

.select-arrow {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  border: 5px solid transparent;
  border-top-color: var(--text-color);
  pointer-events: none;
}

.error .input-field { border-color: var(--danger-color); }
.error-text { color: var(--danger-color); font-size: 0.75rem; }
.helper-text { color: var(--text-color); font-size: 0.75rem; opacity: 0.7; }
</style> 