<template>
    <div class="km-multi-checkbox flex flex-col items-start justify-center w-64 border-2 p-8 rounded-lg">
        <!-- <check-box
            v-for="option in options"
            :checked="modelValue && modelValue.find(e=>e.identifier==option.identifier)"
            @update:checked="check(option.identifier, $event)"
            :fieldId="option.identifier"
            :label="lstring(option.title)"
            :key="option"
        /> -->
        <div class="form-check" v-for="option in options" :key="option" >
            <input type="checkbox" :id="option[optionValueField]" 
                class="form-check-input" 
                :checked="modelValue && modelValue.find(e=>e[optionValueField] == option[optionValueField])"
                @click="check(option[optionValueField], $event)">
            <label :for="option[optionValueField]" class="form-check-label" >
                <slot name="label" :option="option">
                   {{ lstring(option[optionTitleField]) }}
                </slot>
            </label>
        </div>
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
      const check = (optionId, $event) => {
        let updatedValue = [...props.modelValue||[]];
        const checked = $event?.srcElement?.checked;
        if (checked) {
          updatedValue.push({[props.optionValueField] : optionId});
        } else {
          updatedValue.splice(updatedValue.indexOf({[props.optionValueField] :optionId}), 1);
        }
        console.log(updatedValue)
        context.emit("update:modelValue", updatedValue);
      };
  
      return {
        check
      };
    },
    components: {
      "check-box": Checkbox,
    }
  };
  </script>
  