var mqtt = require('Mqtt/mqttServer');

var com = require('./Common');

cc.Class({
    extends: cc.Component,


    properties: {

        /*Name : 
            {
                default : null,
                type : cc.String,
            },
        */
        _NewUnkownPiece : cc.Node,

        BlackAdvisor:{
            default: null,
            type: cc.Prefab
        },
        BlackCannon:{
            default: null,
            type: cc.Prefab
        },
        BlackElephant:{
            default: null,
            type: cc.Prefab
        },
        BlackGeneral:{
            default: null,
            type: cc.Prefab
        },
        BlackHorse:{
            default: null,
            type: cc.Prefab
        },
        BlackPawn:{
            default: null,
            type: cc.Prefab
        },
        BlackRook:{
            default: null,
            type: cc.Prefab
        },
        RedAdvisor:{
            default: null,
            type: cc.Prefab
        },
        RedBishop:{
            default: null,
            type: cc.Prefab
        },
        RedCannon:{
            default: null,
            type: cc.Prefab
        },
        RedChariot:{
            default: null,
            type: cc.Prefab
        },
        RedHorse:{
            default: null,
            type: cc.Prefab
        },
        RedKing:{
            default: null,
            type: cc.Prefab
        },
        RedSoldier:{
            default: null,
            type: cc.Prefab
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        this._NewUnkownPiece = cc.find("Canvas/board/Unknown_minion");
        //console.log(this._NewUnkownPiece)
        //****** */
        //此处注意
        //****** */
        
        this.node.on(cc.Node.EventType.MOUSE_UP,()=>{this.Clicked()})
        //this._NewUnkownPiece.on(cc.Node.EventType.MOUSE_UP,()=>{
        //    console.log("click")
        //},this._NewUnkownPiece)
    },

    Clicked: function(){
        if (!CurrentStatus){
            return;
        }
        if(com.Current_piece != ""){
            return;
        }
        com.flipped += 1
        if (com.flipped == 1){
            mqtt.say(`{"roomName":"${roomName}","name":"firstFlip","instruction":"` + window.psuedoRandomSeed +`"}`)
            if ((((com.Prime * psuedoRandomSeed % com.M) % com.NumberOfDifferences) % 2) == 0){
                com.IsBlack = true;
            }
              else{
                com.IsBlack = false;
            }
        }
        cc.log("hello")
        var tempx = Number(this.node.name.slice(-3,-2));
        var tempy = Number(this.node.name.slice(-1));
        mqtt.say(`{"roomName":"${roomName}","name":"flip","instruction":"` + tempx + tempy + `"}`)
    },

/*    
    Flip: function(x,y){
        var flag = true;
        var tempNode = cc.find("Canvas/board/NewUnknownPiece" + `_${x}_${y}`)
        tempNode.destroy();
        var next = this.nextRandom();
        var tempx = x;
        var tempy = y;
        //cc.log("this is the next", next)
        while (flag){
            switch (next){
                case 0:
                if (com.NumberOfBlackAdvisor - 1 >= 0){
                    com.NumberOfBlackAdvisor -= 1
                    var NewBlackAdvisor = cc.instantiate(this.BlackAdvisor);
                    NewBlackAdvisor.name = "BlackAdvisor" + tempNode.name.slice(-4);
                    com.board_coord[tempx][tempy] = NewBlackAdvisor.name;
                    NewBlackAdvisor.setPosition(cc.p(tempNode.x, tempNode.y));
                    NewBlackAdvisor.parent = tempNode.parent;
                    NewBlackAdvisor.Level = 6;
                    NewBlackAdvisor.Black = true;
                    //cc.log(NewBlackAdvisor.Level);
                    flag = false
                    
                    //console.log("hello");
                    return    
                }
                case 1:
                //cc.log("here we go")
                if (com.NumberOfRedAdvisor - 1 >= 0){
                    com.NumberOfRedAdvisor -= 1
                    var NewRedAdvisor = cc.instantiate(this.RedAdvisor);
                    NewRedAdvisor.setPosition(cc.p(tempNode.x, tempNode.y));
                    NewRedAdvisor.parent = tempNode.parent;
                    NewRedAdvisor.name = "RedAdvisor" + tempNode.name.slice(-4);
                    com.board_coord[tempx][tempy] = NewRedAdvisor.name;
                    flag = false
                    NewRedAdvisor.Level = 6;
                    NewRedAdvisor.Black = false;
                    //console.log("hello");
                    return    
                }
                case 2:
                if (com.NumberOfBlackElephant - 1 >= 0){
                    com.NumberOfBlackElephant -= 1;
                    var NewBlackElephant = cc.instantiate(this.BlackElephant);
                    NewBlackElephant.setPosition(cc.p(tempNode.x, tempNode.y));
                    NewBlackElephant.parent = tempNode.parent;
                    NewBlackElephant.name = "BlackElephant" + tempNode.name.slice(-4);
                    com.board_coord[tempx][tempy] = NewBlackElephant.name;
                    flag = false;
                    NewBlackElephant.Level = 5;
                    NewBlackElephant.Black = true;
                    //console.log("hello");
                    return
                }
                case 3:
                if (com.NumberOfRedBishop - 1 >= 0){
                    com.NumberOfRedBishop -= 1;
                    var NewRedBishop = cc.instantiate(this.RedBishop);
                    NewRedBishop.setPosition(cc.p(tempNode.x, tempNode.y));
                    NewRedBishop.parent = tempNode.parent;
                    NewRedBishop.name = "RedBishop" + tempNode.name.slice(-4);
                    com.board_coord[tempx][tempy] = NewRedBishop.name;
                    flag = false
                    NewRedBishop.Level = 5;
                    NewRedBishop.Black = false;
                    //console.log("hello, bishop");
                    return    
                }
                case 4:
                if (com.NumberOfBlackRook - 1 >= 0){
                    com.NumberOfBlackRook -= 1
                    var NewBlackRook = cc.instantiate(this.BlackRook);
                    NewBlackRook.setPosition(cc.p(tempNode.x, tempNode.y));
                    NewBlackRook.parent = tempNode.parent;
                    NewBlackRook.name = "BlackRook" + tempNode.name.slice(-4);
                    com.board_coord[tempx][tempy] = NewBlackRook.name;
                    flag = false
                    NewBlackRook.Level = 4;
                    NewBlackRook.Black = true;
                    //console.log("hello");
                    return    
                }
                case 5:
                //cc.log("here?")
                if (com.NumberOfRedChariot - 1 >= 0){
                    //cc.log("or here?");
                    com.NumberOfRedChariot -= 1
                    var NewRedChariot = cc.instantiate(this.RedChariot);
                    NewRedChariot.setPosition(cc.p(tempNode.x, tempNode.y));
                    NewRedChariot.parent = tempNode.parent;
                    NewRedChariot.name = "RedChariot" + tempNode.name.slice(-4);
                    com.board_coord[tempx][tempy] = NewRedChariot.name;
                    flag = false
                    NewRedChariot.Level = 4;
                    NewRedChariot.Black = false;
                    //console.log("hello");
                    return    
                }
                case 6:
                //cc.log("or here???")
                if (com.NumberOfBlackHorse - 1 >= 0){
                    com.NumberOfBlackHorse -= 1
                    var NewBlackHorse = cc.instantiate(this.BlackHorse);
                    NewBlackHorse.setPosition(cc.p(tempNode.x, tempNode.y));
                    NewBlackHorse.parent = tempNode.parent;
                    NewBlackHorse.name = "BlackHorse" + tempNode.name.slice(-4);
                    com.board_coord[tempx][tempy] = NewBlackHorse.name;
                    flag = false
                    NewBlackHorse.Level = 3;
                    NewBlackHorse.Black = true;
                    //console.log("hello");
                    return    
                }
                case 7:
                if (com.NumberOfRedHorse - 1 >= 0){
                    com.NumberOfRedHorse -= 1
                    var NewRedHorse = cc.instantiate(this.RedHorse);
                    NewRedHorse.setPosition(cc.p(tempNode.x, tempNode.y));
                    NewRedHorse.parent = tempNode.parent;
                    NewRedHorse.name = "RedHorse" + tempNode.name.slice(-4);
                    com.board_coord[tempx][tempy] = NewRedHorse.name;
                    flag = false
                    NewRedHorse.Level = 3;
                    NewRedHorse.Black = false;
                    //console.log("hello");
                    return    
                }
                case 8:
                if (com.NumberOfBlackCannnon - 1 >= 0){
                    com.NumberOfBlackCannnon -= 1
                    var NewBlackCannon = cc.instantiate(this.BlackCannon);
                    NewBlackCannon.setPosition(cc.p(tempNode.x, tempNode.y));
                    NewBlackCannon.parent = tempNode.parent;
                    NewBlackCannon.name = "BlackCannon" + tempNode.name.slice(-4);
                    com.board_coord[tempx][tempy] = NewBlackCannon.name;
                    flag = false
                    NewBlackCannon.Level = 2;
                    NewBlackCannon.Black = true;
                    //console.log("hello");
                    return    
                }
                case 9:
                if (com.NumberOfRedCannon - 1 >= 0){
                    com.NumberOfRedCannon -= 1
                    var NewRedCannon = cc.instantiate(this.RedCannon);
                    NewRedCannon.setPosition(cc.p(tempNode.x, tempNode.y));
                    NewRedCannon.parent = tempNode.parent;
                    NewRedCannon.name = "RedCannon" + tempNode.name.slice(-4);
                    com.board_coord[tempx][tempy] = NewRedCannon.name;
                    flag = false
                    //console.log("hello");
                    NewRedCannon.Level = 2;
                    NewRedCannon.Black = false;
                    return    
                }
                case 10:
                if (com.NumberOfBlackGeneral - 1 >= 0){
                    com.NumberOfBlackGeneral -= 1
                    var NewBlackGeneral = cc.instantiate(this.BlackGeneral);
                    NewBlackGeneral.setPosition(cc.p(tempNode.x, tempNode.y));
                    NewBlackGeneral.parent = tempNode.parent;
                    NewBlackGeneral.name = "BlackGeneral" + tempNode.name.slice(-4);
                    com.board_coord[tempx][tempy] = NewBlackGeneral.name;
                    flag = false
                    NewBlackGeneral.Level = 7;
                    NewBlackGeneral.Black = true;
                    //console.log("hello");
                    return    
                }
                case 11:
                if (com.NumberOfRedKing - 1 >= 0){
                    com.NumberOfRedKing -= 1
                    var NewRedKing = cc.instantiate(this.RedKing);
                    NewRedKing.setPosition(cc.p(tempNode.x, tempNode.y));
                    NewRedKing.parent = tempNode.parent;
                    NewRedKing.name = "RedKing" + tempNode.name.slice(-4);
                    com.board_coord[tempx][tempy] = NewRedKing.name;
                    flag = false
                    NewRedKing.Level = 7;
                    NewRedKing.Black = false;
                    //console.log("hello");
                    return    
                }
                case 12:
                if (com.NumberOfBlackPawn - 1 >= 0){
                    com.NumberOfBlackPawn -= 1
                    var NewBlackPawn = cc.instantiate(this.BlackPawn);
                    NewBlackPawn.setPosition(cc.p(tempNode.x, tempNode.y));
                    NewBlackPawn.parent = tempNode.parent;
                    NewBlackPawn.name = "BlackPawn" + tempNode.name.slice(-4);
                    com.board_coord[tempx][tempy] = NewBlackPawn.name;
                    flag = false
                    NewBlackPawn.Level = 1;
                    NewBlackPawn.Black = true;
                    //console.log("hello");
                    return    
                }
                case 13:
                if (com.NumberOfRedSoldier - 1 >= 0){
                    com.NumberOfRedSoldier -= 1
                    var NewRedSoldier = cc.instantiate(this.RedSoldier);
                    NewRedSoldier.setPosition(cc.p(tempNode.x, tempNode.y));
                    NewRedSoldier.parent = tempNode.parent;
                    NewRedSoldier.name = "RedSoldier" + tempNode.name.slice(-4);
                    com.board_coord[tempx][tempy] = NewRedSoldier.name;
                    flag = false
                    NewRedSoldier.Level = 1;
                    NewRedSoldier.Black = false;
                    //console.log("hello");
                    return    
                }
            }
            next = 0;
        }

         

        //cc.log("hello");         
    },


    hash: function(x){
        //cc.log(com.Prime * x)
        //console.log(com.Prime * x % this.NumberOfDifferences)
        return (com.Prime * x % com.M)
    },

    nextRandom: function(){
        //cc.log(com.psuedoRandomSeed)
        //console.log("where are you")
        //console.log("here," , this.psuedoRandomSeed);
        psuedoRandomSeed = this.hash(psuedoRandomSeed);
        //cc.log(com.psuedoRandomSeed);
        //cc.log(com.psuedoRandomSeed % com.NumberOfDifferences);
        return psuedoRandomSeed % com.NumberOfDifferences;
    },

    update: function () {
        //每帧读取FrameList
        this.readFrameList()
      },
      //读取帧信息 
    readFrameList: function () {
        var chatJson = mqtt.FrameChats.pop()        
        if (chatJson == undefined || chatJson.length == 0)
          return
        //取出操作信息
        var ChatUser = chatJson.User  //用户名
        var ChatName = chatJson.Name  //操作的名称
        var ChatInstruction = chatJson.Instruction //操作的状态（自定义字段
        //判断用户操作
        //对应处理逻辑
        if (ChatUser == myUserName) { 
            cc.log("heloo")
          switch (ChatName) {
                case 'flip':
                cc.log(ChatInstruction[0])
                    this.Flip(ChatInstruction[0], ChatInstruction[1])
                    break
                case 'tokill':
                    ChatInstruction = ChatInstruction.split(",")   
                    mov.ToKill(ChatInstruction[0],ChatInstruction[1])
                    break
            }
        } else {
            cc.log("heloo")
            switch (ChatName) {
                case 'flip':
                    this.Flip(ChatInstruction[0], ChatInstruction[1])
                    break
                case 'tokill':
                    ChatInstruction = ChatInstruction.split(",")
                    mov.ToKill(ChatInstruction[0],ChatInstruction[1])
                    break
            }
        }
      },
*/
});
