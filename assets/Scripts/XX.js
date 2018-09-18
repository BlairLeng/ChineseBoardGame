// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var mqtt = require('Mqtt/mqttServer');

var com = require('./Common');

cc.Class({
    extends: cc.Component,

    properties: {
        UnknownPrefab:{
            default: null,
            type: cc.Prefab
        },
        CurrentPieceEffect: {
            default: null,
            type: cc.Prefab
        },
        AttackableEffect: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        this.GenerateBoard();
        //cc.log(com.pos_coord)
        this.node.on(cc.Node.EventType.MOUSE_UP,event => {this.Click(event)})
        //cc.log(com.board_coord)
    },

    GenerateBoard: function(){
        for (var i = 0; i < com.XSLOTS; i ++){
            for (var j = 0; j < com.YSLOTS;j ++){
                this.GeneratePieces(i,j);
                com.board_coord[i][j] = "Unknown"
                //console.log();
            }
        }
    },

    GeneratePieces: function(x, y){
        var NewUnknownPiece = cc.instantiate(this.UnknownPrefab);
        NewUnknownPiece.name = "NewUnknownPiece" + `_${x}_${y}`
        //console.log(NewUnknownPiece.Name)

        this.node.addChild(NewUnknownPiece);
        NewUnknownPiece.setPosition(this.GetPosition(x,y))
        com.pos_coord[x][y] = this.GetPosition(x,y);
    },

    GetPosition: function (x , y){
        var xPosition = (x+1) * this.node.width/4 - this.node.width/8;
        var yPosition = (y+1) * this.node.height/8 - this.node.height/16;
        return cc.p(xPosition, yPosition);
    },

    Click: function (event){
        if (!CurrentStatus){ 
            cc.log(CurrentStatus)
            return;
        }
        //cc.log("heeeee")
        cc.log(CurrentStatus)
        com.Current_click = this.PositionJudgement(event.getLocationX(), event.getLocationY());
        //if (!com.checked){
        //    com.checked = true;
        //    return 
        //}
        this.MoveLegality(com.Current_click)
        if ((com.Current_piece != "") 
        && (com.board_coord[com.Current_click.slice(0,1)][com.Current_click.slice(-1)] == "")
        && com.moveCheck){
            //cc.log(com.Current_click)
            mqtt.say(`{"roomName":"${roomName}","name":"step","instruction":"` + com.Current_piece + "," + com.Current_click + `"}`)
            com.Current_piece_attackable = []
            com.Current_piece = ""
            /*
            var tempNode = cc.find("Canvas/board/" + com.Current_piece);
            com.board_coord[com.Current_piece.slice(-3,-2)][com.Current_piece.slice(-1)] = "";
            tempNode.setPosition(com.pos_coord[com.Current_click.slice(0,1)][com.Current_click.slice(-1)].x,com.pos_coord[com.Current_click.slice(0,1)][com.Current_click.slice(-1)].y);
            tempNode.name = tempNode.name.slice(0,-4) + "_" + com.Current_click;
            com.board_coord[com.Current_click.slice(0,1)][com.Current_click.slice(-1)] = tempNode.name;
            com.Current_piece = "";
        */
        }
        
        if (com.Current_piece == ""){
            if (com.CurrentSelectEffect == 1){
                var tempNode = cc.find("Canvas/board/CurrentPieceOnSelect")
                tempNode.destroy();
                com.CurrentSelectEffect = 0
            }
            for (var i = 0; i < com.CurrentAttackEffect; i++){
                var tempNode = cc.find("Canvas/board/NewAttackEffect_" + i)
                tempNode.destroy();
            }
            com.CurrentAttackEffect = 0
        }
        if (com.Current_piece != ""){
            var CheckNode = cc.find("Canvas/board/" + com.Current_piece)
            if (com.CurrentSelectEffect == 1){
                var tempNode = cc.find("Canvas/board/CurrentPieceOnSelect")
                tempNode.destroy();
                com.CurrentSelectEffect = 0
            }
            if (com.CurrentSelectEffect == 0){
                var tempNode = cc.find("Canvas/board/" + com.Current_piece)
                var NewCurrentSelect = cc.instantiate(this.CurrentPieceEffect)
                NewCurrentSelect.name = "CurrentPieceOnSelect"
                this.node.addChild(NewCurrentSelect)
                NewCurrentSelect.setPosition(tempNode.position)
                com.CurrentSelectEffect = 1
            }
            if (CheckNode.Level != 2){
                for (var i = 0; i < com.CurrentAttackEffect; i++){
                    var tempNode = cc.find("Canvas/board/NewAttackEffect_" + i)
                    tempNode.destroy();
                }
                com.CurrentAttackEffect = 0
                for (var i = 0; i < com.Current_piece_attackable.length; i++){
                    com.CurrentAttackEffect += 1
                    var NewAttackEffect = cc.instantiate(this.AttackableEffect)
                    NewAttackEffect.name = "NewAttackEffect" + "_" + i
                    this.node.addChild(NewAttackEffect)
                    NewAttackEffect.setPosition(this.GetPosition(com.Current_piece_attackable[i][0], com.Current_piece_attackable[i][1]))
                }
/*
                if (com.CurrentSelectEffect == 1){
                    var tempNode = cc.find("Canvas/board/CurrentPieceOnSelect")
                    tempNode.destroy();
                    com.CurrentSelectEffect = 0
                }
                if (com.CurrentSelectEffect == 0){
                    var tempNode = cc.find("Canvas/board/" + com.Current_piece)
                    var NewCurrentSelect = cc.instantiate(this.CurrentPieceEffect)
                    NewCurrentSelect.name = "CurrentPieceOnSelect"
                    this.node.addChild(NewCurrentSelect)
                    NewCurrentSelect.setPosition(tempNode.position)
                    com.CurrentSelectEffect = 1
                }
*/
            }
            if (CheckNode.Level == 2){
                for (var i = 0; i < com.CurrentAttackEffect; i++){
                    var tempNode = cc.find("Canvas/board/NewAttackEffect_" + i)
                    tempNode.destroy()
                }
                com.CurrentAttackEffect = 0
                for (var i = 0; i < com.Current_piece_attackable.length; i++){
                    com.CurrentAttackEffect += 1
                    var NewAttackEffect = cc.instantiate(this.AttackableEffect)
                    NewAttackEffect.name = "NewAttackEffect" + "_" + i
                    this.node.addChild(NewAttackEffect)
                    cc.log(com.Current_piece_attackable[i].slice(-3,-2))
                    NewAttackEffect.setPosition(this.GetPosition(Number(com.Current_piece_attackable[i].slice(-3,-2)), Number(com.Current_piece_attackable[i].slice(-1))))
                }
            }
        }
    },

    
    MoveLegality: function(clickName){
        com.moveCheck = 0
        var firstDigit = clickName.slice(-3,-2)
        var secondDigit = clickName.slice(-1)
        var tempList = []
        tempList.push(Number(firstDigit), Number(secondDigit))
        for (var i = 0; i < com.Current_piece_walkable.length;i++){
            for (var j = 0; j < com.Current_piece_walkable[i].length; j++){
                if (tempList[j] == com.Current_piece_walkable[i][j]){
                    com.moveCount += 1
                }
            }
            if (com.moveCount == 2){
                com.moveCheck = 1
            }
            com.moveCount = 0
        }
    },


    PositionJudgement: function (x,y){
        var tempCan = cc.find("Canvas");
        var offsetX = this.node.x + tempCan.x;
        var offsetY = this.node.y + tempCan.y;
        var tempX =  Math.floor((x - offsetX)/this.node.width * com.XSLOTS);
        var tempY = Math.floor((y - offsetY)/this.node.height * com.YSLOTS);
        return tempX + "_" + tempY; 
    },
    
});

