/*
 * @Author: kita
 * @Date: 2018-06-26 16:50:01
 * @LastEditors: kita
 * @LastEditTime: 2018-06-27 15:05:31
 * @Description: mqtt连接服务器部分逻辑
 */
var Paho = require('paho-Mqtt')

var _client

var mqttServer = {

    ServerInfo: {
        TestName: "TestName",
        TestServerIp: '123.56.91.184',
        TestServerPort: 3653,
    },

    //服务器Topic
    ServerTopics:{
        OnChat: "Chat/OnChat",//玩家操作
        OnJoin: "Chat/OnJoin",//玩家加入房间
        OnLeave: "Chat/OnLeave",//玩家离开
        GameStart: "Game/Start",//游戏开始

        Login: "Login/HD_Login/1",//登陆
        CreateRoom: "Chat/HD_CreateRoom/1",//创建房间
        Search: "Search/HD_SearchPlayer",//匹配玩家
        CancelSearch: "Search/CancelSearchPlayer",//取消匹配
        ReLogin: "Login/HD_ReLogin/1",//重新登陆
        ReportGameResult: "Chat/HD_GameResultReport",//游戏结果上报
        
        JoinRoom: `Chat@${ServerId}/HD_JoinChat/1`,//加入房间
        LeaveRoom: `Chat@${ServerId}/HD_LeaveRoom`,//离开房间
        Say: `Chat@${ServerId}/HD_Say`,//发送操作
        GetLostFrame: `Chat@${ServerId}/HD_GetLostFrame/1`,//补帧
    },
    updateTopic:function(){
        this.ServerTopics.JoinRoom = `Chat@${ServerId}/HD_JoinChat/1`
        this.ServerTopics.LeaveRoom = `Chat@${ServerId}/HD_LeaveRoom`
        this.ServerTopics.Say = `Chat@${ServerId}/HD_Say`
        this.ServerTopics.GetLostFrame = `Chat@${ServerId}/HD_GetLostFrame/1`
    },
    //帧同步
    FrameID: 0,
    FrameChats: [],
    //===============mqtt方法========
    serverConnect: function (name, success, receive, lost) {// 连接服务器
        var userName = name || 'defualtUser'
        //初始化client
        _client = new Paho.Client(this.ServerInfo.TestServerIp, this.ServerInfo.TestServerPort, userName)
        //建立连接
        _client.connect({
            onSuccess: success,
            mqttVersion: 3
        })
        //绑定回调
        _client.onMessageArrived = msg => {
            //取出topic
            var topic = msg.destinationName
            //取出payloadString
            var payload = JSON.parse(msg.payloadString)
            //cc.log(topic,payload)
            switch (topic) {
                case this.ServerTopics.OnChat://onChat 存储桢ID
                    // if (payload.Messages.length != 0 && payload.Messages !== undefined) {
                    //     console.log(payload.Messages)
                    // }
                    //1.判断是否连贯帧
                    // if (this.FrameID + 1 < payload.FrameID) {
                    //     console.log("补帧")
                    //     //需要补帧
                    //     // mqttServer.send(this.ServerTopics.GetLostFrame, `{\"roomName\":\"${roomName}\",\"packageId\":\"${this.FrameID}\"}`)
                    //     //清除帧操作list
                    //     // this.FrameChats.splice(0, this.FrameChats.length)
                    // } else {
                    //     //累加帧ID
                    //     this.FrameD++
                    //     /**
                    //      * Message :[{
                    //      *  "Name":"string",//操作名称
                    //      *  "Instrucation":"String",//操作状态
                    //      *  "User":"String",//操作的用户名
                    //      * }]
                    //      * */
                    //     this.FrameChats.push(payload.Messages)
                    // }
                    this.FrameD++
                    for (let i = 0; i < payload.Messages.length; i++) {
                        this.FrameChats.push(payload.Messages[i])
                    }
                    break
                case this.ServerTopics.GetLostFrame:
                    // var result = payload.Result
                    // var gameInfo = result.gameInfo

                    break
            }
            receive(msg)
        }
        _client.onConnectionLost = lost
    },
    // 发送消息到服务器
    send: function (topic, text) {
        var msg = new Paho.Message(text)
        msg.destinationName = topic
        msg.qos = 0

        console.log(`topic:${topic}\ntext:${text}`)

        _client.send(msg)
    },
    // 发送玩家操作
    say: function (msg) {
        var topic = this.ServerTopics.Say
        this.send(topic, msg)
    },
    //清理帧信息列表
    FrameListClear:function(){
        this.FrameChats.splice(0,this.FrameChats.length)
    },

    mqttIsConnected: function(){
        return client ? client.isConnected() : false
    },

    reJoinRoom: function (serverId, roomName, maxNumber) {
        this.send(`Chat@${serverId}/HD_ReJoinChat/1`, `{"roomName":"${roomName}","maxNumber":"${maxNumber}"}`)
    },
    login: function (code, gameid) {
        if (code && gameid)
            this.send("Login/HD_Login/1", `{"code":"${code}","gameid":"${gameid}"}`)
        else {
            console.error(`login接口缺少参数 请检查参数`)
        }
    },
    gameReady: function (serverId, roomName, gameMember) {
        var _gameMember = gameMember || '2'
        if (serverId && roomName) {
            this.send(`Chat@${serverId}/HD_GameReady/1`, `{"roomName":"${roomName}","gameMember":"${_gameMember}"}`)
        } else {
            console.error(`gameReady接口缺少参数 请检查参数`)
        }
    },
}
module.exports = mqttServer
