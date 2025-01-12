<template>
  <div class="input-wrapper" :class="{ error: !!errorMessage }">
    <label v-if="label" :for="id" class="input-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    
    <div class="input-container">
      <textarea
        v-if="type === 'textarea'"
        :id="id"
        v-model="inputValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :rows="rows"
        class="input-field textarea"
        @input="onInput"
        @blur="onBlur"
      ></textarea>
      
      <select
        v-else-if="type === 'select'"
        :id="id"
        v-model="inputValue"
        :disabled="disabled"
        class="input-field select"
        @change="onInput"
        @blur="onBlur"
      >
        <option value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in normalizedOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      
      <input
        v-else
        :id="id"
        v-model="inputValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        class="input-field"
        @input="onInput"
        @blur="onBlur"
      >

      <div v-if="type === 'select'" class="select-arrow"></div>
    </div>

    <div v-if="errorMessage" class="error-text" role="alert">
      {{ errorMessage }}
    </div>

    <div v-if="helperText" class="helper-text">
      {{ helperText }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text',
    validator: value => ['text', 'textarea', 'number', 'email', 'password', 'select'].includes(value)
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  rows: {
    type: Number,
    default: 3
  },
  errorMessage: {
    type: String,
    default: ''
  },
  helperText: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substr(2, 9)}`
  },
  options: {
    type: Array,
    default: () => []
  },
  optionLabel: {
    type: String,
    default: 'label'
  },
  optionValue: {
    type: String,
    default: 'value'
  }
});

const emit = defineEmits(['update:modelValue', 'input', 'blur']);

const inputValue = ref(props.modelValue);

const normalizedOptions = computed(() => {
  return props.options.map(option => {
    if (typeof option === 'string') {
      return { label: option, value: option };
    }
    return {
      label: option[props.optionLabel] || '',
      value: option[props.optionValue] || ''
    };
  });
});

watch(() => props.modelValue, (newValue) => {
  if (newValue !== inputValue.value) {
    inputValue.value = newValue;
  }
});

function onInput(event) {
  const value = event.target.value;
  if (value !== props.modelValue) {
    emit('update:modelValue', value);
    emit('input', event);
  }
}

function onBlur(event) {
  emit('blur', event);
}
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.input-label {
  color: var(--text-color);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.required {
  color: var(--danger-color);
  margin-left: var(--spacing-xs);
}

.input-container {
  position: relative;
}

.input-field {
  width: 100%;
  padding: var(--spacing-sm);
  background: var(--input-background);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-color);
  font-size: var(--font-size-sm);
  transition: all 0.2s ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px var(--primary-color-alpha);
}

.input-field:disabled {
  background: var(--disabled-color);
  cursor: not-allowed;
  opacity: 0.7;
}

.select {
  appearance: none;
  padding-right: var(--spacing-xl);
  cursor: pointer;
}

.select-arrow {
  position: absolute;
  right: var(--spacing-sm);
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid var(--text-color);
  pointer-events: none;
}

.error .input-field {
  border-color: var(--danger-color);
}

.error-text {
  color: var(--danger-color);
  font-size: var(--font-size-xs);
}

.helper-text {
  color: var(--text-color);
  font-size: var(--font-size-xs);
  opacity: 0.7;
}
</style> 