<template>
  <form>
    <div class="card">
      <div class="card-body">
        <div class="form-group">
          <label for="exampleFormControlSelect1">Global Target</label>
          <strong>Global Target 1</strong>
        </div>
        <div class="form-group">
          <label for="exampleInputEmail1"
            >Please explain briefly how this target aligns with and will
            contribute to the attainment of the global target(s):</label
          >
          <ckeditor></ckeditor>
        </div>

        <div class="form-group">
          <label for="targetProgress"
            >Please indicate the current level of progress towards this/these
            national target(s).</label
          >
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="targetProgress1"
            />
            <label class="form-check-label" for="targetProgress1"
              >On track to achieve target</label
            >
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="targetProgress2"
            />
            <label class="form-check-label" for="targetProgress2"
              >Progress towards target but at an insufficient rate</label
            >
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="targetProgress3"
            />
            <label class="form-check-label" for="targetProgress3"
              >No significant progress
            </label>
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="targetProgress4"
            />
            <label class="form-check-label" for="targetProgress4"
              >Moving away from target
            </label>
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="targetProgress5"
            />
            <label class="form-check-label" for="targetProgress5"
              >Unknown
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="targetProgress"
            >Please provide the national value of the headline indicator(s)
            related to the global target.</label
          >
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="headlineIndicator1"
            />
            <label class="form-check-label" for="headlineIndicator1"
              >Use national data set
            </label>
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="headlineIndicator2"
            />
            <label class="form-check-label" for="headlineIndicator2"
              >Use the available data (pre-populated data);</label
            >
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="headlineIndicator3"
            />
            <label class="form-check-label" for="headlineIndicator3"
              >No data available
            </label>
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="headlineIndicator4"
            />
            <label class="form-check-label" for="headlineIndicator4"
              >Not relevant
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="exampleInputEmail1"
            >Please provide the sources of data and references to metadata
            related to the headline indicator(s).</label
          >
          <ckeditor></ckeditor>
        </div>
        <div class="form-group">
          <label for="exampleInputEmail1"
            >Please provide component and complementary indicators and other
            national indicators used for this global target if any.</label
          >
          <ckeditor></ckeditor>
        </div>

        <div class="form-group">
          <label for="targetProgress"
            >Please estimate the current level of your country’s contribution
            towards the global target(s).</label
          >
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="targetProgress1"
            />
            <label class="form-check-label" for="targetProgress1"
              >On track to achieve target</label
            >
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="targetProgress2"
            />
            <label class="form-check-label" for="targetProgress2"
              >Progress towards target but at an insufficient rate</label
            >
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="targetProgress3"
            />
            <label class="form-check-label" for="targetProgress3"
              >No significant progress
            </label>
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="targetProgress4"
            />
            <label class="form-check-label" for="targetProgress4"
              >Moving away from target
            </label>
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="targetProgress5"
            />
            <label class="form-check-label" for="targetProgress5"
              >Unknown
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="exampleInputEmail1"
            >Please provide examples or cases to illustrate the effectiveness of
            the actions taken to implement this/these national target/s or the
            global target. If needed please provide relevant web links or attach
            related materials or publications.
          </label>
          <ckeditor></ckeditor>
        </div>

        <div class="form-group">
          <label for="exampleInputEmail1"
            >Please describe briefly how the implementation of this national
            target and relevant global target(s) has contributed to progress in
            achieving related SDGs and associated targets. (This is
            optional)</label
          >
          <ckeditor></ckeditor>
        </div>

        <div class="form-group">
          <label for="exampleInputEmail1"
            >Please provide a summary of progress towards this global target,
            including main outcomes achieved, key challenges encountered, and
            different approaches that may be taken for further implementation.
          </label>
          <ckeditor></ckeditor>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import Ckeditor from '@/components/controls/kmCkEditor'
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
  methods: {
    submitDocument() {},
  },
}
</script>
