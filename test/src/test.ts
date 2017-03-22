var canvas = document.getElementById("app") as HTMLCanvasElement;
var stage = engine.run(canvas);

var newMap: TileMap = new TileMap();
newMap.x = 0;
newMap.y = 0;
stage.addChild(newMap);

// var Character: Player = new Player();
// Character.x = 0;
// Character.y = 0;
// stage.addChild(Character);

// var taskService: TaskService = TaskService.getInstance();
// var task_0: Task = TaskFactory.createOneTask("task_0");
// var task_1: Task = TaskFactory.createOneTask("task_1");

// var npc_0: NPC = new NPC("npc_0", "npc_0.png");
// npc_0.x = 128;
// npc_0.y = 128;
// stage.addChild(npc_0);

// var npc_1: NPC = new NPC("npc_1", "npc_1.png");
// npc_1.x = 576;
// npc_1.y = 576;
// stage.addChild(npc_1);

// var monster: Monster = MonsterFactory.createOneMonster("monster.png");
// monster.x = 256;
// monster.y = 256;
// stage.addChild(monster);

// var user: User = User.getInstance();
// var hero: Hero = new Hero(10, 10);
// var equipment: Equipment = new Equipment(10, "w1.jpg");
// var equipment1: Equipment = new Equipment(20, "w2.jpg");
// var equipment2: Equipment = new Equipment(999, "w3.jpg");
// var jewll: Jewll = new Jewll(10);
// var jewll1: Jewll = new Jewll(20);
// var jewll2: Jewll = new Jewll(999);
// user.addHero(hero);
// hero.addEquipment(equipment);
// hero.addEquipment(equipment1);
// hero.addEquipment(equipment2);
// equipment.addJewll(jewll);
// equipment1.addJewll(jewll1);
// equipment2.addJewll(jewll2);

// var gameScene: GameScene = new GameScene(Character, newMap, npc_0, npc_1, monster, stage);
// GameScene.replaceScene(gameScene); 

// var UImanager: UiManager = new UiManager(stage);
// UiManager.replaceCurrentUiManager(UImanager);

