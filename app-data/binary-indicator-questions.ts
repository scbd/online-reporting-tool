import binaryQuestionsTJson from '~/i18n/dist/app-data/binary-indicator-questions.json' with { type: "json" };

type Locale = 'en' | 'fr' | 'es' | 'ru' | 'zh';
type BinaryQuestions = Record<string, Record<string, string>>;
const binaryQuestionsT = binaryQuestionsTJson as BinaryQuestions;

// simplified translation function for binary questions to support both server side and client side usage
// the backend validation call api on the ort to get binary question for validation.
// this 
function t(key: string, locale:string) {
    return binaryQuestionsT[locale][key] || binaryQuestionsT['en'][key] || key;
}
function getQuestions(locale:string = 'en') {

    const val = t("goalB_question1", locale)

    const translatedQuestions = [
        {
            "key": "binaryResponseGoalB",
            "target": "GBF-GOAL-B",
            "binaryIndicator": "KMGBF-INDICATOR-BIN-B",
            "title": "",
            "questions": [
                {
                    "key": "b_1",
                    "section": "goalB",
                    "number": "B.1",
                    "type": "option",
                    "title": t("goalB_question1", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                    ],
                    "mandatory": true
                },
                {
                    "key": "b_2",
                    "section": "goalB",
                    "number": "B.2",
                    "type": "option",
                    "title": t("goalB_question2", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                    ],
                    "mandatory": true
                },
                {
                    "key": "b_3",
                    "section": "goalB",
                    "number": "B.3",
                    "type": "option",
                    "title": t("goalB_question3", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                    ],
                    "mandatory": true
                },
                {
                    "key": "b_4",
                    "section": "goalB",
                    "number": "B.4",
                    "type": "option",
                    "title": t("goalB_question4", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                    ],
                    "mandatory": true
                },

            ]
        },
        {
            "key": "binaryResponseGoalC",
            "target": "GBF-GOAL-C",
            "binaryIndicator": "KMGBF-INDICATOR-BIN-C-13",
            "title": "",
            "questions": [
                {
                    "key": "13_1",
                    "section": "binaryResponseTarget13",
                    "number": "13.1",
                    "type": "option",
                    "title": t("target13_question_1", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                        {
                            "value": "notApplicable",
                            "title": t("notApplicable", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "13_2",
                    "section": "binaryResponseTarget13",
                    "number": "13.2",
                    "type": "option",
                    "title": t("target13_question_2", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                        {
                            "value": "notApplicable",
                            "title": t("notApplicable", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "13_3",
                    "section": "binaryResponseTarget13",
                    "number": "13.3",
                    "type": "option",
                    "title": t("target13_question_3", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "13_4",
                    "section": "binaryResponseTarget13",
                    "number": "13.4",
                    "type": "option",
                    "title": t("target13_question_4", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "yes",
                            "title": t("yes", locale),
                        },
                        {
                            "value": "notApplicable",
                            "title": t("notApplicable", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "13_5",
                    "section": "binaryResponseTarget13",
                    "number": "13.5",
                    "type": "option",
                    "title": t("target13_question_5", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                        {
                            "value": "notApplicable",
                            "title": t("notApplicable", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "13_6",
                    "section": "binaryResponseTarget13",
                    "number": "13.6",
                    "type": "option",
                    "title": t("target13_question_6", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                        {
                            "value": "notApplicable",
                            "title": t("notApplicable", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "13_7",
                    "section": "binaryResponseTarget13",
                    "number": "13.7",
                    "type": "option",
                    "title": t("target13_question_7", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                        {
                            "value": "notApplicable",
                            "title": t("notApplicable", locale),
                        }
                    ],
                    "mandatory": true
                },
            ]
        },
        {
            "key": "binaryResponseTarget1",
            "target": "GBF-TARGET-01",
            "binaryIndicator": "KMGBF-INDICATOR-BIN-1",
            "title": "",
            "questions": [
                {
                    "key": "1",
                    "section": "GBF-TARGET-01",
                    "number": "1",
                    "type": "option",
                    "title": t("target1_question_1_add", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "yes",
                            "title": t("yes", locale),
                        },
                        {
                            "value": "no",
                            "title": t("no", locale),
                        }
                    ],
                    "mandatory": true,
                    "validations": [
                        {
                            "question": "1_1_c",
                            "type": "@hasValues",
                            "values": [
                                "no"
                            ],
                            "trigger": "enable"
                        }
                    ]
                },
                {
                    "key": "1_1",
                    "section": "GBF-TARGET-01",
                    "number": "1.1",
                    "type": "header",
                    "title": t("target1_question_1", locale),
                    "questions": [
                        {
                            "key": "1_1_a",
                            "section": "1_1",
                            "number": "(a)",
                            "type": "option",
                            "title": t("target1_question_1_a", locale),
                            "multiple": false,
                            "options": [
                                {
                                    "value": "no",
                                    "title": t("no", locale),
                                },
                                {
                                    "value": "underDevelopment",
                                    "title": t("underDevelopment", locale),
                                },
                                {
                                    "value": "partially",
                                    "title": t("partially", locale),
                                },
                                {
                                    "value": "fully",
                                    "title": t("fully", locale),
                                },
                            ],
                            "validations": [
                                {
                                    "question": "1_2",
                                    "type": "@hasValues",
                                    "values": [
                                        "underDevelopment", "partially", "fully"
                                    ],
                                    "trigger": "enable"
                                }
                            ],
                            "mandatory": true
                        },
                        {
                            "key": "1_1_b",
                            "section": "1_1",
                            "number": "(b)",
                            "type": "option",
                            "title": t("target1_question_1_b", locale),
                            "multiple": false,
                            "options": [
                                {
                                    "value": "no",
                                    "title": t("no", locale),
                                },
                                {
                                    "value": "underDevelopment",
                                    "title": t("underDevelopment", locale),
                                },
                                {
                                    "value": "partially",
                                    "title": t("partially", locale),
                                },
                                {
                                    "value": "fully",
                                    "title": t("fully", locale),
                                },
                            ],
                            "validations": [
                                {
                                    "question": "1_2",
                                    "type": "@hasValues",
                                    "values": [
                                        "underDevelopment", "partially", "fully"
                                    ],
                                    "trigger": "enable"
                                }
                            ],
                            "mandatory": true
                        },
                        {
                            "key": "1_1_c",
                            "section": "1_1",
                            "number": "(c)",
                            "type": "option",
                            "title": t("target1_question_1_c", locale),
                            "multiple": false,
                            "options": [
                                {
                                    "value": "no",
                                    "title": t("no", locale),
                                },
                                {
                                    "value": "underDevelopment",
                                    "title": t("underDevelopment", locale),
                                },
                                {
                                    "value": "partially",
                                    "title": t("partially", locale),
                                },
                                {
                                    "value": "fully",
                                    "title": t("fully", locale),
                                },
                            ],
                            "validations": [
                                {
                                    "question": "1_2",
                                    "type": "@hasValues",
                                    "values": [
                                        "underDevelopment", "partially", "fully"
                                    ],
                                    "trigger": "enable"
                                }
                            ],
                            "mandatory": true
                        },
                    ]
                },
                {
                    "key": "1_2",
                    "section": "GBF-TARGET-01",
                    "number": "1.2",
                    "type": "checkbox",
                    "title": t("target1_question_2", locale),
                    "multiple": true,
                    "options": [
                        {
                            "value": "forTerrestrialPlanning",
                            "title": t("forTerrestrialPlanning", locale),
                        },
                        {
                            "value": "forInlandWaterPlanning",
                            "title": t("forInlandWaterPlanning", locale),
                        },
                        {
                            "value": "forCostalMarinePlanning",
                            "title": t("forCostalMarinePlanning", locale),
                        },
                        {
                            "value": "none",
                            "title": t("none", locale),
                        },
                    ],
                    "mandatory": true
                },
            ]
        },
        {
            "key": "binaryResponseTarget5",
            "target": "GBF-TARGET-05",
            "binaryIndicator": "KMGBF-INDICATOR-BIN-5",
            "title": "",
            "questions": [
                {
                    "key": "5_1",
                    "section": "GBF-TARGET-05",
                    "number": "5.1",
                    "type": "checkbox",
                    "title": t("target5_question_1", locale),
                    "multiple": true,
                    "options": [
                        {
                            "value": "terrestrialSpecies",
                            "title": t("terrestrialSpecies", locale),
                        },
                        {
                            "value": "freshwaterSpecies",
                            "title": t("freshwaterSpecies", locale),
                        },
                        {
                            "value": "marineSpecies",
                            "title": t("marineSpecies", locale),
                        },
                        {
                            "value": "internationalTrade",
                            "title": t("internationalTrade", locale),
                        },
                        {
                            "value": "none",
                            "title": t("none", locale),
                        },
                    ],
                    "mandatory": true
                },
            ]
        },
        {
            "key": "binaryResponseTarget6",
            "target": "GBF-TARGET-06",
            "binaryIndicator": "KMGBF-INDICATOR-BIN-6",
            "title": "",
            "questions": [
                {
                    "key": "6_1",
                    "section": "binaryResponseTarget6",
                    "number": "6.1",
                    "type": "option",
                    "title": t("target6_question_1", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                    ],
                    "mandatory": true
                },
                {
                    "key": "6_2",
                    "section": "binaryResponseTarget6",
                    "number": "6.2",
                    "type": "option",
                    "title": t("target6_question_2", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                    ],
                    "mandatory": true
                },
                {
                    "key": "6_3",
                    "section": "binaryResponseTarget6",
                    "number": "6.3",
                    "type": "option",
                    "title": t("target6_question_3", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                    ],
                    "mandatory": true

                }
            ]
        },
        {
            "key": "binaryResponseTarget8",
            "target": "GBF-TARGET-08",
            "binaryIndicator": "KMGBF-INDICATOR-BIN-8",
            "title": "",
            "questions": [
                {
                    "key": "8_1",
                    "section": "binaryResponseTarget8",
                    "number": "8.1",
                    "type": "checkbox",
                    "title": t("target8_question_1", locale),
                    "multiple": true,
                    "options": [
                        {
                            "value": "climateChange",
                            "title": t("climateChange", locale),
                        },
                        {
                            "value": "oceanAcidification",
                            "title": t("oceanAcidification", locale),
                        },
                        {
                            "value": "none",
                            "title": t("none", locale),
                        },
                    ],
                    "mandatory": true
                },
                {
                    "key": "8_2",
                    "section": "binaryResponseTarget8",
                    "number": "8.2",
                    "type": "option",
                    "title": t("target8_question_2", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                    ],
                    "mandatory": true
                },
                {
                    "key": "8_3",
                    "section": "binaryResponseTarget8",
                    "number": "8.3",
                    "type": "option",
                    "title": t("target8_question_3", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                    ],
                    "mandatory": true
                },
                {
                    "key": "8_4",
                    "section": "binaryResponseTarget8",
                    "number": "8.4",
                    "type": "option",
                    "title": t("target8_question_4", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                    ],
                    "mandatory": true
                },
                {
                    "key": "8_5",
                    "section": "binaryResponseTarget8",
                    "number": "8.5",
                    "type": "option",
                    "title": t("target8_question_5", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                    ],
                    "mandatory": true
                },
                {
                    "key": "8_6",
                    "section": "binaryResponseTarget8",
                    "number": "8.6",
                    "type": "option",
                    "title": t("target8_question_6", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                    ],
                    "mandatory": true
                },
                {
                    "key": "8_7",
                    "section": "binaryResponseTarget8",
                    "number": "8.7",
                    "type": "checkbox",
                    "title": t("target8_question_7", locale),
                    "multiple": true,
                    "options": [
                        {
                            "value": "mitigation",
                            "title": t("mitigation", locale),
                        },
                        {
                            "value": "adaptation",
                            "title": t("adaptation", locale),
                        },
                        {
                            "value": "disasterRiskReduction",
                            "title": t("disasterRiskReduction", locale),
                        },
                        {
                            "value": "natureBasedSolutions",
                            "title": t("natureBasedSolutions", locale),
                        },
                        {
                            "value": "policiesToMinimize",
                            "title": t("policiesToMinimize", locale),
                        },
                        {
                            "value": "other",
                            "title": t("other", locale),
                        },
                    ],
                    "mandatory": true
                },
                {
                    "key": "8_8",
                    "section": "binaryResponseTarget8",
                    "number": "8.8",
                    "type": "option",
                    "title": t("target8_question_8", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                    ],
                    "mandatory": true
                },
                {
                    "key": "8_9",
                    "section": "binaryResponseTarget8",
                    "number": "8.9",
                    "type": "option",
                    "title": t("target8_question_9", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                    ],
                    "mandatory": true
                },
            ]
        },
        {
            "key": "binaryResponseTarget9",
            "target": "GBF-TARGET-09",
            "binaryIndicator": "KMGBF-INDICATOR-BIN-9",
            "title": "",
            "questions": [
                {
                    "key": "9_1",
                    "section": "binaryResponseTarget9",
                    "number": "9.1",
                    "type": "option",
                    "title": t("target9_question_1", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "9_2",
                    "section": "binaryResponseTarget9",
                    "number": "9.2",
                    "type": "option",
                    "title": t("target9_question_2", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "9_3",
                    "section": "binaryResponseTarget9",
                    "number": "9.3",
                    "type": "checkbox",
                    "title": t("target9_question_3", locale),
                    "multiple": true,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "validations": [
                        {
                            "question": "9_3_1",
                            "type": "@hasValues",
                            "values": [
                                "partially", "fully"
                            ],
                            "trigger": "enable"
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "9_3_1",
                    "section": "binaryResponseTarget9",
                    "number": "9.3.1",
                    "type": "checkbox",
                    "title": t("target9_question_3_1", locale),
                    "multiple": true,
                    "options": [
                        {
                            "value": "womenGirls",
                            "title": t("womenGirls", locale),
                        },
                        {
                            "value": "childrenYouth",
                            "title": t("childrenYouth", locale),
                        },
                        {
                            "value": "personWithDisabilities",
                            "title": t("personWithDisabilities", locale),
                        },
                        {
                            "value": "indigenousPeoplesLocalCommunities",
                            "title": t("indigenousPeoplesLocalCommunities", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "9_4",
                    "section": "binaryResponseTarget9",
                    "number": "9.4",
                    "type": "option",
                    "title": t("target9_question_4", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                        {
                            "value": "notApplicable",
                            "title": t("notApplicable", locale),
                        }
                    ],
                    "mandatory": true
                },

            ]
        },
        {
            "key": "binaryResponseTarget12",
            "target": "GBF-TARGET-012",
            "binaryIndicator": "KMGBF-INDICATOR-BIN-12",
            "title": "",
            "questions": [
                {
                    "key": "12_1",
                    "section": "binaryResponseTarget12",
                    "number": "12.1",
                    "type": "option",
                    "title": t("target12_question_1", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "12_2",
                    "section": "binaryResponseTarget12",
                    "number": "12.2",
                    "type": "option",
                    "title": t("target12_question_2", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "mandatory": true
                }
            ]
        },
        {
            "key": "binaryResponseTarget13",
            "target": "GBF-TARGET-013",
            "binaryIndicator": "KMGBF-INDICATOR-BIN-C-13",
            "title": "",
            "questions": [
                {
                    "key": "13_1",
                    "section": "binaryResponseTarget13",
                    "number": "13.1",
                    "type": "option",
                    "title": t("target13_question_1", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                        {
                            "value": "notApplicable",
                            "title": t("notApplicable", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "13_2",
                    "section": "binaryResponseTarget13",
                    "number": "13.2",
                    "type": "option",
                    "title": t("target13_question_2", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                        {
                            "value": "notApplicable",
                            "title": t("notApplicable", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "13_3",
                    "section": "binaryResponseTarget13",
                    "number": "13.3",
                    "type": "option",
                    "title": t("target13_question_3", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "13_4",
                    "section": "binaryResponseTarget13",
                    "number": "13.4",
                    "type": "option",
                    "title": t("target13_question_4", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "yes",
                            "title": t("yes", locale),
                        },
                        {
                            "value": "notApplicable",
                            "title": t("notApplicable", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "13_5",
                    "section": "binaryResponseTarget13",
                    "number": "13.5",
                    "type": "option",
                    "title": t("target13_question_5", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                        {
                            "value": "notApplicable",
                            "title": t("notApplicable", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "13_6",
                    "section": "binaryResponseTarget13",
                    "number": "13.6",
                    "type": "option",
                    "title": t("target13_question_6", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                        {
                            "value": "notApplicable",
                            "title": t("notApplicable", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "13_7",
                    "section": "binaryResponseTarget13",
                    "number": "13.7",
                    "type": "option",
                    "title": t("target13_question_7", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                        {
                            "value": "notApplicable",
                            "title": t("notApplicable", locale),
                        }
                    ],
                    "mandatory": true
                },
            ]
        },
        {
            "key": "binaryResponseTarget14",
            "target": "GBF-TARGET-014",
            "binaryIndicator": "KMGBF-INDICATOR-BIN-C-14",
            "title": "",
            "questions": [
                {
                    "key": "14_1",
                    "section": "binaryResponseTarget14",
                    "number": "14.1",
                    "type": "option",
                    "title": t("target14_question_1", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "14_2",
                    "section": "binaryResponseTarget14",
                    "number": "14.2",
                    "type": "option",
                    "title": t("target14_question_2", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "14_3",
                    "section": "binaryResponseTarget14",
                    "number": "14.3",
                    "type": "option",
                    "title": t("target14_question_3", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "validations": [
                        {
                            "question": "14_3_a",
                            "type": "@hasValues",
                            "values": [
                                "partially", "fully"
                            ],
                            "trigger": "enable"
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "14_3_a",
                    "section": "binaryResponseTarget14",
                    "number": "",
                    "type": "checkbox",
                    "title": t("target14_question_3_a", locale),
                    "multiple": true,
                    "options": [
                        {
                            "value": "agriculture",
                            "title": t("agriculture", locale),
                        },
                        {
                            "value": "fisheries",
                            "title": t("fisheries", locale),
                        },
                        {
                            "value": "forestry",
                            "title": t("forestry", locale),
                        },
                        {
                            "value": "aquaculture",
                            "title": t("aquaculture", locale),
                        },
                        {
                            "value": "finance",
                            "title": t("finance", locale),
                        },
                        {
                            "value": "tourism",
                            "title": t("tourism", locale),
                        },
                        {
                            "value": "health",
                            "title": t("health", locale),
                        },
                        {
                            "value": "infrastructure",
                            "title": t("infrastructure", locale),
                        },
                        {
                            "value": "energy",
                            "title": t("energy", locale),
                        },
                        {
                            "value": "mining",
                            "title": t("mining", locale),
                        },
                        {
                            "value": "manufacturingAndProcessing",
                            "title": t("manufacturingAndProcessing", locale),
                        },
                        {
                            "value": "other",
                            "title": t("other", locale),
                        }
                    ],
                    "mandatory": false
                },
                {
                    "key": "14_4",
                    "section": "binaryResponseTarget14",
                    "number": "14.4",
                    "type": "option",
                    "title": t("target14_question_4", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "14_5",
                    "section": "binaryResponseTarget14",
                    "number": "14.5",
                    "type": "option",
                    "title": t("target14_question_5", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "mandatory": true
                },
            ]
        },
        {
            "key": "binaryResponseTarget15",
            "target": "GBF-TARGET-015",
            "binaryIndicator": "KMGBF-INDICATOR-BIN-15",
            "title": "",
            "questions": [
                {
                    "key": "15_1",
                    "section": "GBF-TARGET-015",
                    "number": "15.1",
                    "type": "option",
                    "title": t("target15_question_1", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "15_2",
                    "section": "GBF-TARGET-015",
                    "number": "15.2",
                    "type": "option",
                    "title": t("target15_question_2", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "15_3",
                    "section": "GBF-TARGET-015",
                    "number": "15.3",
                    "type": "option",
                    "title": t("target15_question_3", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "15_4",
                    "section": "GBF-TARGET-015",
                    "number": "15.4",
                    "type": "option",
                    "title": t("target15_question_4", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "mandatory": true
                },

                {
                    "key": "15_5",
                    "section": "GBF-TARGET-015",
                    "number": "15.5",
                    "type": "option",
                    "title": t("target15_question_5", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "mandatory": true
                }
            ]
        },
        {
            "key": "binaryResponseTarget16",
            "target": "GBF-TARGET-016",
            "binaryIndicator": "KMGBF-INDICATOR-BIN-16",
            "title": "",
            "questions": [
                {
                    "key": "16_1",
                    "section": "GBF-TARGET-016",
                    "number": "16.1",
                    "type": "option",
                    "title": t("target16_question_1", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "16_2",
                    "section": "GBF-TARGET-016",
                    "number": "16.2",
                    "type": "option",
                    "title": t("target16_question_2", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "16_3",
                    "section": "GBF-TARGET-016",
                    "number": "16.3",
                    "type": "option",
                    "title": t("target16_question_3", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "mandatory": true
                }
            ]
        },
        {
            "key": "binaryResponseTarget17",
            "target": "GBF-TARGET-017",
            "binaryIndicator": "KMGBF-INDICATOR-BIN-17",
            "title": "",
            "questions": [
                {
                    "key": "17_1",
                    "section": "GBF-TARGET-017",
                    "number": "17.1",
                    "type": "option",
                    "title": t("target17_question_1", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "17_2",
                    "section": "GBF-TARGET-017",
                    "number": "17.2",
                    "type": "option",
                    "title": t("target17_question_2", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "17_3",
                    "section": "GBF-TARGET-017",
                    "number": "17.3",
                    "type": "option",
                    "title": t("target17_question_3", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "17_4",
                    "section": "GBF-TARGET-017",
                    "number": "17.4",
                    "type": "option",
                    "title": t("target17_question_4", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "17_5",
                    "section": "GBF-TARGET-017",
                    "number": "17.5",
                    "type": "option",
                    "title": t("target17_question_5", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "17_6",
                    "section": "GBF-TARGET-017",
                    "number": "17.6",
                    "type": "option",
                    "title": t("target17_question_6", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "mandatory": true
                },
            ]
        },
        {
            "key": "binaryResponseTarget20",
            "target": "GBF-TARGET-020",
            "binaryIndicator": "KMGBF-INDICATOR-BIN-20",
            "title": "",
            "questions": [
                {
                    "key": "20_1",
                    "section": "GBF-TARGET-020",
                    "number": "20.1",
                    "type": "option",
                    "title": t("target20_question_1", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "20_2",
                    "section": "GBF-TARGET-020",
                    "number": "20.2",
                    "type": "checkbox",
                    "title": t("target20_question_2", locale),
                    "multiple": true,
                    "options": [
                        {
                            "value": "womenGirls",
                            "title": t("womenGirls", locale),
                        },
                        {
                            "value": "childrenYouth",
                            "title": t("childrenYouth", locale),
                        },
                        {
                            "value": "personWithDisabilities",
                            "title": t("personWithDisabilities", locale),
                        },
                        {
                            "value": "indigenousPeoplesLocalCommunities",
                            "title": t("indigenousPeoplesLocalCommunities", locale),
                        },
                        {
                            "value": "other",
                            "title": t("other", locale),
                        },
                        {
                            "value": "none",
                            "title": t("none", locale),
                        }
                    ],
                    "mandatory": true,
                    "validations": [
                        {
                            "question": "20_2_1",
                            "type": "@hasValues",
                            "values": [
                                "other"
                            ],
                            "trigger": "enable"
                        }
                    ]
                },
                {
                    "key": "20_2_1",
                    "section": "GBF-TARGET-020",
                    "number": "20.2.1",
                    "type": "string",
                    "title": t("pleaseSpecify", locale),
                    "mandatory": false
                },
                {
                    "key": "20_3",
                    "section": "GBF-TARGET-020",
                    "number": "20.3",
                    "type": "option",
                    "title": t("target20_question_3", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                        {
                            "value": "notApplicable",
                            "title": t("notApplicable", locale),
                        }
                    ],
                    "mandatory": true
                },
                {
                    "key": "20_4",
                    "section": "GBF-TARGET-020",
                    "number": "20.4",
                    "type": "checkbox",
                    "title": t("target20_question_4", locale),
                    "multiple": true,
                    "options": [
                        {
                            "value": "womenGirls",
                            "title": t("womenGirls", locale),
                        },
                        {
                            "value": "childrenYouth",
                            "title": t("childrenYouth", locale),
                        },
                        {
                            "value": "personWithDisabilities",
                            "title": t("personWithDisabilities", locale),
                        },
                        {
                            "value": "indigenousPeoplesLocalCommunities",
                            "title": t("indigenousPeoplesLocalCommunities", locale),
                        },
                        {
                            "value": "other",
                            "title": t("other", locale),
                        },
                        {
                            "value": "none",
                            "title": t("none", locale),
                        }
                    ],
                    "mandatory": true,
                    "validations": [
                        {
                            "question": "20_4_1",
                            "type": "@hasValues",
                            "values": [
                                "other"
                            ],
                            "trigger": "enable"
                        }
                    ]
                },
                {
                    "key": "20_4_1",
                    "section": "GBF-TARGET-020",
                    "number": "20.4.1",
                    "type": "string",
                    "title": t("pleaseSpecify", locale),
                    "mandatory": false
                },
                {
                    "key": "20_5",
                    "section": "GBF-TARGET-020",
                    "number": "20.5",
                    "type": "option",
                    "title": t("target20_question_5", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                    ],
                    "mandatory": true,
                    "validations": [
                        {
                            "question": "20_5_1",
                            "type": "@hasValues",
                            "values": [
                                "underDevelopment", "partially", "fully"
                            ],
                            "trigger": "enable"
                        }
                    ],
                },
                {
                    "key": "20_5_1",
                    "section": "GBF-TARGET-020",
                    "number": "20.5.1",
                    "type": "string",
                    "title": t("specifyForPartnership", locale),
                    "mandatory": false
                }
            ]
        },
        {
            "key": "binaryResponseTarget22",
            "target": "GBF-TARGET-22",
            "binaryIndicator": "KMGBF-INDICATOR-BIN-22",
            "title": "",
            "questions": [
                {
                    "key": "22_1",
                    "section": "binaryResponseTarget22",
                    "number": "22.1",
                    "title": t("target22_question_1", locale),
                    questions: [
                        {
                            "key": "22_1_a",
                            "section": "binaryResponseTarget22",
                            "number": "(a)",
                            "type": "checkbox",
                            "title": t("target22_question_1_a", locale),
                            "multiple": true,
                            "options": [
                                {
                                    "value": "indigenousPeoplesLocalCommunities",
                                    "title": t("indigenousPeoplesLocalCommunities", locale),
                                },
                                {
                                    "value": "womenGirls",
                                    "title": t("womenGirls", locale),
                                },
                                {
                                    "value": "childrenYouth",
                                    "title": t("childrenYouth", locale),
                                },
                                {
                                    "value": "personWithDisabilities",
                                    "title": t("personWithDisabilities", locale),
                                },
                                {
                                    "value": "other",
                                    "title": t("other", locale),
                                },
                                {
                                    "value": "none",
                                    "title": t("none", locale),
                                }
                            ],
                            "mandatory": true
                        },
                        {
                            "key": "22_1_b",
                            "section": "binaryResponseTarget22",
                            "number": "(b)",
                            "type": "checkbox",
                            "title": t("target22_question_1_b", locale),
                            "multiple": true,
                            "options": [
                                {
                                    "value": "cultureAndPractices",
                                    "title": t("cultureAndPractices", locale),
                                },
                                {
                                    "value": "rightsOverLandsAndTerritories",
                                    "title": t("rightsOverLandsAndTerritories", locale),
                                },
                                {
                                    "value": "rightsOverResources",
                                    "title": t("rightsOverResources", locale),
                                },
                                {
                                    "value": "rightsOverTraditionalKnowledge",
                                    "title": t("rightsOverTraditionalKnowledge", locale),
                                },
                                {
                                    "value": "notApplicable",
                                    "title": t("notApplicable", locale),
                                }
                            ],
                            "mandatory": true
                        },
                        {
                            "key": "22_1_c",
                            "section": "binaryResponseTarget22",
                            "number": "(c)",
                            "type": "option",
                            "title": t("target22_question_1_c", locale),
                            "multiple": false,
                            "options": [
                                {
                                    "value": "no",
                                    "title": t("no", locale),
                                },
                                {
                                    "value": "yes",
                                    "title": t("yes", locale),
                                },
                            ],
                            "mandatory": true
                        },
                        {
                            "key": "22_1_d",
                            "section": "binaryResponseTarget22",
                            "number": "(d)",
                            "type": "checkbox",
                            "title": t("target22_question_1_d", locale),
                            "multiple": true,
                            "options": [
                                {
                                    "value": "indigenousPeoplesLocalCommunities",
                                    "title": t("indigenousPeoplesLocalCommunities", locale),
                                },
                                {
                                    "value": "womenGirls",
                                    "title": t("womenGirls", locale),
                                },
                                {
                                    "value": "childrenYouth",
                                    "title": t("childrenYouth", locale),
                                },
                                {
                                    "value": "personWithDisabilities",
                                    "title": t("personWithDisabilities", locale),
                                },
                                {
                                    "value": "other",
                                    "title": t("other", locale),
                                },
                                {
                                    "value": "none",
                                    "title": t("none", locale),
                                }
                            ],
                            "mandatory": true
                        },
                        {
                            "key": "22_1_e",
                            "section": "binaryResponseTarget22",
                            "number": "(e)",
                            "type": "checkbox",
                            "title": t("target22_question_1_e", locale),
                            "multiple": true,
                            "options": [
                                {
                                    "value": "indigenousPeoplesLocalCommunities",
                                    "title": t("indigenousPeoplesLocalCommunities", locale),
                                },
                                {
                                    "value": "womenGirls",
                                    "title": t("womenGirls", locale),
                                },
                                {
                                    "value": "childrenYouth",
                                    "title": t("childrenYouth", locale),
                                },
                                {
                                    "value": "personWithDisabilities",
                                    "title": t("personWithDisabilities", locale),
                                },
                                {
                                    "value": "other",
                                    "title": t("other", locale),
                                },
                                {
                                    "value": "none",
                                    "title": t("none", locale),
                                }
                            ],
                            "mandatory": true
                        },
                    ]
                },
                {
                    "key": "22_2",
                    "section": "binaryResponseTarget22",
                    "number": "22.2",
                    "type": "option",
                    "title": t("target22_question_2", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                    ],
                    "mandatory": true
                },
                {
                    "key": "22_3",
                    "section": "binaryResponseTarget22",
                    "number": "22.3",
                    "title": t("target22_question_3", locale),
                    questions: [
                        {
                            "key": "22_3_a",
                            "section": "binaryResponseTarget22",
                            "number": "(a)",
                            "type": "checkbox",
                            "title": t("target22_question_3_a", locale),
                            "multiple": true,
                            "options": [
                                {
                                    "value": "indigenousPeoplesLocalCommunities",
                                    "title": t("indigenousPeoplesLocalCommunities", locale),
                                },
                                {
                                    "value": "womenGirls",
                                    "title": t("womenGirls", locale),
                                },
                                {
                                    "value": "childrenYouth",
                                    "title": t("childrenYouth", locale),
                                },
                                {
                                    "value": "personWithDisabilities",
                                    "title": t("personWithDisabilities", locale),
                                },
                                {
                                    "value": "other",
                                    "title": t("other", locale),
                                },
                                {
                                    "value": "none",
                                    "title": t("none", locale),
                                }
                            ],
                            "mandatory": true
                        },
                        {
                            "key": "22_3_b",
                            "section": "binaryResponseTarget22",
                            "number": "(b)",
                            "type": "checkbox",
                            "title": t("target22_question_3_b", locale),
                            "multiple": true,
                            "options": [
                                {
                                    "value": "cultureAndPractices",
                                    "title": t("cultureAndPractices", locale),
                                },
                                {
                                    "value": "rightsOverLandsAndTerritories",
                                    "title": t("rightsOverLandsAndTerritories", locale),
                                },
                                {
                                    "value": "rightsOverResources",
                                    "title": t("rightsOverResources", locale),
                                },
                                {
                                    "value": "rightsOverTraditionalKnowledge",
                                    "title": t("rightsOverTraditionalKnowledge", locale),
                                },
                                {
                                    "value": "notApplicable",
                                    "title": t("notApplicable", locale),
                                }
                            ],
                            "mandatory": true
                        },
                        {
                            "key": "22_3_c",
                            "section": "binaryResponseTarget22",
                            "number": "(c)",
                            "type": "option",
                            "title": t("target22_question_3_c", locale),
                            "multiple": false,
                            "options": [
                                {
                                    "value": "no",
                                    "title": t("no", locale),
                                },
                                {
                                    "value": "yes",
                                    "title": t("yes", locale),
                                },
                            ],
                            "mandatory": true
                        }
                    ]
                },
            ],
            "note": ""
        },
        {
            "key": "binaryResponseTarget23",
            "target": "GBF-TARGET-023",
            "binaryIndicator": "KMGBF-INDICATOR-BIN-23",
            "title": "",
            "questions": [
                {
                    "key": "23_1",
                    "section": "binaryResponseTarget23",
                    "number": "23.1",
                    "type": "option",
                    "title": t("target23_question_1", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                    ],
                    "mandatory": true
                },
                {
                    "key": "23_2",
                    "section": "binaryResponseTarget23",
                    "number": "23.2",
                    "type": "option",
                    "title": t("target23_question_2", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                    ],
                    "mandatory": true
                },
                {
                    "key": "23_3",
                    "section": "binaryResponseTarget23",
                    "number": "23.3",
                    "type": "option",
                    "title": t("target23_question_3", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                    ],
                    "mandatory": true
                },
                {
                    "key": "23_4",
                    "section": "binaryResponseTarget23",
                    "number": "23.4",
                    "type": "option",
                    "title": t("target23_question_4", locale),
                    "multiple": false,
                    "options": [
                        {
                            "value": "no",
                            "title": t("no", locale),
                        },
                        {
                            "value": "underDevelopment",
                            "title": t("underDevelopment", locale),
                        },
                        {
                            "value": "partially",
                            "title": t("partially", locale),
                        },
                        {
                            "value": "fully",
                            "title": t("fully", locale),
                        },
                    ],
                    "mandatory": true
                }
            ]
        }
    ]
    // console.log(translatedQuestions);
    return translatedQuestions;
}
export const getBinaryIndicatorQuestions = getQuestions;
