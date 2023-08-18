<template>
    <div
      class="km-multi-checkbox flex flex-col items-start justify-center w-64 border-2 p-8 rounded-lg"
    >
      <check-box
        v-for="option in options"
        :checked="modelValue && modelValue.includes(option.identifier)"
        @update:checked="check(option.identifier, $event)"
        :fieldId="option.identifier"
        :label="lstring(option.title)"
        :key="option"
      />
    </div>
  </template>
  
  <script>
  import Checkbox from "./KmCheckbox.vue";
  
  export default {
    emits: ["update:modelValue"],
    props: {
      modelValue: {
        type: Array,
        required: true,
      },
      options: {
        type: Array,
        required: true,
        validator: (modelValue) => {
          const hasNameKey = modelValue.every((option) =>
            Object.keys(option).includes("title")
          );
          const hasIdKey = modelValue.every((option) =>
            Object.keys(option).includes("identifier")
          );
          return hasNameKey && hasIdKey;
        },
      },
    },
    setup(props, context) {
      const check = (optionId, checked) => {
        let updatedValue = [...props.modelValue||[]];
        if (checked) {
          updatedValue.push({identifier : optionId});
        } else {
          updatedValue.splice(updatedValue.indexOf({identifier :optionId}), 1);
        }
        context.emit("update:modelValue", updatedValue);
      };
  
      return {
        check,
      };
    },
    components: {
      "check-box": Checkbox,
    },
    data(){
        return {
            tet : 'yes'
        }
    }
  };
  </script>
  