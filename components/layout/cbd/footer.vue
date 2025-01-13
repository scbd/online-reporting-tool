<template>
    <footer class="footer m-0 p-0 mt-3" style="position: unset;">

        <div id="block-followblock" class="follow-us settings-tray-editable block block-cbd-utility block-follow-block"
            data-drupal-settingstray="editable">


            <div class="container">
                <div class="row">
                    <div class="col-12 col-lg-3 d-flex align-items-center">
                        <div class="h2 text-white text-uppercase m-0">{{ t('followUs')}}</div>
                    </div>
                    <div class="col-12 col-lg-9">
                        <div class="nav flex-follow-us">
                            <a href="http://www.youtube.com/user/chmcbd" title="YouTube">
                                <img src="https://www.cbd.int/themes/custom/bootstrap_sass/images/someround_youtube_neg.svg" alt="YouTube"
                                    loading="lazy">
                            </a>
                            <a href="http://www.facebook.com/UNBiodiversity" title="Facebook">
                                <img src="https://www.cbd.int/themes/custom/bootstrap_sass/images/someround_facebook_neg.svg"
                                    alt="Facebook" loading="lazy">
                            </a>
                            <a href="https://twitter.com/unbiodiversity" title="Twitter">
                                <img src="https://www.cbd.int/themes/custom/bootstrap_sass/images/someround_twitter_neg.svg" alt="Twitter"
                                    loading="lazy">
                            </a>
                            <a href="https://www.linkedin.com/company/unbiodiversity" title="LinkedIn">
                                <img src="https://www.cbd.int/themes/custom/bootstrap_sass/images/someround_linkedin_neg.svg"
                                    alt="LinkedIn" loading="lazy">
                            </a>
                            <a href="https://instagram.com/unbiodiversity" title="Instagram">
                                <img src="https://www.cbd.int/themes/custom/bootstrap_sass/images/someround_instagram_neg.svg"
                                    alt="Instagram" loading="lazy">
                            </a>
                            <a href="https://www.cbd.int/rss" title="RSS">
                                <img src="https://www.cbd.int/themes/custom/bootstrap_sass/images/someround_feed_neg.svg" alt="RSS"
                                    loading="lazy">
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </div>




        <div class="cbd-footer">
            <div class="container">
                <div class="row">
                    <div id="block-quicklinksblock"
                        class="footer-block footer-margin col-12 col-lg-5 settings-tray-editable block block-cbd-utility block-quick-links-block"
                        data-drupal-settingstray="editable">


                        <h5 class="h4 text-uppercase">{{ t('quickLinks')}}</h5>
                        <hr>
                        <div class="footer-links two-column">
                            <a href="https://absch.cbd.int/" title="Access and Benefit-Sharing Clearing-House">{{ t('absch') }} </a>
                            <a href="https://bch.cbd.int/" title="Biosafety Clearing-House">{{ t('bch') }}</a>
                            <a href="https://chm.cbd.int/" title="Clearing-House Mechanism">{{ t('chm') }}</a>
                            <a href="https://www.cbd.int/contributions" title="Contributions">{{ t('contributions')}}</a>
                            <a href="https://www.cbd.int/countries/" title="Country Profiles">{{ t('countryProfiles') }}</a>
                            <a href="https://www.cbd.int/meetings/" title="Meetings and Events">{{ t('meetingsAndEvents') }}</a>
                            <a href="https://www.cbd.int/nbsap" title="National Biodiversity Strategies and Action Plans (NBSAPs)">{{ t('nbsaps') }}</a>
                            <a href="https://www.cbd.int/nfp" title="National Focal Points">{{ t('nfp') }}</a>
                            <a href="https://www.cbd.int/reports" title="National Reports">{{ t('nationalReports') }}</a>
                            <a href="https://www.cbd.int/news/" title="News Headlines">{{ t('newsHeadlines') }}</a>
                            <a href="https://www.cbd.int/notifications/" title="Notifications">{{ t('notifications') }}</a>
                            <a href="https://www.cbd.int/parties" title="Parties">{{ t('parties') }}</a>
                            <a href="https://www.cbd.int/publications" title="Publications">{{ t('publications') }}</a>
                        </div>

                    </div>


                    <div id="block-topicsfooterblock"
                        class="footer-block footer-margin col-12 col-lg-3 settings-tray-editable block block-cbd-utility block-topics-footer-block"
                        data-drupal-settingstray="editable">


                        <h5 class="h4 text-uppercase">{{ t('topics') }}</h5>
                        <hr>
                        <div class="footer-links">
                            <a href="https://www.cbd.int/topic/business-women-youth-and-other-stakeholders"
                                title="Business, Women, Youth and other Stakeholders">{{ t('stakeholders') }}</a>
                            <a href="https://www.cbd.int/topic/climate-change" title="Climate Change">{{ t('climateChange') }}</a>
                            <a href="https://www.cbd.int/topic/poverty-reduction" title="Poverty Reduction">{{ t('povertyReduction') }}</a>
                            <a href="https://www.cbd.int/topic/food" title="Food">{{ t('food') }}</a>
                            <a href="https://www.cbd.int/topic/water" title="Water">{{ t('water') }}</a>
                            <a href="https://www.cbd.int/topic/indigenous-peoples-and-local-communities"
                                title="Indigenous Peoples and Local Communities">{{ t('indigenousPeoples') }}</a>
                        </div>

                    </div>



                    <div class="desktop-only footer-block footer-margin col-6 col-lg-2">
                        <h5 class="h4 text-uppercase">{{ t('information') }}</h5>
                        <hr>
                        <div class="flex-one-column">
                            <a href="https://www.cbd.int/contact" title="Contact us">{{ t('contactUs') }}</a>
                            <a href="https://www.cbd.int/terms" title="Terms of Use">{{ t('termsOfUse') }}</a>
                            <a href="https://www.cbd.int/privacy" title="Privacy Policy">{{ t('privacyPolicy') }}</a>
                            <a href="https://www.cbd.int/credits" title="Credits">{{ t('credits') }}</a>
                            <a href="https://www.cbd.int/copyright" title="© CBD Secretariat">© {{ t('CBDSecretariat') }}</a>
                        </div>
                    </div>
                    <div class="desktop-only footer-block footer-margin col-6 col-lg-2">
                        <h5 class="h4 text-uppercase">{{ t('aPartOf') }}</h5>
                        <hr>
                        <img class="uno-brand" src="https://www.cbd.int/themes/custom/bootstrap_sass/images/UN_brand_neg.svg" alt="UN logo"
                            loading="lazy">
                        <img class="uno-environment"
                            src="https://www.cbd.int/themes/custom/bootstrap_sass/images/UNEP_2019_brand_white.svg"
                            alt="UN Environment Programme logo" loading="lazy">
                    </div>

                    <div class="mobile-only footer-block footer-margin col-12">
                        <div class="row">
                            <div class="col-6">
                                <div class="footer-headline" style="text-transform: uppercase;">{{ t('information') }}</div>
                            </div>
                            <div class="col-6">
                                <div class="footer-headline" style="text-transform: uppercase;">{{ t('aPartOf') }}</div>
                            </div>
                        </div>
                        <div class="row">
                            <div class=" col-12">
                                <hr>
                            </div>
                        </div>
                        <div class="row">
                            <div class="footer-block col-6 ">
                                <div class="flex-one-column">
                                    <a href="https://www.cbd.int/contact" title="Contact us">{{ t('contactUs') }}</a>
                                    <a href="https://www.cbd.int/terms" title="Terms of Use">{{ t('termsOfUse') }}</a>
                                    <a href="https://www.cbd.int/privacy" title="Privacy Policy">{{ t('privacyPolicy') }}</a>
                                    <a href="https://www.cbd.int/credits" title="Credits">{{ t('credits') }}</a>
                                    <a href="https://www.cbd.int/copyright" title="© CBD Secretariat">© {{ t('CBDSecretariat') }}</a>
                                </div>
                            </div>
                            <div class="footer-block col-6 ">
                                <img class="uno-brand" src="https://www.cbd.int/themes/custom/bootstrap_sass/images/UN_brand_neg.svg"
                                    alt="UN logo" loading="lazy">
                                <img class="uno-environment"
                                    src="https://www.cbd.int/themes/custom/bootstrap_sass/images/UNEP_2019_brand_white.svg"
                                    alt="UN Environment Programme logo" loading="lazy">
                            </div>
                        </div>
                    </div>




                </div>
            </div>
        </div>


    </footer>
</template>
<i18n src="@/i18n/dist/components/layout/cbd/footer.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
    const { t } = useI18n();
</script>

<style scoped src="./cbd.css"></style>
<style scoped>
    .footer .footer-block a{
        font-size: 1em!important;
    }
    .footer .h4{
        font-size: 1em!important;
    }
</style>