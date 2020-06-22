import * as Lambda from 'aws-lambda';
import * as Line from "@line/bot-sdk";
import * as Types from "@line/bot-sdk/lib/types";
import { WebhookEvent } from '@line/bot-sdk';
import { type } from 'os';
import { types } from 'util';
import { MessageChannel } from 'worker_threads';
import { EncryptionKey } from 'aws-lambda';

const questionDB = [
    {
        "question": "カール大帝の死後、フランク王国は3つに分裂したが、そのうち西フランク王国は現在のどの国の原型になったか？",
        "answer": "フランス"
    },
    {
        "question": "9~10Cに西進して西ヨーロッパに移入し、定住し始めたマージャル人は現在の何人の祖と言われている？",
        "answer": "ハンガリー人"
    },
    {
        "question": "ノルマン人の現住地と言われる、北海とバルト海に面した地域を何というか？",
        "answer": "スカンディナヴィア"
    },
    {
        "question": "862年にヴァイキングの主張リュークが、配下のルーシ族とノヴゴロドを中心に建てたノヴゴロド国は現在のどの国の中心部にあたるか？",
        "answer": "ロシア"
    },
    {
        "question": "10世紀にチェック人によってベーメン王国が建てられたが、後に神聖ローマ帝国に組み込まれたベーメン地方は現在のどの国にあたるか",
        "answer": "チェコ"
    },
    {
        "question": "キリスト教・ユダヤ教・イスラム教の3つの聖地とされている都市はどこか。またその都市は現在のどの国の都市か。",
        "answer": "聖地：イェルサレム 国：イスラエル"
    },
    {
        "question": "北イタリアのアドリア海に面し、13世紀に第四回十字軍の遠征を主導して以来、東方貿易で栄えた港市はどこか。",
        "answer": "ヴィネツィア"
    },
    {
        "question": "北イタリアの地中海沿岸に位置した港市で⑧のライバルとして台頭した都市は？",
        "answer": "ジェノヴァ"
    },
    {
        "question": "北イタリアのトスカナ平野の中心部で、毛織物生産と貿易・金融で栄え、15世紀にはメディチ家の支配のもとでルネサンスの中心となった都市は？",
        "answer": "フィレンツェ"
    },
    {
        "question": "ドイツのバルト海沿岸の港市で、12世紀にザクセン公が建設して以来、バルト海・北海貿易の中心となった都市はどこか",
        "answer": "リューベク"
    },
    {
        "question": "ハンザ同盟の中心都市として北海貿易をリードした、エルベ川河口に位置する都市はどこか",
        "answer": "ハンブルク"
    },
    {
        "question": "10世紀以降の毛織物産業で繁栄し、中世当時ネーデルランド西南部を指した「フランドル」地方は現在で言うとどの国の範囲にあたる？",
        "answer": "ベルギー"
    },
    {
        "question": "1390年フランス国王フィリップ4世が教皇クレメンス5世を強制移転させる際に移転先とされえたフランス南東部の都市は？",
        "answer": "アヴィニョン"
    },
    {
        "question": "キリスト教徒がイスラム教徒を駆逐して、国土を解放しようとした「国土回復運動」で知られる現在スペインとポルトガルがある半島の名前は？",
        "answer": "イベリア半島"
    },
    {
        "question": "バルトロメウ＝ディアスが到達し、アフリカを迂回して東洋へ向かう航路の可能性を開くきっかけとなったアフリカ南端の岬の名前は？",
        "answer": "喜望峰"
    },
    {
        "question": "現在セレベス海とニューギニア島に挟まれる形に位置し、16世紀にヨーロッパ各国が香辛料を求めて来航した島嶼部の名前は？",
        "answer": "モルッカ諸島"
    },
    {
        "question": "バハマ諸島沖でコロンブス一行が最初に上陸した島で「聖なる救世主」を意味する島の名前は？",
        "answer": "サンサルバドル島"
    },
    {
        "question": "チューリヒ・バーゼルとともに宗教改革の改革派が多く、カルヴァンが招かれて神政政治を行い、スイス宗教改革の中心となった都市は？",
        "answer": "ジェネーヴ"
    },
    {
        "question": "中世以降の中継貿易や毛織物生産で繁栄した地域「ネーデルランド」は現在で言うとどの国の範囲に相当するか",
        "answer": "オランダ・ベルギー"
    },
    {
        "question": "ネーデルランド北部の大港市で現在もオランダの首都として繁栄を続ける都市は？",
        "answer": "アムステルダム"
    },
    {
        "question": "1648年ウェストファリア条約で独立が国際的に認められた国を２つ答えよ",
        "answer": "スイス・オランダ"
    },
    {
        "question": "工業・鉱業が盛んで1740年のオーストリア継承戦争によってオーストリアからプロイセンに領有権が移った現在のシロンスク地方の当時の呼び名は？",
        "answer": "シュレジェン"
    },
    {
        "question": "1703年ピョートル1世が建設をはじめ、当時のロシア帝国の首都にして、現在でもバルト海に面したネヴァ川河口にある主要都市はどこか",
        "answer": "サンクトペテルブルク"
    },
    {
        "question": "イギリスがインドの植民地活動を展開するにあたり、拠点としていた都市はマドラス・ボンベイともう１つは？",
        "answer": "カルカッタ"
    },
    {
        "question": "イングランド中西部の工業都市として、産業革命の中心となり、結果的にランカシャー地方最大の木綿工業都市として発展した都市名を答えよ。",
        "answer": "マンチェスター"
    },
    {
        "question": "1805年ナポレオンがロシア・オーストリアの連合軍を破ったアウステルリッツの戦いの場となった国",
        "answer": "チェコ"
    },
    {
        "question": "ナポレオンがイギリス・プロイセン・オランダの連合軍に破れたワーテルローの戦いの場となった国",
        "answer": "ベルギー"
    },
    {
        "question": "1815年退位後、ナポレオンが流された南大西洋上のイギリス領の孤島の名前",
        "answer": "セントヘレナ島"
    },
    {
        "question": "ウィーン会議で有名なウィーンは現在のどの国のとしか",
        "answer": "オーストリア"
    },
    {
        "question": "鉱山資源が非常に豊かなことで知られ、1871年の普仏戦争の結果フランス領からドイツ領になった地域",
        "answer": "アルザス・ロレーヌ"
    },
    {
        "question": "ドイツの3B政策で知られる3Bとはベルリン・ビザンティウムとそれからどこ？都市と国名を答えよ",
        "answer": "バクダート・イラク"
    },
    {
        "question": "イギリスの3C政策で知られる3Cとはケープタウン・カルカッタとそれからどこ？都市と国名を答えよ",
        "answer": "カイロ・エジプト"
    },
    {
        "question": "第一次世界対戦集結の為に結ばれたヴェルサイユ条約のヴェルサイユはどこの国？",
        "answer": "フランス"
    },
    {
        "question": "18世紀以降、列強に分割を繰り返された現在のドイツの東方に位置するスラブ民族系の国家はどこ？",
        "answer": "ポーランド"
    },
    {
        "question": "第二次世界大戦中、ヒトラーが迫害を続け、大量に虐殺された民族",
        "answer": "ユダヤ人"
    },
    {
        "question": "チェコスロバキヤとドイツの国境地帯にあり、ヒトラーが割譲を求め続けて戦争の可能性をしめして威嚇し続けた。その地方の名前は？",
        "answer": "ズデーテン地方"
    },
    {
        "question": "第二次世界対戦中の大作戦で有名なノルマンディーは現在のどこの国にあるか",
        "answer": "フランス"
    },
    {
        "question": "1993年マーストリヒト条約が発効して。ヨーロッパ諸国のさらなる統合を進めていく機構として発足した機構の名前は？",
        "answer": "EU"
    },
    {
        "question": "現在WHOやWTOなど、世界の主要な期間の本部が集まるスイスの都市はどこか",
        "answer": "ジェネーヴ"
    },
    {
        "question": "三内丸山遺跡がある県",
        "answer": "青森県"
    },
    {
        "question": "吉野ヶ里遺跡がある県",
        "answer": "佐賀県"
    },
    {
        "question": "漢委奴国王印、金印が発見された福岡県の島の名前は？",
        "answer": "志賀島"
    },
    {
        "question": "大山古墳は大阪府の何市にある？",
        "answer": "堺市"
    },
    {
        "question": "飛鳥文化が栄えたのは何県のあたり？",
        "answer": "奈良県"
    },
    {
        "question": "法隆寺は奈良県の何町にある？",
        "answer": "斑鳩町（いかるが町）"
    },
    {
        "question": "710年平城京は何市",
        "answer": "奈良市"
    },
    {
        "question": "防人は何地方の海岸の防備をした？",
        "answer": "九州地方"
    },
    {
        "question": "794年平安京は現在の何市？",
        "answer": "京都市"
    },
    {
        "question": "紀貫之の「土佐日記」自宅への帰宅中の出来事について書かれているが、どこからどの都道府県？",
        "answer": "高知県から京都府"
    },
    {
        "question": "源氏物語で六条御息所の生霊に殺された夕顔が仮装された京都を代表する川",
        "answer": "宇治川"
    },
    {
        "question": "学問の神様として祀っている天満宮がある市は",
        "answer": "太宰府市"
    },
    {
        "question": "蝦夷が暮らしていた地方は",
        "answer": "東北地方"
    },
    {
        "question": "平等院鳳凰堂があるのは京都の何市？",
        "answer": "宇治市"
    },
    {
        "question": "藤原純友の乱が起こったのは何県？",
        "answer": "愛媛県"
    },
    {
        "question": "平将門が拠点として活躍した岩井市や猿島町があるのは現在の何市？",
        "answer": "坂東市"
    },
    {
        "question": "奥州藤原氏の拠点で中尊寺金色堂がある町",
        "answer": "平泉町"
    },
    {
        "question": "平清盛が整備、日宋貿易の拠点港にもなった大輪田泊があったのは現在の何市？_",
        "answer": "神戸市"
    },
    {
        "question": "厳島神社があるのは何県",
        "answer": "広島県"
    },
    {
        "question": "冨士川の戦いがあったのは？",
        "answer": "静岡県"
    },
    {
        "question": "倶利伽羅峠の戦いがあったのは何県と何県の間？",
        "answer": "富山県と石川県"
    }
    ,
    {
        "question": "一の谷の戦いがあった県",
        "answer": "兵庫県"
    },
    {
        "question": "屋島の戦いがあった県",
        "answer": "香川県"
    },
    {
        "question": "壇ノ浦の戦いがあった県",
        "answer": "山口県"
    },
    {
        "question": "承久の乱で後鳥羽上皇が流されたところは？",
        "answer": "隠岐"
    },
    {
        "question": "六波羅探題が置かれた市は？",
        "answer": "京都市"
    },
    {
        "question": "元寇を防ぐ為に作られた防塁の跡があるのは何県？",
        "answer": "福岡県"
    },
    {
        "question": "朝鮮との貿易において重要な役割を果たし、そうしによって繁栄した長崎県に属する島は",
        "answer": "対馬"
    },
    {
        "question": "十三湊があるのは何県",
        "answer": "青森県"
    },
    {
        "question": "直江津があるのは何県",
        "answer": "新潟県"
    },
    {
        "question": "山城国があるのは現在のどこの都道府県？",
        "answer": "京都府"
    },
    {
        "question": "一向一揆によって100年間自治が行われた加賀国は現在の何県",
        "answer": "石川県"
    },
    {
        "question": "日明貿易で栄えた大内氏が治めていたのは現在の何県",
        "answer": "山口県"
    },
    {
        "question": "種子島は現在の何県",
        "answer": "鹿児島県"
    },
    {
        "question": "ポルトガル船の寄港地で西の京ともいわれた長崎県北部の市",
        "answer": "平戸市"
    },
    {
        "question": "南蛮文化の窓口",
        "answer": "堺市"
    },
    {
        "question": "国友は現在の何県にある？",
        "answer": "滋賀県"
    },
    {
        "question": "厳島の戦いは何県で行われた？",
        "answer": "広島県"
    },
    {
        "question": "桶狭間の戦いが行われたのは何県？",
        "answer": "愛知県」"
    },
    {
        "question": "川中島の戦いが行われたのは何県？",
        "answer": "長野県"
    },
    {
        "question": "長篠の戦いが行われたのは何県？",
        "answer": "愛知県"
    },
    {
        "question": "小牧・長久手の戦いが行われたのは何県？",
        "answer": "愛知県"
    },
    {
        "question": "安土城は何県にあるか",
        "answer": "滋賀県"
    },
    {
        "question": "賤が岳の戦いが行われたのは何県？",
        "answer": "滋賀県"
    },
    {
        "question": "関ヶ原の戦いが行われたのは何県？",
        "answer": "岐阜県"
    },
    {
        "question": "佐渡金山は何県？",
        "answer": "新潟県"
    },
    {
        "question": "但馬生野銀山は何県？",
        "answer": "兵庫県"
    },
    {
        "question": "石見銀山は何県？",
        "answer": "島根県"
    },
    {
        "question": "足尾銅山は何県？",
        "answer": "栃木県"
    },
    {
        "question": "別子銅山は何県？",
        "answer": "愛媛県"
    },
    {
        "question": "島原・天草一揆は何県と何県で起こった？",
        "answer": "長崎県と熊本県"
    },
    {
        "question": "松前はどの都道府県？",
        "answer": "北海道"
    },
    {
        "question": "朝鮮通信史の寄港地のある県",
        "answer": "岡山県"
    },
    {
        "question": "西回り航路の起点となった東北、日本海側の都市",
        "answer": "酒田市"
    },
    {
        "question": "ペリーが来航した浦賀は何県",
        "answer": "神奈川県"
    },
    {
        "question": "日米和親条約で開港した下田は何県？",
        "answer": "静岡県"
    },
    {
        "question": "吉田松陰が開いた塾があったのは山口県の何市？",
        "answer": "萩市"
    },
    {
        "question": "薩摩藩によるイギリス人殺傷事件があったのは何県",
        "answer": "神奈川県"
    },
    {
        "question": "戊辰戦争で最後まで新政府軍に抵抗し、「白虎隊」の悲劇で有名な都市は？",
        "answer": "会津若松市"
    },
    {
        "question": "五稜郭の戦いがあったのは何市",
        "answer": "函館市"
    },
    {
        "question": "肥前は何県と何県か",
        "answer": "佐賀県と長崎県"
    },
    {
        "question": "富岡製糸場があるのは？",
        "answer": "群馬県"
    },
    {
        "question": "西南戦争の激戦地で1日の弾丸使用量が32万発の戦いが行われた場所",
        "answer": "田原坂"
    },
    {
        "question": "秩父事件の舞台は何県",
        "answer": "埼玉県"
    },
    {
        "question": "八幡製鉄所は現在の何市にあるか",
        "answer": "北九州市"
    },
    {
        "question": "沖縄県南部にある太平洋戦争の犠牲者を慰霊する施設は？",
        "answer": "ひめゆりの塔"
    }
]
const accessToken = process.env.ACCESS_TOKEN!;
const channelSecret = process.env.CHANNEL_SECRET!;

