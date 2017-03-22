var gameconfig_json = {
    "tasks": [
        {
            "id": "0",
            "name": "被抢走的武器",
            "type":"dialog",
            "status": 5,
            "desc": "莉兹贝特好像有什么事情想和你商量，去找她聊聊吧。",
            "fromNpcId": "npc_0",
            "toNpcId": "npc_0",
            "current": 0,
            "total": 10,
            "nextTaskId":"1"
        },
        {
            "id": "1",
            "name": "夺回传说级武器",
            "type":"killMonster",
            "status": 0,
            "desc": "杀死狼人，得到其身上掉落的武器，向艾基尔汇报。",
            "fromNpcId": "npc_1",
            "toNpcId": "npc_1",
            "current": 0,
            "total": 10,
            "nextTaskId":null
        }
    ],
    "npcs": [
        {
            "id": "npc_0",
            "name": "莉兹贝特",
            "bitmap": "resource/assets/npc_0.png",
            "emoji": 0,
            "tachie": "resource/assets/npc_0_tachie.jpg",
            "x": 475,
            "y": 125
        },
        {
            "id": "npc_1",
            "name": "艾基尔",
            "bitmap": "resource/assets/npc_1.png",
            "emoji": 0,
            "tachie": "resource/assets/npc_1_tachie.jpg",
            "x": 25,
            "y": 225
        }
    ],
    "monsters":[
        {
            "id":"0",
            "linkTaskId":"1",
            "image":"resource/assets/monster.jpg"
        }
    ]
}

var dialogue_json = {
    "dialogue": [
        {
            "id": 1,
            "actorName": "Lisbeth",
            "tachie": "resource/assets/npc_0_tachie.png",
            "side": "right",
            "taskId": 0,
            "content": "啊，桐人，你来得正好！"
        },
        {
            "id": 2,
            "actorName": "Kirito",
            "tachie": "resource/assets/npc_1_tachie.png",
            "side": "left",
            "taskId": 0,
            "content": "怎么了？"
        },
        {
            "id": 3,
            "actorName": "Lisbeth",
            "tachie": "resource/assets/npc_0_tachie.png",
            "side": "right",
            "taskId": 0,
            "content": "实际上……我昨天做了一把传说级武器……"
        },
        {
            "id": 4,
            "actorName": "Kirito",
            "tachie": "resource/assets/npc_1_tachie.png",
            "side": "left",
            "taskId": 0,
            "content": "喔，那不是很好嘛。"
        },
        {
            "id": 5,
            "actorName": "Lisbeth",
            "tachie": "resource/assets/npc_0_tachie.png",
            "side": "right",
            "taskId": 0,
            "content": "……然后想拿去卖，结果半路上被一只狼人抢走了……"
        },
        {
            "id": 6,
            "actorName": "Kirito",
            "tachie": "resource/assets/npc_1_tachie.png",
            "side": "left",
            "taskId": 0,
            "content": "……"
        },
        {
            "id": 7,
            "actorName": "Lisbeth",
            "tachie": "resource/assets/npc_0_tachie.png",
            "side": "right",
            "taskId": 0,
            "content": "……"
        },
        {
            "id": 8,
            "actorName": "Kirito",
            "tachie": "resource/assets/npc_1_tachie.png",
            "side": "left",
            "taskId": 0,
            "content": "好吧，我去会会那家伙。"
        },
        {
            "id": 9,
            "actorName": "Lisbeth",
            "tachie": "resource/assets/npc_0_tachie.png",
            "side": "right",
            "taskId": 0,
            "content": "谢谢！啊拿回来以后顺便帮我送到艾基尔那儿去吧~"
        },
        {
            "id": 10,
            "actorName": "Kirito",
            "tachie": "resource/assets/npc_1_tachie.png",
            "side": "left",
            "taskId": 0,
            "content": "还要免费跑腿啊……"
        }
    ]
}