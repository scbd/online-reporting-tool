<template>
    <template v-if="question">

        <km-form-group :name="question?.key" :required="question.mandatory && question.enabled" class="mb-0">
            <template #caption>
                <slot>
                    {{ question?.number }} {{ question?.title }}
                </slot>
                <button class="ms-3 btn btn-danger btn-sm float-end" v-if="model"
                    @click="model = undefined">{{ t('clear') }}</button>
            </template>
        </km-form-group>

        <div class="question-options ms-3 vld-parent">
            <overlay-loading :active="!enabled" background-color="rgb(9 9 9)" :opacity="0.1"
                :is-full-page="false">
                &nbsp;
            </overlay-loading>
            <div v-if="question.type == 'option'">
                <km-form-group v-if="question?.options" class="mb-0">
                    <km-form-check-item v-for="option in question?.options" :key="option.value" type="radio"
                        :name="'option_' + question.key" :for="'option_' + question.key + '_' + option.value"
                        :id="'option_' + question.key + '_' + option.value" :value="option.value" v-model="model"
                        :label="lstring(option.title, locale)" />
                </km-form-group>
            </div>
            <div v-else-if="question.type == 'checkbox' && question?.options">
                <km-multi-checkbox v-model="multiOptionModel" option-value-field="value"
                    :options="question?.options">
                </km-multi-checkbox>
            </div>
            <div v-else-if="question.type == 'string'">
                <input :id="question?.key" :placeholder="question?.title" class="form-control" v-model="model"
                    type="textbox" />
            </div>
        </div>
    </template>
</template>
<i18n src="@/i18n/dist/components/controls/km-question.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
import OverlayLoading from 'vue3-loading-overlay';
const model = defineModel<String | Object>();

const props = defineProps({
    question: { type: Object as PropType<Question> },
    enabled: { type: Boolean, default: true }
})
const { question, enabled } = toRefs(props);

const multiOptionModel = computed({
    get() {
        if (Array.isArray(model.value))
            return model.value?.map(e => { return { value: e } });

        return model.value
    },
    set(values) {
        if (Array.isArray(values))
            model.value = values?.map(e => e.value);
        else
            model.value = values;
    }
});

watch(() => props.enabled, (newVal) => {
    if (!newVal) {
        //clear model if question is disabled
        model.value = undefined;
    } 
});
const { t, locale } = useI18n()
</script>