const config: Line.ClientConfig = {
    channelAccessToken: accessToken,
    channelSecret: channelSecret,
};
const client = new Line.Client(config);

async function eventHandler(event: any) {
    let returnMessage: any;
    switch (event.type) {
        case 'message':
            returnMessage = await messageFunc(event)
            break;
        case 'postback':
            returnMessage = await postbackFunc(event)
            break;
        case 'follow':
            returnMessage = {
                "type": "flex",
                "altText": "Flex Message",
                "contents": {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                        "type": "box",
                        "layout": "vertical",
                        "spacing": "md",
                        "contents": [
                            {
                                "type": "text",
                                "text": "友達登録ありがとう！",
                                "align": "center"
                            },
                            {
                                "type": "text",
                                "text": "このBotの使い方",
                                "size": "md",
                                "align": "start",
                                "weight": "bold"
                            }
                        ]
                    },
                    "body": {
                        "type": "box",
                        "layout": "vertical",
                        "spacing": "none",
                        "contents": [
                            {
                                "type": "text",
                                "text": "①「 問題開始 」と送信",
                                "align": "start"
                            },
                            {
                                "type": "text",
                                "text": "②問題の答えを声に出す",
                                "align": "start"
                            },
                            {
                                "type": "text",
                                "text": "③       回答をチェックする",
                                "align": "start"
                            },
                            {
                                "type": "text",
                                "text": "④次の問題に答える"
                            }
                        ]
                    },
                    "footer": {
                        "type": "box",
                        "layout": "horizontal",
                        "contents": [
                            {
                                "type": "button",
                                "action": {
                                    "type": "message",
                                    "label": "とにかく始めるボタン",
                                    "text": "問題開始"
                                },
                                "style": "primary"
                            }
                        ]
                    }
                }
            }
            break;
    }

    const mes: Types.Message = returnMessage
    return client.replyMessage(event.replyToken, mes);
}

