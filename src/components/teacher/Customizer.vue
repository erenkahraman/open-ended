<template>
  <div class="page-container">
    <div class="split-layout">
      <div class="panel">
        <SampleQuestionButtons 
          :is-loading="isLoading"
          @load-sample="loadSample"
          @reset="reset"
        />
        <QuestionEditor
          v-model="form"
          :validation="errors"
          :is-loading="isLoading"
          :selected-question-id="selectedId"
          @update:modelValue="handleFormUpdate"
        />
      </div>

      <div class="panel right">
        <PreviewSection
          :question="previewData"
          :can-assign="canSubmit && !isLoading"
          :is-loading="isLoading"
          @assign="assign"
        />
      </div>
    </div>

    <LoadingSpinner v-if="isLoading" message="Processing..." isOverlay />
  </div>
</template>

<script setup>
import { LoadingSpinner } from "../shared";
import SampleQuestionButtons from "./SampleQuestionButtons.vue";
import QuestionEditor from "./QuestionEditor.vue";
import PreviewSection from "./PreviewSection.vue";
import { useQuestionForm } from "../../composables/useQuestionForm";
import { useFormValidation } from "../../composables/useFormValidation";

const {
  form,
  isLoading,
  selectedId,
  previewData,
  handleFormUpdate,
  loadSample,
  reset,
  assign
} = useQuestionForm();

const { errors, canSubmit } = useFormValidation(form);
</script>

<style scoped>
.panel {
  display: grid;
  grid-template-rows: auto 1fr;
}
</style>