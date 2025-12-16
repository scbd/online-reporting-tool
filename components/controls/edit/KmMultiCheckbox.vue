<template>
    <div class="km-multi-checkbox flex flex-col items-start justify-center w-64 border-2 p-8 rounded-lg">      
        <km-checkbox :id="`${option[optionValueField]}_${uid}`" v-for="option in options" :key="option"
            :checked="modelValue && modelValue.find(e=>e[optionValueField] == option[optionValueField])"
            @update:checked="check(option[optionValueField], $event)"> 
            {{ lstring(option[optionTitleField]) }}
        </km-checkbox>
    </div>
  </template>
  
  <script lang="ts">
//@ts-nocheck
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
        validator: (modelValue, props) => {
          const hasNameKey = modelValue.every((option) =>
            Object.keys(option).includes(props.optionValueField)
          );
          const hasIdKey = modelValue.every((option) =>
            Object.keys(option).includes(props.optionTitleField)
          );
          return hasNameKey && hasIdKey;
        },
      },
      optionValueField: {
        type:String,
        default:'identifier'
      },
      optionTitleField: {
        type:String,
        default:'title'
      }
    },
    setup(props, context) {
      const attrs = useAttrs();
      const check = (optionId, checked) => {
        let updatedValue = [...props.modelValue||[]];
        if (checked) {
          updatedValue.push({[props.optionValueField] : optionId});
        } else {
          const index = updatedValue.findIndex(item=>item[props.optionValueField] == optionId);
          if (index > -1)
            updatedValue.splice(index, 1);
        }
        context.emit("update:modelValue", updatedValue);
      };

      const uid = useGenerateUUID();
  
      return {
        check, uid
      };
    },
    components: {
      "check-box": Checkbox,
    }
  };
  </script>
  