async function messageFunc(event: any) {
    let mes: any;
    if (event.message.text === "問題開始") {
        var start_ms = new Date().getTime();
        start_ms = Math.floor(start_ms / 1000);
        const randomNumber = intRandom(0, questionDB.length - 1);
        function intRandom(min: any, max: any) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        mes =
        {
            "type": "flex",
            "altText": "Flex Message",
            "contents": {
                "type": "bubble",
                "direction": "ltr",
                "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "text": `問題-${start_ms}`,
                            "align": "center"
                        }
                    ]
                },
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "text": `${questionDB[randomNumber].question}`,
                            "align": "center",
                            "wrap": true
                        }
                    ]
                },
                "footer": {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                        {
                            "type": "button",
                            "action": {
                                "type": "postback",
                                "label": "回答する&次の問題",
                                "data": `${questionDB[randomNumber].answer}-${start_ms}`
                            }
                        }
                    ]
                },
                "styles": {
                    "header": {
                        "backgroundColor": "#50FF5E"
                    }
                }
            }
        }
    }
    else if (event.message.type === "text") {
        mes = { type: "text", text: "「 問題開始 」でスタートできるよ！" }
    }
    else {

    }
    return mes;
}

async function postbackFunc(event: any) {
    let mes: any

    let str = event.postback.data;
    let result = str.split("-");
    // result[0] //前回の問題の回答
    // result[1] //前回の問題の時間

    var end_ms = new Date().getTime();
    end_ms = Math.floor(end_ms / 1000);

    let answerTime = end_ms - Number(result[1])

    var hour = Math.floor(answerTime / 3600);
    var hour_wari = Math.floor(answerTime % 3600);
    var min = Math.floor(hour_wari / 60);
    var min_wari = Math.floor(hour_wari % 60);
    var sec = min_wari;

    const randomNumber = intRandom(0, questionDB.length - 1);
    function intRandom(min: any, max: any) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    mes =
        [{
            "type": "flex",
            "altText": "Flex Message",
            "contents": {
                "type": "bubble",
                "direction": "ltr",
                "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "text": `↑答え：${result[0]}`,
                            "align": "center"
                        },
                        {
                            "type": "text",
                            "text": `↑回答時間：${hour}時間${min}分${sec}秒`,
                            "align": "center",
                            "wrap": true
                        }
                    ]
                }
            }
        },
        {
            "type": "flex",
            "altText": "Flex Message",
            "contents": {
                "type": "bubble",
                "direction": "ltr",
                "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "text": `問題-${end_ms}`,
                            "align": "center"
                        }
                    ]
                },
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "text": `${questionDB[randomNumber].question}`,
                            "align": "center",
                            "wrap": true
                        }
                    ]
                },
                "footer": {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                        {
                            "type": "button",
                            "action": {
                                "type": "postback",
                                "label": "回答する&次の問題",
                                "data": `${questionDB[randomNumber].answer}-${end_ms}`
                            }
                        }
                    ]
                },
                "styles": {
                    "header": {
                        "backgroundColor": "#50FF5E"
                    }
                }
            }
        }]

    return mes
}


export const handler: Lambda.APIGatewayProxyHandler = async (proxyEevent: Lambda.APIGatewayEvent, _context) => {
    console.log(JSON.stringify(proxyEevent));

    // 署名確認
    const signature = proxyEevent.headers["X-Line-Signature"];
    if (!Line.validateSignature(proxyEevent.body!, channelSecret, signature)) {
        throw new Line.SignatureValidationFailed("signature validation failed", signature);
    }

    const body: Line.WebhookRequestBody = JSON.parse(proxyEevent.body!);
    await Promise
        .all(body.events.map(async event => eventHandler(event as Types.MessageEvent)))
        .catch(err => {
            console.error(err.Message);
            return {
                statusCode: 500,
                body: "Error"
            }
        })
    return {
        statusCode: 200,
        body: "OK"
    }
}