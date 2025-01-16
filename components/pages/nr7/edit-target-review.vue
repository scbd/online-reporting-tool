<template>
  <form>
    <div class="card">
      <div class="card-body">
        <div class="form-group">
          <label for="exampleFormControlSelect1">{{t('globalTarget')}}</label>
          <strong>{{t('globalTarget1')}}</strong>
        </div>
        <div class="form-group">
          <label for="exampleInputEmail1"
            >{{t('explainBrieflyThisTarget')}}</label
          >
          <ckeditor></ckeditor>
        </div>

        <div class="form-group">
          <label for="targetProgress"
            >{{t('indicateTheCurrentLevelOfProgress')}}</label
          >
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="targetProgress1"
            />
            <label class="form-check-label" for="targetProgress1"
              >{{t('onTrackToAchieveTarget')}}</label
            >
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="targetProgress2"
            />
            <label class="form-check-label" for="targetProgress2"
              >{{t('progressTowardsTarget')}}</label
            >
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="targetProgress3"
            />
            <label class="form-check-label" for="targetProgress3"
              >{{t('noSignificantProgress')}}
            </label>
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="targetProgress4"
            />
            <label class="form-check-label" for="targetProgress4"
              >{{t('movingAwayFromTarget')}}
            </label>
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="targetProgress5"
            />
            <label class="form-check-label" for="targetProgress5"
              >{{t('unknown')}}
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="targetProgress"
            >{{t('headlineIndicator')}}</label
          >
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="headlineIndicator1"
            />
            <label class="form-check-label" for="headlineIndicator1"
              >{{t('useNationalDataSet')}}
            </label>
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="headlineIndicator2"
            />
            <label class="form-check-label" for="headlineIndicator2"
              >{{t('useAvailableData')}}</label
            >
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="headlineIndicator3"
            />
            <label class="form-check-label" for="headlineIndicator3"
              >{{t('noDataAvailable')}}
            </label>
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="headlineIndicator4"
            />
            <label class="form-check-label" for="headlineIndicator4"
              >{{t('notRelevant')}}
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="exampleInputEmail1"
            >{{t('provideReferencesToMetadata')}}</label
          >
          <ckeditor></ckeditor>
        </div>
        <div class="form-group">
          <label for="exampleInputEmail1"
            >{{t('complementaryIndicators')}}</label
          >
          <ckeditor></ckeditor>
        </div>

        <div class="form-group">
          <label for="targetProgress"
            >{{t('currentLevelOfYourCountry')}}</label
          >
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="targetProgress1"
            />
            <label class="form-check-label" for="targetProgress1"
              >{{t('onTrackToAchieveTarget')}}</label
            >
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="targetProgress2"
            />
            <label class="form-check-label" for="targetProgress2"
              >{{t('progressTowardsTarget')}}</label
            >
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="targetProgress3"
            />
            <label class="form-check-label" for="targetProgress3"
              >{{t('noSignificantProgress')}}
            </label>
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="targetProgress4"
            />
            <label class="form-check-label" for="targetProgress4"
              >{{t('movingAwayFromTarget')}}
            </label>
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="targetProgress5"
            />
            <label class="form-check-label" for="targetProgress5"
              >{{t('unknown')}}
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="exampleInputEmail1"
            >{{t('examplesOrCasesToIllustrate')}}
          </label>
          <ckeditor></ckeditor>
        </div>

        <div class="form-group">
          <label for="exampleInputEmail1"
            >{{t('describeImplementationOfThisNationalTarget')}}</label
          >
          <ckeditor></ckeditor>
        </div>

        <div class="form-group">
          <label for="exampleInputEmail1"
            >{{t('summaryOProgress')}}
          </label>
          <ckeditor></ckeditor>
        </div>
      </div>
    </div>
  </form>
</template>
<i18n src="@/i18n/dist/components/pages/nr7/edit-target-review.json"></i18n>
<script lang="ts">
//@ts-nocheck
export default {
  components: {
    Ckeditor,
  },
  name: 'EditTargetReview',
  data() {
    return {
      document: {},
    }
  },
  setup(){
          const { t } = useI18n();
          return { t };
      },
  methods: {
    submitDocument() {},
  },
}
</script>
