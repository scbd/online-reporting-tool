
import binaryQuestionsT from '../i18n/en/app-data/binary-indicator-questions.json' with { type: "json" };;

export const binaryIndicatorQuestions = [
    {
        "key":"binaryResponseGoalB",
        "target": "GBF-GOAL-B",
        "binaryIndicator": "KMGBF-INDICATOR-BIN-B",
        "title": "",
        "questions1":[
            {
                "key":"b_1",
                "section":"goalB",
                "number":"B.1",
                "type":"option",
                "title": binaryQuestionsT.goalB_question1,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value":"yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value":"yesFully",
                        "title": binaryQuestionsT.yesFully
                    },
                ],
                "mandatory":true
            },
            {
                "key":"b_2",
                "section":"goalB",
                "number":"B.2",
                "type":"option",
                "title": binaryQuestionsT.goalB_question2,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value":"yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value":"yesFully",
                        "title": binaryQuestionsT.yesFully
                    },
                ],
                "mandatory":true
            },
        ]
    },
    {
        "key":"binaryResponseGoalC",
        "target": "GBF-GOAL-B",
        "binaryIndicator": "KMGBF-INDICATOR-BIN-C-13",
        "title": "", 
        "questions1":[ 
            {
                "key":"13_1",
                "section":"binaryResponseTarget13",
                "number":"13.1",
                "type":"option",
                "title": binaryQuestionsT.target13_question_1,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target13_question_1_c
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target13_question_1_d
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target13_question_1_e
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target13_question_1_f
                    }
                ],
                "mandatory":true
            },
            {
                "key":"13_2",
                "section":"binaryResponseTarget13",
                "number":"13.2",
                "type":"option",
                "title": binaryQuestionsT.target13_question_2,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value":"yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value":"yesFully",
                        "title": binaryQuestionsT.yesFully
                    },
                    {
                        "value":"notApplicable",
                        "title": binaryQuestionsT.notApplicable
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.digitalSequenceInformation
                    }
                ],
                "mandatory":true
            },
            {
                "key":"13_3",
                "section":"binaryResponseTarget13",
                "number":"13.3",
                "type":"option",
                "title": binaryQuestionsT.target13_question_3,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value":"yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value":"yesFully",
                        "title": binaryQuestionsT.yesFully
                    }
                ],
                "mandatory":true
            },
            {
                "key":"13_3_alt",
                "section":"binaryResponseTarget13",
                "number":"13.3 alt",
                "type":"option",
                "title": binaryQuestionsT.target13_question_3_alt,
                "multiple":false,
                "options":[
                   {
                      "value":"??", //value?
                      "title": binaryQuestionsT.target13_question_3_alt_c
                   },
                   {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target13_question_3_alt_d
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.digitalSequenceInformation
                    }
                ],
                "mandatory":true
            },
            {
                "key":"13_3_alt_bis",
                "section":"binaryResponseTarget13",
                "number":"13.3 alt bis",
                "type":"string or text", //need to verify
                "title": binaryQuestionsT.target13_question_3_alt_bis,
                "mandatory":true
            },
            {
                "key":"13_4",
                "section":"binaryResponseTarget13",
                "number":"13.4",
                "type":"string or text", //need to verify
                "title": binaryQuestionsT.target13_question_4,
                "mandatory":true
            },
            {
                "key":"13_4_alt",
                "section":"binaryResponseTarget13",
                "number":"13.4.alt",
                "type":"string or text", //need to verify
                "title": binaryQuestionsT.target13_question_4_alt,
                "mandatory":true
            }
        ]
    },
    {
        "key":"binaryResponseTarget1",
        "target": "GBF-TARGET-01",
        "binaryIndicator": "KMGBF-INDICATOR-BIN-1",
        "title": "",
        "questions":[
            {
                "key":"1_1",
                "section":"GBF-TARGET-01",
                "number":"1.1",
                "type":"header",
                "title": binaryQuestionsT.target1_question_1,
                "questions":[
                    {
                        "key":"1_a",
                        "section":"1_1",
                        "number":"(a)",
                        "type":"option",
                        "title": binaryQuestionsT.target1_question_1_a,
                        "multiple":false,
                        "options":[
                        {
                            "value":"no",
                            "title": binaryQuestionsT.no
                        },
                        {
                                "value":"noButUnderDevelopment",
                                "title": binaryQuestionsT.noButUnderDevelopment
                            },
                            {
                                "value":"yesPartially",
                                "title": binaryQuestionsT.yesPartially
                            },
                            {
                                "value":"yesFully",
                                "title": binaryQuestionsT.yesFully
                            },
                        ],
                        "mandatory":true
                    },
                    {
                        "key":"1_b",
                        "section":"1_1",
                        "number":"(b)",
                        "type":"option",
                        "title": binaryQuestionsT.target1_question_1_b,
                        "multiple":false,
                        "options":[
                        {
                            "value":"no",
                            "title": binaryQuestionsT.no
                        },
                        {
                            "value":"noButUnderDevelopment",
                            "title": binaryQuestionsT.noButUnderDevelopment
                        },
                        {
                            "value":"yesPartially",
                            "title": binaryQuestionsT.yesPartially
                        },
                        {
                            "value":"yesFully",
                            "title": binaryQuestionsT.yesFully
                        },
                        ],
                        "mandatory":true
                    },
                    {
                        "key":"1_c",
                        "section":"1_1",
                        "number":"(c)",
                        "type":"option",
                        "title": binaryQuestionsT.target1_question_1_c,
                        "multiple":false,
                        "options":[
                        {
                            "value":"no",
                            "title": binaryQuestionsT.no
                        },
                        {
                            "value":"noButUnderDevelopment",
                            "title": binaryQuestionsT.noButUnderDevelopment
                        },
                        {
                            "value":"yesPartially",
                            "title": binaryQuestionsT.yesPartially
                        },
                        {
                            "value":"yesFully",
                            "title": binaryQuestionsT.yesFully
                        },
                        ],
                        "mandatory":true
                    },
                ]
            },
            {
                "key":"1_2",
                "section":"GBF-TARGET-01",
                "number":"1.2",
                "type":"option",
                "title": binaryQuestionsT.target1_question_2,
                "multiple":false,
                "options":[
                   {
                      "value":"noParticipatoryProcess",
                      "title": binaryQuestionsT.noParticipatoryProcess
                   },
                   {
                        "value":"forTerrestrialPlanning",
                        "title": binaryQuestionsT.forTerrestrialPlanning
                    },
                    {
                        "value":"forMarinePlanning",
                        "title": binaryQuestionsT.forMarinePlanning
                    },
                    {
                        "value":"forInlandWaterPlanning",
                        "title": binaryQuestionsT.forInlandWaterPlanning
                    },
                ],
                "mandatory":true
            },
        ]
    },
    {
        "key":"binaryResponseTarget6",
        "target": "GBF-TARGET-06",
        "binaryIndicator": "KMGBF-INDICATOR-BIN-6",
        "title": "",
        "questions1":[ 
            {
                "key":"6_1",
                "section":"binaryResponseTarget6",
                "number":"6.1",
                "type":"option",
                "title": binaryQuestionsT.target6_question_1,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value":"yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value":"yesFully",
                        "title": binaryQuestionsT.yesFully
                    },
                ],
                "mandatory":true
            },
            {
                "key":"6_2",
                "section":"binaryResponseTarget6",
                "number":"6.2",
                "type":"option",
                "title": binaryQuestionsT.target6_question_2,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value":"yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value":"yesFully",
                        "title": binaryQuestionsT.yesFully
                    },
                ],
                "mandatory":true
            }
        ]
    },
    {
        "key":"binaryResponseTarget8",
        "target": "GBF-TARGET-08",
        "binaryIndicator": "KMGBF-INDICATOR-BIN-8",
        "title": "",
        "questions1":[ 
            {
                "key":"8_1",
                "section":"binaryResponseTarget8",
                "number":"8.1",
                "type":"option",
                "title": binaryQuestionsT.target8_question_1,
                "multiple":false,
                "options":[
                   {
                      "value":"??", //value?
                      "title": binaryQuestionsT.target8_question_1_a
                   },
                   {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target8_question_1_b
                    },
                    {
                        "value":"none",
                        "title": binaryQuestionsT.target8_question_1_c
                    },
                ],
                "mandatory":true
            },
            {
                "key":"8_2",
                "section":"binaryResponseTarget8",
                "number":"8.2",
                "type":"option",
                "title": binaryQuestionsT.target8_question_2,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value":"yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value":"yesFully",
                        "title": binaryQuestionsT.yesFully
                    },
                ],
                "mandatory":true
            },
            {
                "key":"8_3",
                "section":"binaryResponseTarget8",
                "number":"8.3",
                "type":"option",
                "title": binaryQuestionsT.target8_question_3,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target8_question_3_c
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target8_question_3_d
                    },
                ],
                "mandatory":true
            },
            {
                "key":"8_4",
                "section":"binaryResponseTarget8",
                "number":"8.4",
                "type":"option",
                "title": binaryQuestionsT.target8_question_4,
                "multiple":false,
                "options":[
                   {
                      "value":"??", //value?
                      "title": binaryQuestionsT.target8_question_4_a
                   },
                   {
                        "value":"??",  //value?
                        "title": binaryQuestionsT.target8_question_4_b
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target8_question_4_c
                    },
                ],
                "mandatory":true
            },
            {
                "key":"8_4_bis",
                "section":"binaryResponseTarget8",
                "number":"8.4.bis",
                "type":"string or text", //need to verify
                "title": binaryQuestionsT.target8_question_4_bis,
                "mandatory":true
            },
            {
                "key":"8_4_ter",
                "section":"binaryResponseTarget8",
                "number":"8.4.ter",
                "type":"string or text", //need to verify
                "title": binaryQuestionsT.target8_question_4_ter,
                "mandatory":true
            }
        ]
    },
    {
        "key":"binaryResponseTarget9",
        "target": "GBF-TARGET-09",
        "binaryIndicator": "KMGBF-INDICATOR-BIN-9",
        "title": "",
        "questions1":[ 
            {
                "key":"9_1",
                "section":"binaryResponseTarget9",
                "number":"9.1",
                "type":"option",
                "title": binaryQuestionsT.target9_question_1,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value":"yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value":"yesFully",
                        "title": binaryQuestionsT.yesFully
                    }
                ],
                "mandatory":true
            },
            {
                "key":"9_2",
                "section":"binaryResponseTarget9",
                "number":"9.2",
                "type":"option",
                "title": binaryQuestionsT.target9_question_2,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target9_question_2_c
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target9_question_2_d
                    }
                ],
                "mandatory":true
            },
            {
                "key":"9_3",
                "section":"binaryResponseTarget9",
                "number":"9.3",
                "type":"option",
                "title": binaryQuestionsT.target9_question_3,
                "multiple":false,
                "options":[
                   {
                      "value":"??", //value?
                      "title": binaryQuestionsT.target9_question_3_a
                   },
                   {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target9_question_3_b
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target9_question_3_c
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target9_question_3_d
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target9_question_3_e
                    }
                ],
                "mandatory":true
            },
             {
                "key":"9_3_alt",
                "section":"binaryResponseTarget9",
                "number":"9.3.alt",
                "type":"string or text", //need to verify
                "title": binaryQuestionsT.target9_question_3_alt,
                "mandatory":true
            },
            {
                "key":"9_4_bis",
                "section":"binaryResponseTarget9",
                "number":"9.3.bis",
                "type":"string or text", //need to verify
                "title": binaryQuestionsT.target9_question_3_bis,
                "mandatory":true
            },
            {
                "key":"9_4",
                "section":"binaryResponseTarget9",
                "number":"9.4",
                "type":"option",
                "title": binaryQuestionsT.target9_question_4,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value":"yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value":"yesFully",
                        "title": binaryQuestionsT.yesFully
                    },
                    {
                        "value":"notApplicable",
                        "title": binaryQuestionsT.notApplicable
                    }
                ],
                "mandatory":true
            },
           
        ]
    },
    {
        "key":"binaryResponseTarget12",
        "target": "GBF-TARGET-012",
        "binaryIndicator": "KMGBF-INDICATOR-BIN-12",
        "title": "",
        "questions1":[ 
            {
                "key":"12_1",
                "section":"binaryResponseTarget12",
                "number":"12.1",
                "type":"option",
                "title": binaryQuestionsT.target12_question_1,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.yesForSomeUrbanAreas
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.yesForAllUrbanAreas
                    },
                ],
                "mandatory":true
            },
            {
                "key":"12_2",
                "section":"binaryResponseTarget12",
                "number":"12.2",
                "type":"option",
                "title": binaryQuestionsT.target12_question_2,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.yesForSomeUrbanAreas
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.yesForAllUrbanAreas
                    },
                ],
                "mandatory":true
            }
        ]
    },
    {
        "key":"binaryResponseTarget13",
        "target": "GBF-TARGET-013",
        "binaryIndicator": "KMGBF-INDICATOR-BIN-13",
        "title": "",
        "questions1":[ 
            {
                "key":"13_1",
                "section":"binaryResponseTarget13",
                "number":"13.1",
                "type":"option",
                "title": binaryQuestionsT.target13_question_1,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target13_question_1_c
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target13_question_1_d
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target13_question_1_e
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target13_question_1_f
                    }
                ],
                "mandatory":true
            },
            {
                "key":"13_2",
                "section":"binaryResponseTarget13",
                "number":"13.2",
                "type":"option",
                "title": binaryQuestionsT.target13_question_2,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value":"yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value":"yesFully",
                        "title": binaryQuestionsT.yesFully
                    },
                    {
                        "value":"notApplicable",
                        "title": binaryQuestionsT.notApplicable
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.digitalSequenceInformation
                    }
                ],
                "mandatory":true
            },
            {
                "key":"13_3",
                "section":"binaryResponseTarget13",
                "number":"13.3",
                "type":"option",
                "title": binaryQuestionsT.target13_question_3,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value":"yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value":"yesFully",
                        "title": binaryQuestionsT.yesFully
                    }
                ],
                "mandatory":true
            },
            {
                "key":"13_3_alt",
                "section":"binaryResponseTarget13",
                "number":"13.3.alt",
                "type":"option",
                "title": binaryQuestionsT.target13_question_3_alt,
                "multiple":false,
                "options":[
                   {
                      "value":"??", //value?
                      "title": binaryQuestionsT.target13_question_3_alt_c
                   },
                   {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target13_question_3_alt_d
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.digitalSequenceInformation
                    }
                ],
                "mandatory":true
            },
            {
                "key":"13_3_alt_bis",
                "section":"binaryResponseTarget13",
                "number":"13.3.alt.bis",
                "type":"string or text", //need to verify
                "title": binaryQuestionsT.target13_question_3_alt_bis,
                "mandatory":true
            },
            {
                "key":"13_4",
                "section":"binaryResponseTarget13",
                "number":"13.4",
                "type":"string or text", //need to verify
                "title": binaryQuestionsT.target13_question_4,
                "mandatory":true
            },
            {
                "key":"13_4_alt",
                "section":"binaryResponseTarget13",
                "number":"13.4.alt",
                "type":"string or text", //need to verify
                "title": binaryQuestionsT.target13_question_4_alt,
                "mandatory":true
            }
        ]
    },
    {
        "key":"binaryResponseTarget14",
        "target": "GBF-TARGET-014",
        "binaryIndicator": "KMGBF-INDICATOR-BIN-14",
        "title": "",
        "questions1":[ 
            {
                "key":"14_1",
                "section":"binaryResponseTarget14",
                "number":"14.1",
                "type":"option",
                "title": binaryQuestionsT.target14_question_1,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                     {
                        "value":"yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value":"yesFully",
                        "title": binaryQuestionsT.yesFully
                    } 
                ],
                "mandatory":true
            },
            {
                "key":"14_2",
                "section":"binaryResponseTarget14",
                "number":"14.2",
                "type":"option",
                "title": binaryQuestionsT.target14_question_2,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target14_question_2_c
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target14_question_2_d
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target14_question_2_e
                    } 
                ],
                "mandatory":true
            },
            {
                "key":"14_3",
                "section":"binaryResponseTarget14",
                "number":"14.3",
                "type":"option",
                "title": binaryQuestionsT.target14_question_3,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                     {
                        "value":"yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value":"yesFully",
                        "title": binaryQuestionsT.yesFully
                    } 
                ],
                "mandatory":true
            }, 
            {
                "key":"14_4",
                "section":"binaryResponseTarget14",
                "number":"14.4",
                "type":"option",
                "title": binaryQuestionsT.target14_question_4,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                     {
                         "value":"??", //value?
                        "title": binaryQuestionsT.target14_question_4_b
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target14_question_4_c
                    },
                      {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target14_question_4_d
                    },
                    {
                         "value":"??", //value?
                        "title": binaryQuestionsT.target14_question_4_e
                    } 
                ],
                "mandatory":true
            },
            {
                "key":"14_4_bis",
                "section":"binaryResponseTarget14",
                "number":"14.4.bis",
                "type":"string or text", //need to verify
                "title": binaryQuestionsT.target14_question_4_bis,
                "mandatory":true
            }
        ]
    },
    {
        "key":"binaryResponseTarget15",
        "target": "GBF-TARGET-015",
        "binaryIndicator": "KMGBF-INDICATOR-BIN-15",
        "title": "",
        "questions1":[
            {
                "key":"15_1",
                "section":"GBF-TARGET-015",
                "number":"15.1",
                "type":"option",
                "title": binaryQuestionsT.target15_question_1,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                     {
                        "value":"yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value":"yesFully",
                        "title": binaryQuestionsT.yesFully
                    }
                ],
                "mandatory":true
            },
            {
                "key":"15_2",
                "section":"GBF-TARGET-015",
                "number":"15.2",
                "type":"option",
                "title": binaryQuestionsT.target15_question_2,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                     {
                        "value":"yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value":"yesFully",
                        "title": binaryQuestionsT.yesFully
                    } 
                ],
                "mandatory":true
            },
            {
                "key":"15_3",
                "section":"GBF-TARGET-015",
                "number":"15.3",
                "type":"option",
                "title": binaryQuestionsT.target15_question_3,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                     {
                        "value":"yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value":"yesFully",
                        "title": binaryQuestionsT.yesFully
                    } 
                ],
                "mandatory":true
            }
        ]
   },
    {
        "key":"binaryResponseTarget16",
        "target": "GBF-TARGET-016",
        "binaryIndicator": "KMGBF-INDICATOR-BIN-16",
        "title": "",
        "questions1":[
            {
                "key":"16_1",
                "section":"GBF-TARGET-016",
                "number":"16.1",
                "type":"option",
                "title": binaryQuestionsT.target16_question_1,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                     {
                        "value":"yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value":"yesFully",
                        "title": binaryQuestionsT.yesFully
                    }
                ],
                "mandatory":true
            },
            {
                "key":"16_2",
                "section":"GBF-TARGET-016",
                "number":"16.2",
                "type":"option",
                "title": binaryQuestionsT.target16_question_2,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                     {
                        "value":"yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value":"yesFully",
                        "title": binaryQuestionsT.yesFully
                    } 
                ],
                "mandatory":true
            },
            {
                "key":"16_3",
                "section":"GBF-TARGET-016",
                "number":"16.3",
                "type":"option",
                "title": binaryQuestionsT.target16_question_3,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                     {
                         "value":"??", //value?
                        "title": binaryQuestionsT.target16_question_3_c
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target16_question_3_d
                    },
                    {
                        "value":"??", //value?
                        "title": binaryQuestionsT.target16_question_3_e
                    }  
                ],
                "mandatory":true
            }
        ]
    },
    {
        "key": "binaryResponseTarget17",
        "target": "GBF-TARGET-017",
        "binaryIndicator": "KMGBF-INDICATOR-BIN-17",
        "title": "",
        "questions1": [
            {
                "key": "17_1",
                "section": "GBF-TARGET-017",
                "number": "17.1",
                "type": "option",
                "title": binaryQuestionsT.target17_question_1,
                "multiple": false,
                "options": [
                    {
                        "value": "no",
                        "title": binaryQuestionsT.no
                    },
                    {
                        "value": "noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value": "??", //value?
                        "title": binaryQuestionsT.target17_question_1_c
                    },
                    {
                        "value": "yesFully",
                        "title": binaryQuestionsT.yesFully
                    }
                ],
                "mandatory": true
            },
            {
                "key": "17_2",
                "section": "GBF-TARGET-017",
                "number": "17.2",
                "type": "option",
                "title": binaryQuestionsT.target17_question_2,
                "multiple": false,
                "options": [
                    {
                        "value": "no",
                        "title": binaryQuestionsT.no
                    },
                    {
                        "value": "noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value": "yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value": "yesFully",
                        "title": binaryQuestionsT.yesFully
                    }
                ],
                "mandatory": true
            },
            {
                "key": "17_3",
                "section": "GBF-TARGET-017",
                "number": "17.3",
                "type": "option",
                "title": binaryQuestionsT.target17_question_3,
                "multiple": false,
                "options": [
                    {
                        "value": "no",
                        "title": binaryQuestionsT.no
                    },
                    {
                        "value": "noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value": "yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value": "??", //value?
                        "title": binaryQuestionsT.target17_question_3_d
                    }
                ],
                "mandatory": true
            }, 
            {
                "key": "17_3_alt_1",
                "section": "binaryResponseTarget17",
                "number": "17.3.alt.1",
                "type": "string or text", //need to verify
                "title": binaryQuestionsT.target17_question_3_alt_1,
                "mandatory": true
            },
            {
                "key": "17_3_alt_1_bis",
                "section": "binaryResponseTarget17",
                "number": "17.3.alt.1.bis",
                "type": "string or text", //need to verify
                "title": binaryQuestionsT.target17_question_3_alt_1_bis,
                "mandatory": true
            },
            {
                "key": "17_3_bis",
                "section": "binaryResponseTarget17",
                "number": "17.3.bis",
                "type": "string or text", //need to verify
                "title": binaryQuestionsT.target17_question_3_bis,
                "mandatory": true
            },
            {
                "key": "17_4",
                "section": "GBF-TARGET-017",
                "number": "17.4",
                "type": "option",
                "title": binaryQuestionsT.target17_question_4,
                "multiple": false,
                "options": [
                    {
                        "value": "no",
                        "title": binaryQuestionsT.no
                    },
                    {
                        "value": "noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value": "??", //value?
                        "title": binaryQuestionsT.target17_question_4_c
                    },
                    {
                        "value": "yesFully",
                        "title": binaryQuestionsT.yesFully
                    }
                ],
                "mandatory": true
            },
            {
                "key": "17_4_alt",
                "section": "binaryResponseTarget17",
                "number": "17.4.alt",
                "type": "string or text", //need to verify
                "title": binaryQuestionsT.target17_question_4_alt,
                "mandatory": true
            },
            {
                "key": "17_4_bis",
                "section": "binaryResponseTarget17",
                "number": "17.4.bis",
                "type": "string or text", //need to verify
                "title": binaryQuestionsT.target17_question_4_bis,
                "mandatory": true
            },
            {
                "key": "17_5",
                "section": "GBF-TARGET-017",
                "number": "17.5",
                "type": "option",
                "title": binaryQuestionsT.target17_question_5,
                "multiple": false,
                "options": [
                    {
                        "value": "no",
                        "title": binaryQuestionsT.no
                    }, 
                    {
                        "value": "??", //value?
                        "title": binaryQuestionsT.target17_question_5_b
                    },
                    {
                        "value": "yesFully",
                        "title": binaryQuestionsT.yesFully
                    }
                ],
                "mandatory": true
            }, {
                "key": "17_5_alt",
                "section": "binaryResponseTarget17",
                "number": "17.5.alt",
                "type": "string or text", //need to verify
                "title": binaryQuestionsT.target17_question_5_alt,
                "mandatory": true
            }
        ]
    },
    {
        "key": "binaryResponseTarget20",
        "target": "GBF-TARGET-020",
        "binaryIndicator": "KMGBF-INDICATOR-BIN-20",
        "title": "",
        "questions1": [
            {
                "key": "20_1",
                "section": "GBF-TARGET-020",
                "number": "20.1",
                "type": "option",
                "title": binaryQuestionsT.target20_question_1,
                "multiple": false,
                "options": [
                    {
                        "value": "no",
                        "title": binaryQuestionsT.no
                    },
                    {
                        "value": "noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value": "yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value": "yesFully",
                        "title": binaryQuestionsT.yesFully
                    }
                ],
                "mandatory": true
            }, 
            {
                "key": "20_1_bis",
                "section": "binaryResponseTarget20",
                "number": "20.1.bis",
                "type": "string or text", //need to verify
                "title": binaryQuestionsT.target20_question_1_bis,
                "mandatory": true
            },
            {
                "key": "20_2",
                "section": "GBF-TARGET-020",
                "number": "20.2",
                "type": "option",
                "title": binaryQuestionsT.target20_question_2,
                "multiple": false,
                "options": [
                    {
                        "value": "no",
                        "title": binaryQuestionsT.no
                    },
                    {
                        "value": "noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value": "yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value": "yesFully",
                        "title": binaryQuestionsT.yesFully
                    }
                ],
                "mandatory": true
            },
            {
                "key": "20_3",
                "section": "GBF-TARGET-020",
                "number": "20.3",
                "type": "option",
                "title": binaryQuestionsT.target20_question_3,
                "multiple": false,
                "options": [
                    {
                        "value": "no",
                        "title": binaryQuestionsT.no
                    },
                    {
                        "value": "noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value": "yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value": "yesFully",
                        "title": binaryQuestionsT.yesFully
                    },
                    {
                        "value": "notApplicable",
                        "title": binaryQuestionsT.notApplicable
                    }
                ],
                "mandatory": true
            },
            {
                "key": "20_4",
                "section": "GBF-TARGET-020",
                "number": "20.4",
                "type": "option",
                "title": binaryQuestionsT.target20_question_4,
                "multiple": false,
                "options": [
                    {
                        "value": "no",
                        "title": binaryQuestionsT.no
                    },
                    {
                        "value": "noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value": "yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value": "yesFully",
                        "title": binaryQuestionsT.yesFully
                    },
                    {
                        "value": "notApplicable",
                        "title": binaryQuestionsT.notApplicable
                    }
                ],
                "mandatory": true
            }, {
                "key": "20_5",
                "section": "GBF-TARGET-020",
                "number": "20.5",
                "type": "option",
                "title": binaryQuestionsT.target20_question_5,
                "multiple": false,
                "options": [
                    {
                        "value": "no",
                        "title": binaryQuestionsT.no
                    },
                    {
                        "value": "noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value": "yes",
                        "title": binaryQuestionsT.yes
                    }
                ],
                "mandatory": true
            },
            {
                "key": "20_5_alt",
                "section": "GBF-TARGET-020",
                "number": "20.5.alt",
                "type": "option",
                "title": binaryQuestionsT.target20_question_5_alt,
                "multiple": false,
                "options": [
                    {
                        "value": "??", //value?
                        "title": binaryQuestionsT.target20_question_5_alt_c
                    },
                    {
                        "value": "??", //value?
                        "title": binaryQuestionsT.target20_question_5_alt_c_bis
                    },
                    {
                        "value": "??", //value?
                        "title": binaryQuestionsT.target20_question_5_alt_c_ter
                    }
                ],
                "mandatory": true
            }
        ]
    },
    {
        "key":"binaryResponseTarget22",
        "target": "GBF-TARGET-22",
        "binaryIndicator": "KMGBF-INDICATOR-BIN-22",
        "title": "",
        "questions1":[
            {
                "key":"22_1",
                "section":"binaryResponseTarget22",
                "number":"22.1",
                "title": binaryQuestionsT.target22_question_1,
                questions:[
                    {
                        "key":"22_1_a",
                        "section":"binaryResponseTarget22",
                        "number":"(a)",
                        "type":"checkbox",
                        "title": binaryQuestionsT.target22_question_1_a,
                        "multiple":true,
                        "options":[
                            {
                                "value":"indigenousPeoplesLocalCommunities",
                                "title": binaryQuestionsT.indigenousPeoplesLocalCommunities
                            },
                            {
                                "value":"womenGirls",
                                "title": binaryQuestionsT.womenGirls
                            },
                            {
                                "value":"childrenYouth",
                                "title": binaryQuestionsT.childrenYouth
                            },
                            {
                                "value":"personWithDisabilities",
                                "title": binaryQuestionsT.personWithDisabilities
                            },
                            {
                                "value":"none",
                                "title": binaryQuestionsT.none
                            }
                        ],
                        "mandatory":true
                    },
                    {
                        "key":"22_1_b",
                        "section":"binaryResponseTarget22",
                        "number":"(b)",
                        "type":"checkbox",
                        "title": binaryQuestionsT.target22_question_1_b,
                        "multiple":true,
                        "options":[                           
                            {
                                "value":"cultureAndPractices",
                                "title": binaryQuestionsT.cultureAndPractices
                            },
                            {
                                "value":"rightsOverLandsAndTerritories",
                                "title": binaryQuestionsT.rightsOverLandsAndTerritories
                            },
                            {
                                "value":"rightsOverResources",
                                "title": binaryQuestionsT.rightsOverResources
                            },
                            {
                                "value":"rightsOverTraditionalKnowledge",
                                "title": binaryQuestionsT.rightsOverTraditionalKnowledge
                            },
                            {
                                "value":"notApplicable",
                                "title": binaryQuestionsT.notApplicable
                            }
                        ],
                        "mandatory":true
                    },
                    {
                        "key":"22_1_c",
                        "section":"binaryResponseTarget22",
                        "number":"(c)",
                        "type":"option",
                        "title": binaryQuestionsT.target22_question_1_c,
                        "multiple":false,
                        "options":[
                            {
                                "value":"no",
                                "title": binaryQuestionsT.no
                            },
                            {
                                "value":"yes",
                                "title": binaryQuestionsT.yes
                            },
                        ],
                        "mandatory":true
                    },
                    {
                        "key":"22_1_d",
                        "section":"binaryResponseTarget22",
                        "number":"(d)",
                        "type":"checkbox",
                        "title": binaryQuestionsT.target22_question_1_d,
                        "multiple":true,
                        "options":[
                           {
                                "value":"indigenousPeoplesLocalCommunities",
                                "title": binaryQuestionsT.indigenousPeoplesLocalCommunities
                            },
                            {
                                "value":"womenGirls",
                                "title": binaryQuestionsT.womenGirls
                            },
                            {
                                "value":"childrenYouth",
                                "title": binaryQuestionsT.childrenYouth
                            },
                            {
                                "value":"personWithDisabilities",
                                "title": binaryQuestionsT.personWithDisabilities
                            },
                            {
                                "value":"none",
                                "title": binaryQuestionsT.none
                            }
                        ],
                        "mandatory":true
                    },
                    {
                        "key":"22_1_e",
                        "section":"binaryResponseTarget22",
                        "number":"(e)",
                        "type":"checkbox",
                        "title": binaryQuestionsT.target22_question_1_e,
                        "multiple":true,
                        "options":[
                           {
                                "value":"indigenousPeoplesLocalCommunities",
                                "title": binaryQuestionsT.indigenousPeoplesLocalCommunities
                            },
                            {
                                "value":"womenGirls",
                                "title": binaryQuestionsT.womenGirls
                            },
                            {
                                "value":"childrenYouth",
                                "title": binaryQuestionsT.childrenYouth
                            },
                            {
                                "value":"personWithDisabilities",
                                "title": binaryQuestionsT.personWithDisabilities
                            },
                            {
                                "value":"none",
                                "title": binaryQuestionsT.none
                            }
                        ],
                        "mandatory":true
                    },
                ]
            },
            {
                "key":"22_2",
                "section":"binaryResponseTarget22",
                "number":"22.2",
                "type":"option",
                "title": binaryQuestionsT.target22_question_2,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value":"yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value":"yesFully",
                        "title": binaryQuestionsT.yesFully
                    },
                ],
                "mandatory":true
            },
            {
                "key":"22_3",
                "section":"binaryResponseTarget22",
                "number":"22.3",
                "type":"option",
                "title": binaryQuestionsT.target22_question_3,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                       "value": "??", //value?
                       "title": binaryQuestionsT.yesFinancialAllocationsFromNationalBudget
                    },
                    {
                        "value": "??", //value?
                        "title": binaryQuestionsT.yesFinancialAllocationsFromOtherResource
                    }
                ],
                "mandatory":true
            },
            {
                "key":"22_4",
                "section":"binaryResponseTarget22",
                "number":"22.4",
                "type":"option",
                "title": binaryQuestionsT.target22_question_4,
                "multiple":false,
                "options":[
                   {
                      "value":"no",
                      "title": binaryQuestionsT.no
                   },
                   {
                        "value":"yes",
                        "title": binaryQuestionsT.yes
                    }
                ],
                "mandatory":true
            },
            {
                "key":"22_5",
                "section":"binaryResponseTarget22",
                "number":"22.5",
                "title": binaryQuestionsT.target22_question_5,
                questions:[
                    {
                        "key":"22_5_a",
                        "section":"binaryResponseTarget22",
                        "number":"(a)",
                        "type":"checkbox",
                        "title": binaryQuestionsT.target22_question_5_a,
                        "multiple":true,
                        "options":[
                            {
                                "value":"indigenousPeoplesLocalCommunities",
                                "title": binaryQuestionsT.indigenousPeoplesLocalCommunities
                            },
                            {
                                "value":"womenGirls",
                                "title": binaryQuestionsT.womenGirls
                            },
                            {
                                "value":"childrenYouth",
                                "title": binaryQuestionsT.childrenYouth
                            },
                            {
                                "value":"personWithDisabilities",
                                "title": binaryQuestionsT.personWithDisabilities
                            },
                            {
                                "value":"none",
                                "title": binaryQuestionsT.none
                            }
                        ],
                        "mandatory":true
                    },
                    {
                        "key":"22_5_b",
                        "section":"binaryResponseTarget22",
                        "number":"(b)",
                        "type":"checkbox",
                        "title": binaryQuestionsT.target22_question_5_b,
                        "multiple":true,
                        "options":[                           
                            {
                                "value":"cultureAndPractices",
                                "title": binaryQuestionsT.cultureAndPractices
                            },
                            {
                                "value":"rightsOverLandsAndTerritories",
                                "title": binaryQuestionsT.rightsOverLandsAndTerritories
                            },
                            {
                                "value":"rightsOverResources",
                                "title": binaryQuestionsT.rightsOverResources
                            },
                            {
                                "value":"rightsOverTraditionalKnowledge",
                                "title": binaryQuestionsT.rightsOverTraditionalKnowledge
                            },
                            {
                                "value":"notApplicable",
                                "title": binaryQuestionsT.notApplicable
                            }
                        ],
                        "mandatory":true
                    },
                    {
                        "key":"22_5_c",
                        "section":"binaryResponseTarget22",
                        "number":"(c)",
                        "type":"option",
                        "title": binaryQuestionsT.target22_question_5_c,
                        "multiple":false,
                        "options":[
                            {
                                "value":"no",
                                "title": binaryQuestionsT.no
                            },
                            {
                                "value":"yes",
                                "title": binaryQuestionsT.yes
                            },
                        ],
                        "mandatory":true
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
        "questions1": [
            {
                "key": "23_1",
                "section": "binaryResponseTarget23",
                "number": "23.1",
                "type": "option",
                "title": binaryQuestionsT.target23_question_1,
                "multiple": false,
                "options": [
                    {
                        "value": "no",
                        "title": binaryQuestionsT.no
                    },
                    {
                        "value": "noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value": "yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value": "yesFully",
                        "title": binaryQuestionsT.yesFully
                    },
                ],
                "mandatory": true
            },
            {
                "key": "23_2",
                "section": "binaryResponseTarget23",
                "number": "23.2",
                "type": "option",
                "title": binaryQuestionsT.target23_question_2,
                "multiple": false,
                "options": [
                    {
                        "value": "no",
                        "title": binaryQuestionsT.no
                    },
                    {
                        "value": "noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value": "yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value": "yesFully",
                        "title": binaryQuestionsT.yesFully
                    },
                ],
                "mandatory": true
            },
            {
                "key": "23_3",
                "section": "binaryResponseTarget23",
                "number": "23.3",
                "type": "option",
                "title": binaryQuestionsT.target23_question_3,
                "multiple": false,
                "options": [
                    {
                        "value": "no",
                        "title": binaryQuestionsT.no
                    },
                    {
                        "value": "noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value": "yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value": "yesFully",
                        "title": binaryQuestionsT.yesFully
                    },
                ],
                "mandatory": true
            },
            {
                "key": "23_4",
                "section": "binaryResponseTarget23",
                "number": "23.4",
                "type": "option",
                "title": binaryQuestionsT.target23_question_4,
                "multiple": false,
                "options": [
                    {
                        "value": "no",
                        "title": binaryQuestionsT.no
                    },
                    {
                        "value": "??", //value?
                        "title": binaryQuestionsT.yesFinancialAllocationsFromNationalBudget
                    },
                    {
                        "value": "??", //value?
                        "title": binaryQuestionsT.yesFinancialAllocationsFromOtherResource
                    }, 
                ],
                "mandatory": true
            },
            {
                "key": "23_5",
                "section": "binaryResponseTarget23",
                "number": "23.5",
                "type": "option",
                "title": binaryQuestionsT.target23_question_5,
                "multiple": false,
                "options": [
                    {
                        "value": "no",
                        "title": binaryQuestionsT.no
                    },
                    {
                        "value": "yes",
                        "title": binaryQuestionsT.yes
                    },
                ],
                "mandatory": true
            },
            {
                "key": "23_6",
                "section": "binaryResponseTarget23",
                "number": "23.6",
                "type": "option",
                "title": binaryQuestionsT.target23_question_6,
                "multiple": false,
                "options": [
                    {
                        "value": "no",
                        "title": binaryQuestionsT.no
                    },
                    {
                        "value": "noButUnderDevelopment",
                        "title": binaryQuestionsT.noButUnderDevelopment
                    },
                    {
                        "value": "yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value": "yesFully",
                        "title": binaryQuestionsT.yesFully
                    },
                ],
                "mandatory": true
            },
            {
                "key": "23_7",
                "section": "binaryResponseTarget23",
                "number": "23.7",
                "type": "option",
                "title": binaryQuestionsT.target23_question_7,
                "multiple": false,
                "options": [
                    {
                        "value": "no",
                        "title": binaryQuestionsT.no
                    },
                    {
                        "value": "yesPartially",
                        "title": binaryQuestionsT.yesPartially
                    },
                    {
                        "value": "yesFully",
                        "title": binaryQuestionsT.yesFully
                    },
                ],
                "mandatory": true
            },
        ]
    }
]