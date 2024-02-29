import binaryQuestionsT from '~/i18n/en/app-data/binary-indicator-questions.json'

export const binaryIndicatorQuestions = [
    {
        "key":"GBF-GOAL-B",
        "target": "GBF-GOAL-B",
        "binaryIndicator": "KMGBF-INDICATOR-BIN-B",
        "title": "",
        "questions":[
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
        ],
        "note": ""
    },
    {
        "key":"GBF-TARGET-01",
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
        "key":"goalB",
        "target": "",
        "binaryIndicator": "",
        "title": "",
        "questions":[
            {
                "key":"",
                "section":"goalB",
                "number":"",
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
                "key":"",
                "section":"goalB",
                "number":"",
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
        ],
        "note": ""
    },
    {
        "key":"goalB",
        "target": "",
        "binaryIndicator": "",
        "title": "",
        "questions":[
            {
                "key":"",
                "section":"goalB",
                "number":"",
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
                "key":"",
                "section":"goalB",
                "number":"",
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
        ],
        "note": ""
    }
]