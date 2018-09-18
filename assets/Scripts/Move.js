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
var com = require('./Common')

var Move = cc.Class({
    extends: cc.Component,

    properties: {
        Level : 
        {
            default : null,
            type : cc.Integer,
        },
        Black:
        {
            default: null,
            type: cc.Boolean,
        },
    },
    
    // LIFE-CYCLE CALLBACKS:
    
    onLoad: function () {
        //this.Move();
        //this.tempBoard = cc.find("Canvas/board");
        this.node.on(cc.Node.EventType.MOUSE_UP,()=>{this.Click()})
        //tempBoard.on(cc.Node.EventType.MOUSE_UP,()=>{this.MoveClick()})
    },
    
    Click: function(){
        if (!CurrentStatus){
            cc.log(CurrentStatus)
            return;
        }
        
        var tempNode = cc.find("Canvas/board/" + com.Current_piece)
        cc.log(this.node.Black)
        cc.log(com.IsBlack)
        if (com.Current_piece == "" && this.node.Level != 2 && (this.node.Black == com.IsBlack)){
            com.Current_piece = this.node.name;
            var tempX = com.Current_piece.slice(-3,-2);
            var tempY = com.Current_piece.slice(-1);
            this.MoveRange(tempX, tempY);
            this.AttackRange(tempX, tempY);
        }
        else if (com.Current_piece == "" && this.node.Level == 2 && ((this.node.Black == com.IsBlack))){
            com.Current_piece = this.node.name;
            var tempX = com.Current_piece.slice(-3,-2);
            var tempY = com.Current_piece.slice(-1);
            this.MoveRange(tempX, tempY)
            this.CannonAttack(tempX, tempY)
        }
        else if (com.Current_piece != "" && this.node.name == com.Current_piece){
            com.Current_piece = "";
        }
        else if (com.Current_piece != "" && tempNode.Black == this.node.Black && this.node.Level != 2){
            com.Current_piece = this.node.name;
            var tempX = com.Current_piece.slice(-3,-2);
            var tempY = com.Current_piece.slice(-1);
            this.MoveRange(tempX, tempY);
            this.AttackRange(tempX, tempY);
        }
        else if (com.Current_piece != "" && tempNode.Black == this.node.Black && this.Level == 2){
            com.Current_piece = this.node.name;
            var tempX = com.Current_piece.slice(-3,-2);
            var tempY = com.Current_piece.slice(-1);
            this.MoveRange(tempX, tempY);
            this.CannonAttack(tempX, tempY);
        }
        //else if (com.Current_piece != "" && tempNode.Level == 2 && tempNode.Black != this.node.Black && this.CannonAttack(this.PositionJudgement(this.node.x, this.node.y))){}
        else if(com.Current_piece != "" && tempNode.Level == 2){
            this.CannonAttackLegality(this.node.name)
            if (com.attackCheck){
                mqtt.say(`{"roomName":"${roomName}","name":"CannonAttack","instruction":"` + com.Current_piece + "," + this.node.name + `"}`)
            }
            com.Current_piece_attackable = []
            com.Current_piece = ""
        }
        else if (com.Current_piece != "" && tempNode.Black != this.node.Black){
            this.AttackLegality(this.node.name)
            if ((tempNode.Level > this.node.Level) && com.attackCheck){
                if (tempNode.Level == 7 && this.node.Level == 1){
                    mqtt.say(`{"roomName":"${roomName}","name":"toSacrifice","instruction":"` + com.Current_piece + "," + this.node.name + `"}`)    
                }else{
                    mqtt.say(`{"roomName":"${roomName}","name":"tokill","instruction":"` + com.Current_piece + "," + this.node.name + `"}`)
                }
                /*
                tempNode.setPosition(this.node.x, this.node.y);
                tempNode.name = tempNode.name.slice(0,-4) + "_" + this.node.name.slice(-3,-2) + "_" + this.node.name.slice(-1)
                com.board_coord[this.node.name.slice(-3,-2)][this.node.name.slice(-1)] = tempNode.name
                this.node.destroy();
                com.board_coord[com.Current_piece.slice(-3,-2)][com.Current_piece.slice(-1)] = ""
                com.Current_piece = ""
                */
            }
            if ((tempNode.Level == this.node.Level) && com.attackCheck){
                mqtt.say(`{"roomName":"${roomName}","name":"toDie","instruction":"` + com.Current_piece + "," + this.node.name + `"}`)
                /*
                com.board_coord[this.node.name.slice(-3,-2)][this.node.name.slice(-1)] = "";
                com.board_coord[com.Current_piece.slice(-3,-2)][com.Current_piece.slice(-1)] = "";
                this.node.destroy();
                tempNode.destroy();
                com.Current_piece = ""
            */
            }
            if ((tempNode.Level < this.node.Level) && com.attackCheck){
                if (tempNode.Level == 1 && this.node.Level == 7){
                    mqtt.say(`{"roomName":"${roomName}","name":"tokill","instruction":"` + com.Current_piece + "," + this.node.name + `"}`)
                }else{
                    if (!(tempNode.Level == 1 && this.node.Level == 2)){
                        mqtt.say(`{"roomName":"${roomName}","name":"toSacrifice","instruction":"` + com.Current_piece + "," + this.node.name + `"}`)
                    }
                }
            }
            com.Current_piece_attackable = []
            com.Current_piece = ""
        }
        //if (com.Current_piece == ""){
        //    cc.log("hi here")
        //    com.checked = false;
        //}


        //cc.log(com.Current_piece)
        //cc.log(com.Current_piece_attackable)
        //cc.log(com.Current_piece_walkable)
        //cc.log(com.attackCheck)
    },
/*
    ToDie: function(curPiece, desPiece){
        var tempCurPiece = cc.find("Canvas/board/" + curPiece)
        var tempDesPiece = cc.find("Canvas/board/" + desPiece)
        com.board_coord[desPiece.slice(-3,-2)][desPiece.slice(-1)] = ""
        com.board_coord[com.Current_piece.slice(-3,-2)][com.Current_piece.slice(-1)] = ""
        tempCurPiece.destroy();
        tempDesPiece.destroy();
        com.Current_piece = ""
    }
*/
    /*
    ToKill: function(curPiece, desPiece){
        var tempCurPiece = cc.find("Canvas/board/" + curPiece)
        var tempDesPiece = cc.find("Canvas/board/" + desPiece)
        tempCurPiece.setPosition(tempDesPiece.x, tempDesPiece.y)
        tempCurPiece.name = tempCurPiece.name.slice(0, -4) + "_" + tempDesPiece.name.slice(-3,-2) + "_" + tempDesPiece.name.slice(-1)
        com.board_coord[tempDesPiece.name.slice(-3,-2)][tempDesPiece.name.slice(-1)] = tempCurPiece.name
        tempDesPiece.destroy();
        com.board_coord[tempCurPiece.name.slice(-3,-2)][tempCurPiece.name.slice(-1)] = ""
        com.Current_piece = ""
    },
    */

    /*
   ToSacrifice: function(curPiece, desPiece){
       var tempCurPiece = cc.find("Canvas/board/" + curPiece)
       var tempDesPiece = cc.find("Canvas/board/" + desPiece)
       com.board_coord[curPiece.slice(-3,-2)][curPiece.slice(-1)] = ""
       tempCurPiece.destroy();
       com.Current_piece = ""
   }
   */

    //MoveClick: function(){cc.log("hi");},

    MoveRange: function(x,y){
        com.Current_piece_walkable = []
        if (Number(Number(y) + 1) != com.YSLOTS && com.board_coord[Number(x)][Number(Number(y) + 1)] == ""){
            //com.Current_piece_walkable += ["(" + Number(x), Number(Number(y) + 1) + ")"] 
            com.Current_piece_walkable.push([Number(x), Number(Number(y) + 1)])
        };
        if (Number(Number(y) - 1) >= 0 && com.board_coord[Number(x)][Number(Number(y) - 1)] == ""){
            //com.Current_piece_walkable += ["(" + Number(x), Number(Number(y) - 1) + ")"]
            com.Current_piece_walkable.push([Number(x), Number(Number(y) - 1)])
        };
        if (Number(Number(x) + 1) != com.XSLOTS && com.board_coord[Number(Number(x) + 1)][Number(y)] == ""){
            //com.Current_piece_walkable += ["(" + Number(Number(x) + 1), Number(y) + ")"]
            com.Current_piece_walkable.push([Number(Number(x) + 1), Number(y)])
        }
        if (Number(Number(x) - 1) >= 0 && com.board_coord[Number(Number(x) - 1)][Number(y)] == ""){
            //com.Current_piece_walkable += ["(" + Number(Number(x) - 1), Number(y) + ")"]
            com.Current_piece_walkable.push([Number(Number(x) - 1), Number(y)])
        }

    },

    AttackRange: function(x,y){
        com.Current_piece_attackable = []
        if (Number(Number(y) + 1) != com.YSLOTS && com.board_coord[Number(x)][Number(Number(y) + 1)] != "Unknown" && com.board_coord[Number(x)][Number(Number(y) + 1)] != ""){
            if (com.board_coord[Number(x)][Number(Number(y)+1)] != ""){
                var tempNode = cc.find("Canvas/board/" + com.board_coord[Number(x)][Number(Number(y) + 1)])
                var CurNode = cc.find("Canvas/board/" + com.Current_piece)
                if (tempNode.Black != CurNode.Black && (!(tempNode.Level == 2 && this.node.Level == 1))){
                    //com.Current_piece_attackable += ["(" + Number(x), Number(Number(y) + 1) + ")"]
                    com.Current_piece_attackable.push([Number(x), Number(Number(y) + 1)])
                }
            }
        };
        if (Number(Number(y) - 1) >= 0 && com.board_coord[Number(x)][Number(Number(y) - 1)] != "Unknown" && com.board_coord[Number(x)][Number(Number(y) - 1)] != ""){
            if (com.board_coord[Number(x)][Number(Number(y) - 1)] != ""){
                var tempNode = cc.find("Canvas/board/" + com.board_coord[Number(x)][Number(Number(y) - 1)])
                var CurNode = cc.find("Canvas/board/" + com.Current_piece)
                if (tempNode.Black != CurNode.Black && (!(tempNode.Level == 2 && this.node.Level == 1))){
                    //com.Current_piece_attackable += ["(" + Number(x), Number(Number(y) - 1) + ")"]
                    com.Current_piece_attackable.push([Number(x), Number(Number(y) - 1)])
                }
            }
        };
        if (Number(Number(x) + 1) != com.XSLOTS && com.board_coord[Number(Number(x) + 1)][Number(y)] != "Unknown" && com.board_coord[Number(Number(x) + 1)][Number(y)] != ""){
            if (com.board_coord[Number(Number(x) + 1)][Number(y)] != ""){
                var tempNode = cc.find("Canvas/board/" + com.board_coord[Number(Number(x) + 1)][Number(y)])
                var CurNode = cc.find("Canvas/board/" + com.Current_piece)
                if (tempNode.Black != CurNode.Black && (!(tempNode.Level == 2 && this.node.Level == 1))){
                    //com.Current_piece_attackable += ["(" + Number(Number(x) + 1), Number(y) + ")"]
                    com.Current_piece_attackable.push([Number(Number(x) + 1), Number(y)])
                }
            }
        };
        if (Number(Number(x) - 1) >= 0 && com.board_coord[Number(Number(x) - 1)][Number(y)] != "Unknown" && com.board_coord[Number(Number(x) - 1)][Number(y)] != ""){
            if (com.board_coord[Number(Number(x) - 1)][Number(y)] != ""){
                var tempNode = cc.find("Canvas/board/" + com.board_coord[Number(Number(x) - 1)][Number(y)])
                var CurNode = cc.find("Canvas/board/" + com.Current_piece)
                if (tempNode.Black != CurNode.Black && (!(tempNode.Level == 2 && this.node.Level == 1))){
                    //com.Current_piece_attackable += ["(" + Number(Number(x) - 1), Number(y) + ")"]
                    com.Current_piece_attackable.push([Number(Number(x) - 1), Number(y)])
                }
            }
        };
        //cc.log("The piece can attack ",com.Current_piece_attackable)
    },

    CannonAttack: function(x,y){
        com.Current_piece_attackable = []
        var CurNode = cc.find("Canvas/board/" + com.Current_piece)
        //向左看
        if (Number(x) + 2 >= com.XSLOTS){
            for (var i = Number(x) - 1; i > 0; i--){
                if (com.board_coord[i][y] != ""){
                    //cc.log("rack", com.board_coord[i][y])
                    for (var j = i - 1; j >= 0; j--){
                        if (com.board_coord[j][y] == "Unknown"){
                            break
                        }
                        if (com.board_coord[j][y] != ""){
                            var tempNode = cc.find("Canvas/board/" + com.board_coord[j][y])
                            if (tempNode.Black != CurNode.Black){
                                com.Current_piece_attackable.push(com.board_coord[j][y])
                            }
                            break
                        }
                    }
                    break
                }
            }
        }
        //向右看
        if (Number(x) - 2 < 0){
            for (var i = Number(x) + 1; i < com.XSLOTS; i++){
                //cc.log(i)
                if (com.board_coord[i][y] != ""){
                    //cc.log("rack",com.board_coord[i][y])
                    for (var j = i + 1; j < com.XSLOTS; j++){
                        if (com.board_coord[j][y] == "Unknown"){
                            break
                        }
                        if (com.board_coord[j][y] != ""){
                            var tempNode = cc.find("Canvas/board/" + com.board_coord[j][y])
                            if (tempNode.Black != CurNode.Black){
                                com.Current_piece_attackable.push(com.board_coord[j][y])
                            }
                            break
                        }
                    }
                    break
                }
            }
        }
        //向下看
        if (Number(y) + 2 >= com.YSLOTS){
            for (var i = Number(y) - 1; i > 0; i--){
                if (com.board_coord[x][i] != ""){
                    for (var j = i - 1; j >= 0; j--){
                        if (com.board_coord[x][j] == "Unknown"){
                            break
                        }
                        if (com.board_coord[x][j] != ""){
                            var tempNode = cc.find("Canvas/board/" + com.board_coord[x][j])
                            if (tempNode.Black != CurNode.Black){
                                com.Current_piece_attackable.push(com.board_coord[x][j])
                            }
                            break
                        }
                    }
                    break
                }
            }
        }
        //向上看
        if (Number(y) - 2 < 0){
            for (var i = Number(y) + 1; i < com.YSLOTS; i++){
                if (com.board_coord[x][i] != ""){
                    for (var j = i + 1; j < com.YSLOTS; j++){
                        if (com.board_coord[x][j] == "Unknown"){
                            break
                        }
                        if (com.board_coord[x][j] != ""){
                            var tempNode = cc.find("Canvas/board/" + com.board_coord[x][j])
                            if (tempNode.Black != CurNode.Black){
                                com.Current_piece_attackable.push(com.board_coord[x][j])
                            }
                            break
                        }
                    }
                    break
                }
            }
        }
        if (!(Number(y) + 2 >= com.YSLOTS) && !(Number(y) - 2 <0)){
            for (var i = Number(y) - 1; i > 0; i--){
                if (com.board_coord[x][i] != ""){
                    for (var j = i - 1; j >= 0; j--){
                        if (com.board_coord[x][j] == "Unknown"){
                            break
                        }
                        if (com.board_coord[x][j] != ""){
                            var tempNode = cc.find("Canvas/board/" + com.board_coord[x][j])
                            if (tempNode.Black != CurNode.Black){
                                com.Current_piece_attackable.push(com.board_coord[x][j])
                            }
                            break
                        }
                    }
                    break
                }
            }
            for (var i = Number(y) + 1; i < com.YSLOTS; i++){
                if (com.board_coord[x][i] != ""){
                    for (var j = i + 1; j < com.YSLOTS; j++){
                        if (com.board_coord[x][j] == "Unknown"){
                            break
                        }
                        if (com.board_coord[x][j] != ""){
                            var tempNode = cc.find("Canvas/board/" + com.board_coord[x][j])
                            if (tempNode.Black != CurNode.Black){
                                com.Current_piece_attackable.push(com.board_coord[x][j])
                            }
                            break
                        }
                    }
                    break
                }
            }
        }
        //cc.log(com.Current_piece_attackable)
    },

    CannonAttackLegality: function(nodeName){
        com.attackCheck = 0
        for (var i = 0; i < com.Current_piece_attackable.length; i++){
            cc.log(com.Current_piece_attackable[i])
            if (nodeName == com.Current_piece_attackable[i]){
                com.attackCheck = 1
            }
        }
    },

    AttackLegality: function(nodeName){
        com.attackCheck = 0
        var firstDigit = nodeName.slice(-3,-2)
        var secondDigit = nodeName.slice(-1)
        var tempList = []
        tempList.push(Number(firstDigit), Number(secondDigit))
        for (var i = 0; i < com.Current_piece_attackable.length;i++){
            for (var j = 0; j < com.Current_piece_attackable[i].length; j++){
                if (tempList[j] == com.Current_piece_attackable[i][j]){
                    com.count += 1
                }
            }
            if (com.count == 2){
                com.attackCheck = 1
            }
            com.count = 0
        }
    },

    PositionJudgement: function (x,y){
        var tempBoard = cc.find("Canvas/board")
        var tempCan = cc.find("Canvas");
        var offsetX = tempBoard.x + tempCan.x;
        var offsetY = tempBoard.y + tempCan.y;
        var tempX =  Math.floor((x - offsetX)/tempBoard.width * com.XSLOTS);
        var tempY = Math.floor((y - offsetY)/tempBoard.height * com.YSLOTS);
        return [tempX + ", " + tempY];
    },


});

