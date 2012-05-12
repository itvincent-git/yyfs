/*
* YY开放平台JavaScript SDK
* @create date 2012-01-06
* @modify data 2012-03-29
* @author slj
* @version 1.1 beta
* @modify slj
* ............................................................................
* ............................................................................
* yy open platform client javascript sdk 
* 广州华多网络科技有限公司 版权所有 (c) 2005-2012 DuoWan.com [多玩游戏]

******************************************************************************
* 更多开发资料请参考open.yy.com
*******************************************************************************/

//(function() {

//------------------------------IYYCommon------------------------------------------------------------------------
/**
* IYYCommon 接口。
* @class 公共功能原型类，提供比如事件的侦听，取消侦听等公共功能。
* @constructor
*/
function IYYCommon() {
    /**
    * 保存事件侦听函数的对象，事件的类型作为eventsMap的key, key为事件唯一描述字符串，具体事件key 值，在每个接口有单独定义。
    * @field
    * @private
    */
    this.eventsMap = {};
};

/**
* 增加侦听事件。
* @param {String} eventType 事件的类型key，比如: IYY.ACTIVE,IYYChannel.CHANNEL_INFO_CHANGED
* @param {function} listenerFunc 事件的侦听函数。
*/
IYYCommon.prototype.addEventListener = function(eventType, listenerFunc) {
    if (this.eventsMap[eventType] == null) {
        this.eventsMap[eventType] = [listenerFunc];
    }
    else {
        this.eventsMap[eventType].push(listenerFunc);
    }

};

/**
* 删除侦听事件。即删除指定事件的所有侦听函数。
* @param {String} eventType 事件的类型。
*/
IYYCommon.prototype.removeEventListener = function(eventType) {
    if (this.eventsMap[eventType] != null) {
        this.eventsMap[eventType] = [];
    }
};

/**
* 触发事件，注意：此接口，在外部不要调用，外部调用此函数触发的事件，为无效事件
* @param {String} eventType 事件类型。 
* @param {String} eventData 事件数据。 
* @private
*/
IYYCommon.prototype.dispatchEvent = function(eventType, eventData) {
    //触发事件
    if (this.eventsMap[eventType] == null) return;
    for (var i = 0; i < this.eventsMap[eventType].length; i++) {
        switch (arguments.length) {
            case 1:
                this.eventsMap[eventType][i]();//不需要信息的事件
                break;
            case 2:
                this.eventsMap[eventType][i](eventData);
                break;
            default:
        }
    }
};
//--------------------------------------set debug mode-----------------------
//设置为true时，会在id为txtConsole的textarea文本框中输出调试信息
var debugMode = false;

//--------------------------------------IYY----------------------------------
/**
* IYY 构造函数。
* @extends IYYCommon
* @class yy接口入口，获取到yy的其他接口和方法。
* @constructor
*/
function IYY() {	
    /**
    * 获取语音接口。
    * @field
    * @type IYYAudio
    * @see IYYAudio   
    */
    this.audio = new IYYAudio();
      
    /**
    * 获取频道接口。
    * @field
    * @type IYYChannel
    * @see IYYChannel   
    */
    this.channel = new IYYChannel();
    
    /**
    * 获取云存储接口。  
    * @field
    * @type IYYCloud
    * @see IYYCloud
    */
    this.cloud = new IYYCloud();
    
    /**
    * 获取IM接口。
    * @field
    * @type IYYIM
    * @see IYYIM    
    */
    this.im = new IYYIM();
    
    /**
    * 获取网络接口。
    * @field
    * @type IYYNet
    * @see IYYNet
    */
    this.net= new IYYNet();
    
    /**
    * 获取当前用户信息。
    * @field
    * @see IYYUser
    * @type IYYUser
    */
    this.user = new IYYUser();
    

		
	var ret = callExternal("IYY_GetVersion();");
    var ver = new YYVersion();
    ver.majorVersion = ret.main_version;
    ver.minorVersion = ret.sub_version;
    /**
    * 获取YY API的版本。
    * @returns 返回YY API的版本,是一个YYVersion对象。
    * @type YYVersion
    * @see YYVersion
    */
    this.version = ver;
};

IYY.prototype = new IYYCommon();

/**
* 应用激活事件。应用运行时，点击应用盒子中的应用图标会触发此事件。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.activeCode: int类型 点击的来源，0=点击来源于应用盒子图标。
*
* @example
* 使用示例：
* yy.addEventListener(IYY.ACTIVE,onActive);
*
* function onActive(eventData)
* {
*    document.getElementById("txtLog").innerHTML="点击来源："+eventData.activeCode;
* }
*/
IYY.ACTIVE = "YY_ACTIVE";

//------------------------------IYYAudio------------------------------

/**
* IYYAudio 构造函数。
* @extends IYYCommon
* @class 语音控制接口，提供处理YY的音频信息，比如录音的控制等。
* @constructor
*/
function IYYAudio() {

};

IYYAudio.prototype = new IYYCommon();
/**
* 开始录音
* @param {String} fileName 指定录音文件的文件名，不需要路径。
* 格式为MP3，会录制到固定的路径中，如果两次录音指定了同一个文件，第二次的会被覆盖。不指定文件名的话系统会使用默认名称。
* @returns 返回操作是否成功 0=成功， 非0值失败，具体请参考错误码。
* @type int
*/
IYYAudio.prototype.startRecord = function(fileName) {
    var result;
    if (arguments.length == 0) {
        result = callExternal("IAudio_StartRecord('');");
    }
    else {
        result = callExternal("IAudio_StartRecord(\"" + fileName + "\");");
    }
    return result.ret;
};
/**
* 停止录音
* @returns 返回操作是否成功,0=成功， 非0值失败，具体请参考错误码。
* @type int
*/
IYYAudio.prototype.stopRecord = function() {
    var result=callExternal("IAudio_StopRecord();");
    return result.ret;
};

/**
* 音频录音出错事件。录音出错的时候会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.errCode: int类型 录音出错代码。
*
* @example
* 使用示例：
* yy.audio.addEventListener(IYYAudio.RECORD_ERR,onRecordError);
*
* function onRecordError(eventData)
* {
*    document.getElementById("txtLog").innerHTML=eventData.errCode;
* }
*/
IYYAudio.RECORD_ERR = "YY_RECORD_ERR";


/**
* 音频录音完成事件。录音完成的时候会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.result: int类型 录音结果。 0=录音正确，非0值表示录音过程中有错误。
* eventData.fileName: String类型 录音文件的路径和文件名 。
*
* @example
* 使用示例：
* yy.audio.addEventListener(IYYAudio.RECORD_FINISHED,onRecordFinish);
*
* function onRecordFinish(eventData)
* {
*    if(eventData.result==0)
*    {
*       document.getElementById("txtLog").innerHTML="录好的文件在："+eventData.fileName;
*    }
* }
*/
IYYAudio.RECORD_FINISHED = "YY_RECORD_FINISHED";

//-------------------------------------IYYChannel-----------------------------------
/**
* IYYChannel 构造函数。
* @extends IYYCommon
* @class 频道接口，提供对频道的操作和交互。
* @constructor
*/
function IYYChannel() {

    /**
    * 获取用户菜单接口
    * @type IYYChannelUserListPopMenu
    * @see IYYChannelUserListPopMenu    
    * @field
    */
    this.userListPopMenu = new IYYChannelUserListPopMenu(); 
    /**
    * 获取麦序接口。
    * @type IYYChannelMicList
    * @see IYYChannelMicList
    * @field
    */
    this.micList = new IYYChannelMicList(); 
    /**
    * 获取频道应用消息接口
    * @type IYYChannelAppMsg
    * @see IYYChannelAppMsg
    * @field
    */        
    this.appMsg = new IYYChannelAppMsg();          
};

IYYChannel.prototype = new IYYCommon();

/**
* 获取当前所在的根频道信息
* @returns 返回当前频道信息,是一个YYChannelInfo对象,如果频道没有短位id，短位id和长位id相同。
* @type YYChannelInfo
* @see YYChannelInfo
*/
IYYChannel.prototype.getCurrentChannelInfo = function() {
    var result = callExternal("IChannel_GetCurrentChannelInfo();");
    if(result.ret==0)
    {
        return parseChannelInfo(result);
    }
    else
    {
        return null;
    }
};

/**
* 获取当前所在的子频道信息
* @returns 返回当前子频道信息,是一个YYChannelInfo对象。如果频道没有短位Id，短位id和长位id相同。
* @type YYChannelInfo
* @see YYChannelInfo
*/
IYYChannel.prototype.getCurrentSubChannelInfo = function() {
    var result= callExternal("IChannel_GetCurrentSubChannelInfo();");
    if(result.ret==0)
    {
    
        return parseChannelInfo(result);
    }
    else
    {
        return null;
    }
};

/**
* 获取当前频道树中，指定的子频道或者根频道的频道信息。
* @returns 返回指定频道信息,是一个YYChannelInfo对象。
* @param {int} cid 频道的id号 <b>是频道的长位Id</b> 。
* @type YYChannelInfo
* @see YYChannelInfo    
* 
*/
IYYChannel.prototype.getChannelInfo = function(cid) {
    var result= callExternal("IChannel_GetChannelInfo(" + cid + ");");
    if(result.ret==0)
    {
        return parseChannelInfo(result);
    }
    else
    {
        return null;
    }
};

//原始信息格式{"ret":0,"long_id":15477857}
/**
* 获取当前根频道id。
* @returns 返回当前根频道的频道长位id。
* @type int
*/
IYYChannel.prototype.getRootChannelId = function() {
    var result = callExternal("IChannel_GetRootChannelId();");
    if(result.ret==0)
    {
        return result.long_id;
    }
    else
    {
        return 0;
    
    }
};

//返回原始数据 {ret:0,ids:[15777555,18955441,15478888]}
/**
* 获取指定频道的所有子频道的id。
* @param {int} cid 指定频道的的长位id,必须是在当前频道树中的一个频道。 
* @returns 返回所有子频道的长位id,id保存在一个数组中。
* @type Array
*/
IYYChannel.prototype.getSubChannelIds = function(cid) {
    var result = callExternal("IChannel_GetSubChannelIds(" + cid + ");");
    if(result.ret==0)
    {
        return result.ids;
    }
    else
    {
        return [];
    }
};



/**
* 频道信息变化事件。频道信息发生变化时触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData: Object类型 是YYChannelInfo对象，保存频道的新信息。
*
* @example
* 使用示例：
* yy.channel.addEventListener(IYYChannel.CHANNEL_INFO_CHANGED,onChannelInfoChanged);
*
* function onChannelInfoChanged(eventData)
* {
*     document.getElementById("txtLog").innerHTML="发生变化的频道号："+eventData.longId+" 名称为："+eventData.name;
* }
*/
IYYChannel.CHANNEL_INFO_CHANGED = "YY_CHANNEL_INFO_CHANGED";

/**
* 切换频道事件。用户在频道树中切换频道的时候会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.departedId: int类型 离开的频道的长位id。
* eventData.nowId: int类型 进入的频道的长位id。
*
* @example
* 使用示例：
* yy.channel.addEventListener(IYYChannel.FOCUS_CHANNEL_CHANGED,onFocusChanged);
*
* function onFocusChanged(eventData)
* {
*     document.getElementById("txtLog").innerHTML="离开："+eventData.departedId+" 进入了"+eventData.nowId;
* }
*/
IYYChannel.FOCUS_CHANNEL_CHANGED = "YY_FOCUS_CHANNEL_CHANGED";


/**
* 子频道增加事件。子频道创建的时候会触发此事件。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.cid: int类型 增加的子频道的长位id。
* eventData.pcid: int类型 增加到哪个频道下，长位id。
* @example
* 使用示例：
* yy.channel.addEventListener(IYYChannel.SUB_CHANNEL_ADD,onChannelAdd);
*
* function onChannelAdd(eventData)
* {
*     document.getElementById("txtLog").innerHTML="新的频道"+eventData.cid+"位于"+eventData.pcid+"下面";
* }
*/
IYYChannel.SUB_CHANNEL_ADD = "YY_SUB_CHANNEL_ADD";

/**
* 子频道删除事件。子频道被删除时触发此事件。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.cid: int类型 被删除的子频道长位id。
*
* @example
* 使用示例：
* yy.channel.addEventListener(IYYChannel.SUB_CHANNEL_DEL,onChannelDel);
*
* function onChannelDel(eventData)
* {
*     document.getElementById("txtLog").innerHTML="被删除的子频道："+eventData.cid;
* }
*/
IYYChannel.SUB_CHANNEL_DEL = "YY_SUB_CHANNEL_DEL";

/**
* 用户进入当前频道树事件。当用户进入当前频道树中任一频道就会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.uid: int类型 进入频道的用户uid。
* eventData.cid: int类型 进入时，所在的那个频道的长位id。  
* @example
* 使用示例：
* yy.channel.addEventListener(IYYChannel.USER_ENTER_CHANNEL,onUserEnter);
*
* function onUserEnter(eventData)
* {
*     document.getElementById("txtLog").innerHTML="有新用户"+eventData.uid+"进入到"+eventData.cid+"频道";
* }
*/
IYYChannel.USER_ENTER_CHANNEL = "YY_USER_ENTER_CHANNEL";


/**
* 用户离开当前频道树事件。当有用户离开当前频道树就会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.uid: int类型 离开频道的用户uid。
* eventData.cid: int类型 离开频道树时所处的频道的长位id。
* @example
* 使用示例：
* yy.channel.addEventListener(IYYChannel.USER_ENTER_CHANNEL,onUserLeave);
*
* function onUserLeave(eventData)
* {
*     document.getElementById("txtLog").innerHTML="用户"+eventData.uid+"离开了"+eventData.cid+"频道";
* }
*/
IYYChannel.USER_LEAVE_CHANNEL = "YY_USER_LEAVE_CHANNEL";


//-------------------------------------IYYChannelAppMsg-----------------------------------
/**
* IYYChannelAppMsg 构造函数
* @extends IYYCommon
* @class 频道应用消息接口，提供频道的应用消息发送和响应等操作，应用消息出现在应用盒子的应用消息选项卡中和公告栏下方。
* @constructor
*/
function IYYChannelAppMsg() {
};

IYYChannelAppMsg.prototype = new IYYCommon();


/**
* 发送应用消息到子频道。所有该子频道在线用户才能收到。
* @param {int} subChannelId 子频道长位id。    
* @param {String} msg 消息内容。
* @param {int} linkstart 内容中超链接开始位置。
* @param {int} linkend 内容中超链接结束位置。    
* @param {int} token  设置token，消息标记。  
* @returns 发送是否成功。 0=成功 非0值参考错误代码。
* @type int
*/
IYYChannelAppMsg.prototype.sendMsgToSubChannel = function(subChannelId, msg, linkstart, linkend, token) {
    msg = msg.replace(/\"/g, "\\\""); //替换双引号
    var result = callExternal("IChannelAppMsg_SendMsgToSubChannel(" + subChannelId + ",\"" + msg + "\"," + linkstart + "," + linkend + "," + token + ");");
    return result.ret;
};


/**
* 发送应用消息给指定用户。用户必须在同一频道树中，且必须在线才能收到。
* @param {Array} userList 存有目标用户uid的数组。    
* @param {String} msg 消息内容
* @param {int} linkstart 内容中超链接开始位置。
* @param {int} linkend 内容中超链接结束位置。    
* @param {int} token  设置token，消息标记。  
* @returns 发送是否成功。 0=成功 非0值参考错误代码。
* @type int
*/
IYYChannelAppMsg.prototype.sendMsgToUsers = function(userList, msg, linkstart, linkend, token) {
    msg = msg.replace(/\"/g, "\\\""); //替换双引号
    var result = callExternal("IChannelAppMsg_SendMsgToUsers(\"[" + userList.toString() + "]\",\"" + msg + "\"," + linkstart + "," + linkend + "," + token + ");");
    return result.ret;
};


/**
* 应用消息链接点击事件。应用消息中的超链接被点击的时候会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.token: int类型 发送消息的时候设置的token,可以用来判断哪一条消息被点击。
* @example
* 使用示例：
* yy.channel.appMsg.addEventListener(IYYChannelAppMsg.APP_LINK_CLICKED,onLinkClicked);
*
* function onLinkClicked(eventData)
* {
*     document.getElementById("txtLog").innerHTML="消息的Token="+eventData.token;
* }
*/
IYYChannelAppMsg.APP_LINK_CLICKED = "YY_APP_LINK_CLICKED";


//-------------------------------IYYChannelMicList-------------------------------
/**
* IYYChannelMicList 构造函数。
* @extends IYYCommon
* @class 麦序接口，提供麦序的信息和相关事件。

* @constructor
*/
function IYYChannelMicList() {
};

IYYChannelMicList.prototype = new IYYCommon();

//原始数据格式 { "ret":0, "mic_list";[9090115887,909058887] }。
/**
* 获取麦序列表。
* @returns 返回麦序中所有用户的uid,uid保存在一个数组中。
* @type Array
*/
IYYChannelMicList.prototype.getMicList = function() {
    var result = callExternal("IChannelMicList_GetMicList();");
    if(result.ret==0)
    {
        return result.mic_list;
    }
    else
    {
        return [];
    }
};


/**
* 麦序用户增加事件。当有用户加入到麦序时会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.uid: int类型 加入的用户uid。
* @example
* 使用示例：
* yy.channel.micList.addEventListener(IYYChannelMicList.USER_JOIN,onUserJoin);
*
* function onUserJoin(eventData)
* {
*     document.getElementById("txtLog").innerHTML="用户"+eventData.uid+"加入到了麦序中";
* }
*/
IYYChannelMicList.USER_JOIN = "YY_USER_JOIN";


/**
* 麦序用户离开事件。当有用户离开麦序时会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.uid: int类型 离开的用户uid。
* @example
* 使用示例：
* yy.channel.micList.addEventListener(IYYChannelMicList.USER_LEAVE,onUserLeave);
*
* function onUserLeave(eventData)
* {
*     document.getElementById("txtLog").innerHTML="用户"+eventData.uid+"离开麦序了";
* }
*/
IYYChannelMicList.USER_LEAVE = "YY_USER_LEAVE";


/**
* 麦序用户移动事件。麦序用户发生位置调整的时候会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* 侦听函数参数说明: 
* eventData.moveId: int类型 麦序中发生移动的用户uid。
* eventData.toAfterId: int类型 移动到哪个用户后面，用户无法移动到第一个。   
* @example
* 使用示例：
* yy.channel.micList.addEventListener(IYYChannelMicList.USER_MOVE,onUserMove);
*
* function onUserMove(eventData)
* {
*     document.getElementById("txtLog").innerHTML="用户"+eventData.uid+"移动到"+eventData.toAfterId+"后面";
* }
*/
IYYChannelMicList.USER_MOVE = "YY_USER_MOVE";


/**
* 麦序用户清除事件。麦序用户全部被清除的时候会触发。
* @field
* @example
* 侦听函数格式: function(){    } 
* @example
* 使用示例：
* yy.channel.micList.addEventListener(IYYChannelMicList.CLEAR,onUserClear);
*
* function onUserClear()
* {
*     document.getElementById("txtLog").innerHTML="麦序用户被清除";
* }
*/
IYYChannelMicList.CLEAR = "YY_USER_CLEAR";


//-------------------------------IYYChannelUserListPopMenu-------------------------------
/**
* IYYChannelUserListPopMenu 构造函数。
* @extends IYYCommon
* @class 用户菜单接口。提供设置和取消频道树用户列表右键菜单功能。
* @constructor
*/
function IYYChannelUserListPopMenu() {

};

IYYChannelUserListPopMenu.prototype = new IYYCommon();


/**
* 设置频道树用户列表右键菜单，可以增加一个菜单项，一个应用只可以增加一个菜单项。
* @param {String} menuText 菜单上的文字。
* @returns 返回操作是否成功, 0=成功 非0值参考错误代码。
* @type int
*/
IYYChannelUserListPopMenu.prototype.setPopMenu = function(menuText) {
    var result = callExternal("IChannelUserListPopMenu_SetPopMenu(\"" + menuText + "\");");
    return result.ret;
};


/**
* 去掉右键菜单增加项。
* @returns 返回操作是否成功, 0=成功 非0值参考错误代码。
* @type int
*/
IYYChannelUserListPopMenu.prototype.unSetPopMenu = function() {
    var result = callExternal("IChannelUserListPopMenu_UnSetPopMenu();");
    return result.ret;
};


/**
* 用户点击菜单项事件。当用户列表右键菜单项被点击的时候会触发。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* eventData.uid: int类型 被选中的用户的uid。
* eventData.cid: int类型 当前的频道长位id。    
* @example
* 使用示例：
* yy.channel.userListPopMenu.addEventListener(IYYChannelUserListPopMenu.CLICKED,onClicked);
*
* function onClicked(eventData)
* {
*     document.getElementById("txtLog").innerHTML="用户"+eventData.uid+"菜单被点击,当前频道"+eventData.cid;
* }
*/

IYYChannelUserListPopMenu.CLICKED = "YY_MENU_CLICKED";
//-----------------------------------IYYIM---------------------------
/**
* IYYIM 构造函数
* @extends IYYCommon
* @class 聊天接口。提供弹出聊天对话框，弹出添加好友对话框等功能。
* @constructor
*/
function IYYIM() {
};

IYYIM.prototype = new IYYCommon();


/**
* 给指定用户发送聊天消息， 调用后会弹出聊天对话框，需要用户点击确认才发送。
* @param {int} uid 用户的唯一标识id，即uid，<b>不是YY号</b> 。
* @param {String} msg 等待发送的聊天的内容。
* @returns 返回发送是否成功,0=成功 非0值参考错误代码。
* @type int 
*/
IYYIM.prototype.chatTo = function(uid, msg) {
    msg = msg.replace(/\"/g, "\\\""); //替换双引号
    var result = callExternal("IIM_ChatTo(" + uid + ",\"" + msg + "\");");
    return result.ret;
}


//原始格式 {ret:0,is_friend:true} 如果是好友
//原始格式 {ret:0,is_friend:false} 不是好友
/**
* 判断指定的用户是否是好友。
* @param {int} uid 指定用户的唯一标识id，即uid，<b>不是YY号</b> 。
* @returns 返回是否是好友,true=是好友 false=不是好友。
* @type Boolean
*/
IYYIM.prototype.isFriend = function(uid) {
    var result = callExternal("IIM_IsFriend(" + uid + ");");
    return result.is_friend;
}


/**
* 弹出添加好友对话框，用户确认才开始添加。
* @param {int} uid 用户的唯一标识id，即uid，<b>不是YY号</b> 。
* @returns 返回弹出窗口是否成功,0=成功 非0值参考错误代码。
* @type int
*/
IYYIM.prototype.addFriend = function(uid) {
    var result = callExternal("IIM_AddFriend(" + uid + ");");
    return result.ret;
}

//-------------------------------IYYCloud-----------------------------

/**
* IYYCloud 构造函数。
* @extends IYYCommon
* @class 云存储接口。提供简单的云存储数据服务，包括增，删，改，查的基本操作，除了ow和 粉马可以删除所有数据之外，其他用户只能删除自己的数据，每个用户都可以可以查询所有数据。
* @constructor
*/
function IYYCloud() {

};


IYYCloud.prototype = new IYYCommon();

//----------常量----------



/**
* 增加数据。<b>注意:两次保存之间需要间隔1秒</b>。
* @param {int} int1 要保存的数据。 
* @param {int} int2 要保存的数据。 
* @param {String} str 要保存的数据。    
* @returns 返回操作是否成功,是一个json对象。
* @example 
* 返回值包括了保存成功后的数据key值,比如 {"ret":0,"key":"000000004f55d48f"}。
* @type Object
*/
IYYCloud.prototype.addData = function(int1, int2, str) {
    if (arguments.length == 0) return;
    str = str.replace(/\\/g, "\\\\"); //替换斜杠
    str = str.replace(/\"/g, "\\\""); //替换双引号
    switch (arguments.length) {
        case 1:
            return callExternal("ICloud_AddData(0, 0, \"" + arguments[0] + "\");");
            break;
        case 2:
            return callExternal("ICloud_AddData(" + arguments[0] + ", 0, \"" + arguments[1] + "\");");
            break;
        case 3:
            return callExternal("ICloud_AddData(" + arguments[0] + ", " + arguments[1] + ", \"" + arguments[2] + "\");");
            break;
        default:
    }
};


/**
* 修改数据。
* @returns 返回操作是否成功。0=成功，非0值请参考错误代码 。
* @param {int} int1 被修改的数据的新值。 
* @param {int} int2 被修改的数据的新值。 
* @param {String} str 被修改的数据的新值。          
* @param {Array} filter 过滤器数组，保存YYCloudFilter对象数组，找到要修改的数据。       
* @type int
* @see YYCloudFilter
*/
IYYCloud.prototype.updateData = function(int1, int2, str, filter) {
    var filterString = "";
    var sp = "";
    str = str.replace(/\\/g, "\\\\"); //替换斜杠
    str = str.replace(/\"/g, "\\\""); //替换双引号
    for (var i = 0; i < filter.length; i++) {
        filterString = filterString + sp + filter[i].toString();
        sp = ",";
    }
    var result = callExternal("ICloud_UpdateData(" + int1 + "," + int2 + " ,\"" + str + "\", '[" + filterString + "]');");
    return result.ret;
};


/**
* 删除数据。
* @returns 返回操作是否成功。0=成功，非0值请参考错误代码 。
* @param {Array} filter 过滤器数组,即删除的条件。保存YYCloudFilter对象数组。   
* @type int
* @see YYCloudFilter
*/
IYYCloud.prototype.deleteData = function(filter) {
    var filterString = "";
    var sp = "";
    for (var i = 0; i < filter.length; i++) {
        filterString = filterString + sp + filter[i].toString();
        sp = ",";
    }
    var result = callExternal("ICloud_DeleteData('[" + filterString + "]');");
    return result.ret;
};


//原始返回格式
//{"ret":0,"data":[
//*  {"key":"4f55d3d7","create_time":"2012-03-06 17:07:35","update_time":"2012-03-06 17:07:35","creator_uid":1710881282,"int1":1,"int2":100,"str":"你好，云存储！hello cloud"},
// *  {"key":"4f55d48f","create_time":"2012-03-06 17:10:39","update_time":"2012-03-06 17:10:39","creator_uid":1710881282,"int1":1,"int2":100,"str":"可存可取"},
//*  {"key":"4f55d57d","create_time":"2012-03-06 17:14:37","update_time":"2012-03-06 17:14:37","creator_uid":1710881282,"int1":1,"int2":100,"str":"this is test"}
//*]} 
//* 如果没有查询到数据，格式如下
//* {"ret":0,"data":[]}


/**
* 查询数据。
* @param {Array} filter 过滤器数组，查询的条件。数组中为YYCloudFilter对象。    
* @returns 返回查询结果，保存在数组中。数组中为YYCloudData对象。
* @type Array
* @see YYCloudData 
* @see YYCloudFilter
*/
IYYCloud.prototype.queryData = function(filter) {
    var filterString = "";
    var sp = "";
    for (var i = 0; i < filter.length; i++) {
        filterString = filterString + sp + filter[i].toString();
        sp = ",";
    }
    var result = callExternal("ICloud_QueryData('[" + filterString + "]');");
    if(result.ret==0)
    {
        return parseCloudDataList(result.data); 
    }
    else
    {
    
        return []
    }
}


//------------------------------IYYNet------------------------------

/**
* IYYNet 构造函数。
* @extends IYYCommon
* @class 网络通讯接口。提供广播数据和接收广播数据的功能。
* @constructor
*/
function IYYNet() {

};

IYYNet.prototype = new IYYCommon();

/**
* 子频道数据广播，包括自己。
* @returns 返回操作是否成功,0=成功，非0值请参考错误代码 。 
* @param {int} sub_channel_id 子频道的长位id。
* @param {String} data 要广播的数据。
* @type int
*/
IYYNet.prototype.broadcastSubChannel = function(sub_channel_id, data) {
    var result = callExternal("INet_BroadCastSubChannel(" + sub_channel_id + ",\"" + encodeURI(data) + "\");");
    return result.ret;
};

/**
* 全频道数据广播，包括自己。
* @returns 返回操作是否成功，0=成功，非0值请参考错误代码 。
* @param {String} data 要广播的数据。
* @type int
*/
IYYNet.prototype.broadcastAllChannel = function(data) {

    var result = callExternal("INet_BroadCastAllChannel(\"" + encodeURI(data) + "\");");
    return result.ret;
};

/**
* 广播给指定用户。
* @returns 返回操作是否成功,0=成功，非0值请参考错误代码 。
* @param {Array} u_array 接收广播的用户uid，保存在一个数组中。 
* @param {String} data 要广播的数据。    
* @type int
*/
IYYNet.prototype.broadcastToUsers = function(data, u_array) {
    var result = callExternal("INet_BroadCastToUsers(\"" + encodeURI(data) + "\", \"[" + u_array.toString() + "]\");");
    return result.ret;

};

/* 
* 应用连接事件
* @private
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* eventData.result: int类型 连接结果  0=成功 ,非0值=不成功。
* @example
* 使用示例：
* yy.net.addEventListener(IYYNet.CONNECTED,onConnected);
*
* function onConnected(eventData)
* {
*     if(eventData.result==0) document.getElementById("txtLog").innerHTML="成功连接";
* }
*/
IYYNet.CONNECTED = "YY_CONNECTED";


/**
* 应用关闭事件。应用关闭前会收到此事件。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* eventData.result: int类型  断开结果  0=成功 ,非0值=不成功。
* @example
* 使用示例：
* yy.net.addEventListener(IYYNet.CLOSED,onClosed);
*
* function onClosed(eventData)
* {
*     if(eventData.result==0) document.getElementById("txtLog").innerHTML="成功关闭";
* }
*/
IYYNet.CLOSED = "YY_CLOSED";

/**
* 收到频道广播消息事件。 收到广播消息后触发此事件。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* eventData.data: String类型  接收到的数据。
* @example
* 使用示例：
* yy.net.addEventListener(IYYNet.RECV,onRecv);
*
* function onRecv(eventData)
* {
*     document.getElementById("txtLog").innerHTML="接收到"+eventData.data;
* }
*/
IYYNet.RECV = "YY_RECV";    


//--------------------------------------IYYUser----------------------------------
/**
* IYYUser 构造函数。
* @extends IYYCommon
* @class 用户信息接口。提供获取用户的信息，接收用户信息变化事件等功能。
*/
function IYYUser() {

};


IYYUser.prototype = new IYYCommon();

//原始信息格式 {"ret":0,"uid":50002277,"imid":51285414,"sex":1,"role":200,"points":114,"level":21,"name":"孤独小羊","sign":"最近经常失眠"}
/**
* 获取当前用户的信息。
* @example
* 使用示例：
* var userInfo = yy.user.getCurrentChannelInfo();
* @returns 返回当前用户信息,是一个YYUserInfo对象。
* @type YYUserInfo
* @see YYUserInfo
*/
IYYUser.prototype.getCurrentUserInfo = function() {
    var result = callExternal("IUser_GetCurrnetUserInfo();");
    if(result.ret==0)
    {
        return parseUserInfo(result);
    }
    else
    {
        return null;
    }
};


/**
* 获取指定的用户的信息。
* @returns 返回当前用户信息,是一个YYUserInfo对象。
* @param {int} uid 用户的唯一标识id，即uid，<b>不是YY号</b> 。
* @type YYUserInfo
* @see YYUserInfo
*/
IYYUser.prototype.getUserInfo = function(uid) {
    var result = callExternal("IUser_GetUserInfo(" + uid + ");");
    if(result.ret==0)
    {
       return parseUserInfo(result);
    }
    else
    {
        return null;
    }
};


/**
* 用户信息变更事件。用户昵称，性别，签名修改的时候都会触发此事件。
* @field
* @example
* 侦听函数格式: function(eventData){    } 
* eventData: YYUserInfo类型 变化后的用户信息。
* @example
* 使用示例：
* yy.user.addEventListener(IYYUser.USER_INFO_CHANGED,onChange);
*
* function onChange(eventData)
* {
*    document.getElementById("txtLog").innerHTML=eventData.name+ "的信息发生了变化";
* }
* @see YYUserInfo
*/
IYYUser.USER_INFO_CHANGED = "YY_USER_INFO_CHANGED";   

/**
* 调用YY平台提供的接口
* @param {String} func 接口的函数名称 
* @private
*/
function callExternal(func) {

    try {
        //打印执行语句
        if (debugMode) {
            var txtConsole = document.getElementById("txtConsole");
            if (txtConsole != null) txtConsole.innerText = "window.external." + func + "\n" + txtConsole.innerText;        
        }
        


        //执行此语句，跟容器通讯，调用api
        var retString = eval("window.external." + func);

        //控制台返回值
        if (debugMode) {
            if (txtConsole != null) txtConsole.innerText = retString + "\n" + txtConsole.innerText;
        }
        try {
            var retJson = eval("(" + retString + ")");
        } catch (exjson) {
            throw "转json出错" + exjson;
        }

        if (retJson.ret == null) throw "NO_RET";
        return retJson;
    } catch (ex) {
    //控制台输出异常
        if (debugMode) {
            if (txtConsole != null) txtConsole.innerText = "错误! 原因:" + ex + "\n" + txtConsole.innerText;
        }
        if (ex == "NO_RET") return { ret: -2, msg: "返回信息没有ret属性" };
        else return { ret: -1, msg: "错误! 原因:" + ex };
    }

}

//创建api对象，供调用所有api，全局变量。
window["yy"] = new IYY();

//})(); //保存到命名空间中


//---------------------------------------------------------数据类-----------------------------------------------------------------
/**
* 构造函数。
* @class 保存用户的信息。
*/
function YYUserInfo() {
    /**
    * 用户的名称
    * @field
    * @type String
    */
    this.name = "";
    /**
    * 用户的性别 （0:男 1:女） 
    * @field
    * @type int
    */
    this.sex = 0;

    /**
    * 用户的uid,唯一标识id
    * @field
    * @type int
    */
    this.uid = 0;

    /**
    * 用户的YY号
    * @field
    * @type int    
    */
    this.imId = 0;

    /**
    * 用户的马甲 对应的信息如下：<br>
    *   无效角色 0 <br>
    *   访问者  灰马 20 <br>
    *   普通成员  白马 25 <br>
    *   临时嘉宾  66 <br>
    *   嘉宾  绿马 88 <br>
    *   会员  蓝马 100 <br>
    *   二级子频道管理员  红马 150 <br>
    *   一级子频道管理员 175 <br>
    *   管理员  黄马 200 <br>
    *   副会长 230 <br>
    *   频道所有者  紫马 255 <br>
    *   客服 300 <br>
    *   网监 400 <br>
    *   DW官方人员 黑马 1000 <br>       
    * @field
    * @type int       
    */
    this.role=0;

    /**
    * 用户的个人积分
    * @field
    * @type int    
    */
    this.points=0;

    /**
    * 用户的等级
    * @field
    * @type int       
    */
    this.level=0;

    /**
    * 用户的签名
    * @field
    * @type String       
    */
    this.sign="";
}

/**
* 构造函数。
* @class 保存频道的信息。
*/
function YYChannelInfo() {
    /**
    * 频道长位id。
    * @field
    * @type int     
    */
    this.longId = 0;
    /**
    * 频道短位id。
    * @field
    * @type int     
    */
    this.shortId = 0;
    /**
    * 频道名称。
    * @field
    * @type String     
    */
    this.name = "";
}

/**
* 构造函数。
* @class 保存YY API版本信息。
*/
function YYVersion() {
    /**
    * 主版本号。
    * @field
    * @type int
    */
    this.majorVersion = 0;
    /**
    * 副版本号。
    * @field
    * @type int
    */
    this.minorVersion = 0;
}

/**
* 构造函数。
* @class 保存云数据信息。
*/
function YYCloudData() {
    /**
    * 数据的键值。
    * @field
    * @type String
    */  
    this.uniqueKey="";
  	/**
    * 数据创建的时间。
    * @field
    * @type String
    */          
    this.createTime="";
    
   	/**
    * 数据更新的时间。
    * @field
    * @type String
    */          
    this.updateTime="";       

   	/**
    * 数据创建者的uid。
    * @field
    * @type int
    */          
    this.creatorUid=0;       
   	/**
    * int字段数据。
    * @field
    * @type int
    */          
    this.intValue1=0;
  	/**
    * int字段数据。
    * @field
    * @type int
    */          
    this.intValue2=0;
  	/**
    * string字段数据。
    * @field
    * @type String
    */          
    this.stringValue="";                       
}

YYCloudData.prototype.toString = function() {
    var s = "{\"uniqueKey\":\"" + this.uniqueKey + "\",\"creatorUid\":" + this.creatorUid + ",\"createTime\":\"" + this.createTime + "\",\"updateTime\":\"" + this.updateTime + "\",";
    s += "\"intValue1\":" + this.intValue1 + ",\"intValue2\":" + this.intValue2 + ",\"stringValue\":\"" + this.stringValue + "\"}";
    return s;
}

/**
* 构造函数。
* @class 云存储条件过滤器，保存查询条件。
*/
function YYCloudFilter() {
   	/**
    * 对哪个字段进行过滤。
    * @field
    * @type int
    */          
    this.field=0;       
   	/**
    * 操作符，比如大于小于等。
    * @field
    * @type int
    */          
    this.op=0;
  	/**
    * 字段数值。
    * @field
    * @type Object
    */          
    this.value=null;
  	/**
    * 和其他filter的关系。
    * @field
    * @type int
    */          
    this.condition=0;                       
}
/**
* 云存储的字段表示常量。
* @field
* @example
* YYCloudFilter.EField.NONE 0 无效字段
* YYCloudFilter.EField.UNIQUE_KEY 1 唯一键 字段
* YYCloudFilter.EField.USER_ID 2 uid字段
* YYCloudFilter.EField.EXTERNAL_VALUE1 3 扩展int1 字段
* YYCloudFilter.EField.EXTERNAL_VALUE2 4 扩展int2 字段
* YYCloudFilter.EField.CREATE_TIME 5 创建时间
* YYCloudFilter.EField.UPDATE_TIME 6 更新时间
*/
YYCloudFilter.EField =
{
    //!无效字段
    NONE: 0,
    //!key 唯一键 字段
    UNIQUE_KEY: 1,
    //!uid 字段
    USER_ID: 2,
    //!扩展int1 字段
    EXTERNAL_VALUE1: 3,
    //!扩展int2 字段
    EXTERNAL_VALUE2: 4,
    //!创建时间
    CREATE_TIME: 5,
    //!更新时间
    UPDATE_TIME: 6
};

/**
* 云存储的操作符常量。
* @field
* @example
* YYCloudFilter.EFilterOperator.NONE 0 无效操作
* YYCloudFilter.EFilterOperator.EQ 1 等于
* YYCloudFilter.EFilterOperator.GE 2 大于等于
* YYCloudFilter.EFilterOperator.LE 3 小于等于
* YYCloudFilter.EFilterOperator.GREATER 4 大于
* YYCloudFilter.EFilterOperator.LESS 5 小于
*/
YYCloudFilter.EFilterOperator =
{
    //! 无效操作
    NONE: 0,
    //! = 等于
    EQ: 1,
    //! >= 大于等于
    GE: 2,
    //! <= 小于等于	
    LE: 3,
    //! = 大于
    GREATER: 4,
    //! < 小于
    LESS: 5
};

/**
* 云存储的条件运算常量。
* @field
* @example
* YYCloudFilter.EFilterCondition.NONE 0 无效条件
* YYCloudFilter.EFilterCondition.AND  1 条件 与 and 
* YYCloudFilter.EFilterCondition.OR 2 条件 或 or
*/
YYCloudFilter.EFilterCondition =
{
    //!无效条件
    NONE: 0,
    //! 条件 与 and 
    AND: 1,
    //! 条件 或 or
    OR: 2
};
YYCloudFilter.prototype.toString=function()
{
    switch (this.field) {
        case YYCloudFilter.EField.EXTERNAL_VALUE1, YYCloudFilter.EField.EXTERNAL_VALUE2:
            return "{\"field\":" + this.field + ",\"op\":" + this.op + ",\"value\":" + this.value + ",\"condition\":" + this.condition + "}";
        case YYCloudFilter.EField.UNIQUE_KEY:    
            return "{\"field\":" + this.field + ",\"op\":" + this.op + ",\"value\":\"" + this.value + "\",\"condition\":" + this.condition + "}";
        default:
            return "{\"field\":" + this.field + ",\"op\":" + this.op + ",\"value\":" + this.value + ",\"condition\":" + this.condition + "}";
    }
    
   
}



//---------------------------------------下面为回调函数------------------------------------------------------------------------------------------------
/**
* 运行时，应用图标被点击事件。
* @private
*/
function IYY_OnActive(activeCode) {
yy.dispatchEvent(IYY.Active, { acttiveCode: activeCode });
}


//-----------------------语音设备更换[Event]----------------------
/**
* 录音错误事件。
* @param {int} err_code 录音错误代码，参考错误代码表。
* @private
*/
function IAudioEvent_OnRecordErr(err_code) {
yy.audio.dispatchEvent(IYYAudio.RECORD_ERR, { errCode: err_code });
}


/**
* 录音完成事件。
* @param {String} info 录音完成信息。
* @example 
* 返回参数示例: {result:0,file_name:"abcd"} 
* result 录音是否成功 0成功，非0值失败。
* file_name 录音文件的名称，不带没有扩展名和路径。
* @private
*/
function IAudioEvent_OnRecordFinished(info) {
var retJson = eval("(" + info + ")");
yy.audio.dispatchEvent(IYYAudio.RECORD_FINISHED, { result: retJson.result, fileName: retJson.file_name });
}

//-----------------------频道信息获取回调接口 [Event]----------------------
/**
* 子频道跳转事件。
* @param {String} info 频道跳转信息，是一个可以转成Json的字符串。
* @example
* 返回参数示例: {departed_id:15488855,now_id:85526655}
* departed_id 原来子频道id。
* now_id 现在子频道id。
* @private
*/

function IChannelEvent_OnFocusChannelChannged(info) {
var retJson = eval("(" + info + ")");
yy.channel.dispatchEvent(IYYChannel.FOCUS_CHANNEL_CHANGED, { departedId: retJson.departed_id, nowId: retJson.now_id });
}

/**
* 当前频道信息改变事件。
* @param {String} info 改变后的频道信息，是一个可以转成Json的字符串。
* @example
* 返回参数示例: 
*
* {"ret":0,"long_id":51285414,"short_id":6048,"name":"月光酒吧"}
*
* ret 返回码 
* long_id 频道长位id
* short_id 频道短位id
* name 频道名称id
* @private
*/
function IChannelEvent_OnChannelInfoChannged(info) {
var retJson = eval("(" + info + ")");
yy.channel.dispatchEvent(IYYChannel.CHANNEL_INFO_CHANGED, parseChannelInfo(info));


}





/**
* 删除子频道时产生事件。
* @param {int} cid 被删除的子频道长位id。
* @private
*/
function IChannelEvent_OnSubChannelDel(cid) {
yy.channel.dispatchEvent(IYYChannel.SUB_CHANNEL_DEL,{cid:cid});
}


/**
* 添加子频道时产生事件。
* @param {String} info 频道添加的信息，是一个可以转成Json的字符串。
* @example 
* 返回参数示例: {cid:15488855,pcid:85526655} 
* cid 增加的子频道长位id。
* pcid 增加到哪个父频道下，长位id。
* @private
*/
function IChannelEvent_OnSubChannelAdd(info) {
var retJson = eval("(" + info + ")");
yy.channel.dispatchEvent(IYYChannel.SUB_CHANNEL_ADD ,{cid:retJson.cid,pcid:retJson.pcid});
}
/**

* 用户进入频道树事件，子频道之间跳转不会触发此事件。
* @param {String} info 用户加入频道的信息
* @example 
* 返回参数示例: {uid:905488855,cid:85526655} 
* uid 进入的用户的uid。
* cid 进入时进入到频道树中的哪个频道。
* @private
*/
function IChannelEvent_OnUserEnterChannel(info) {
var retJson = eval("(" + info + ")");
yy.channel.dispatchEvent(IYYChannel.USER_ENTER_CHANNEL, {uid:retJson.uid,cid:retJson.cid});
}

/**
* 用户离开频道树事件，子频道之间跳转不会触发此事件。
* @param {String} info 用户离开频道的信息
* @example 
* 返回参数示例: {uid:905488855,cid:85526655} 
* uid 离开的用户的uid。
* cid 离开频道树时所处的频道。
* @private
*/
function IChannelEvent_OnUserLeaveChannel(info) {
var retJson = eval("(" + info + ")");
yy.channel.dispatchEvent(IYYChannel.USER_LEAVE_CHANNEL,{uid:retJson.uid, cid:retJson.cid});
}



///
//------------------------频道用户列表右键菜单事件通知 [Event]
///
/**
* 频道用户列表右键菜单项被点击事件。
* @param {String} info 点击用户的信息。
* @example 
* 返回参数示例: {uid:905488855,cid:85526655} 
* uid 被点中的用户uid。
* cid 当前所在的频道。
* @private
*/
function IChannelUserPopMenuEvent_OnClicked(info) {
var retJson = eval("(" + info + ")");
yy.channel.userListPopMenu.dispatchEvent(IYYChannelUserListPopMenu.CLICKED,{uid:retJson.uid, cid:retJson.cid});
}

///
//------------------------网络状态回调 [Event]
///


/**
* 连接成功的事件。
* @param {int} result 0成功，非0值失败。
* @private
*/
function INetEvent_OnConnected(result) {
yy.net.dispatchEvent(IYYNet.CONNECTED,{result:result});
}


/**
* 连接断开后事件。
* @param {int} result 0:主动断开, 其他错误参考错误代码表
* @private
*/
function INetEvent_OnClosed(result) {
yy.net.dispatchEvent(IYYNet.CLOSED ,{result:result});
}


/**
* 收到广播数据包事件。
* @param {Object} data 收到数据
* @private
*/
function INetEvent_OnRecv(data) {
yy.net.dispatchEvent(IYYNet.RECV,{data:decodeURI(data)});
}


///
//------------------------------------------频道应用信息链接事件 [Event]
///


/**
* 应用消息中的链接被点击事件。
* @param {int} token 消息标记，区分不同的消息。
* @private
*/
function IChannelAppLinkEvent_OnAppLinkClicked(token) {
yy.channel.appMsg.dispatchEvent(IYYChannelAppMsg.APP_LINK_CLICKED,{token:token});
}

///
//------------------------------------------麦序相关接口事件
///

//麦序列表发生改变


/**
* 用户加入到麦序事件。
* @param {uid} 加入到麦序的用户uid。
* @private
*/
function IMicListEvent_OnUserJoin(uid) {
yy.channel.micList.dispatchEvent(IYYChannelMicList.USER_JOIN,{uid:uid});
}
/**
* 用户离开麦序事件。
* @param {int} uid 离开麦序的用户uid。
* @private
*/
function IMicListEvent_OnUserLeave(uid) {
yy.channel.micList.dispatchEvent(IYYChannelMicList.USER_LEAVE,{uid:uid});
}
/**
* 用户在麦序中的位置发生变化事件，同一子频道的用户会收到。
* @example 
* 返回参数示例: {move_id:905488855,to_after_id:905477756} 
* move_id:发生移动的id。
* to_after_id:移动到那个用户后面。
* @private
*/
function IMicListEvent_OnUserMove(info) {
var retJson = eval("(" + info + ")");
yy.channel.micList.dispatchEvent(IYYChannelMicList.USER_MOVE,{moveId: retJson.move_id,toAfterId:retJson.to_after_id});
}

/**
* 麦序被清除事件。
* @private
*/
function IMicListEvent_OnClear() {
yy.channel.micList.dispatchEvent(IYYChannelMicList.CLEAR);
}


//----------------------------用户事件回调------------------------------------------
/**
* 用户信息改变事件，得到改变后的用户信息。
* @param {String} info 改变后的用户信息,是一个可以转成Json的字符串。
* @private
*/
function IUserEvent_OnUserInfoChanged(info) {
    var retJson = eval("(" + info + ")");
    yy.user.dispatchEvent(IYYUser.USER_INFO_CHANGED,parseUserInfo(retJson));
}

/**
* 转换频道信息格式。
* @private
*/
function parseChannelInfo(info) {
var cinfo = new YYChannelInfo();
cinfo.longId = info.long_id;
cinfo.shortId = info.short_id;
cinfo.name = info.name;
return cinfo;
}

/**
* 转换用户信息格式。
* @private
*/
function parseUserInfo(info) {
var userInfo = new YYUserInfo();
userInfo.uid=info.uid;
userInfo.name=info.name;
userInfo.imId=info.imid;
userInfo.role=info.role;
userInfo.points = info.points;
userInfo.level=info.level;
userInfo.sex=info.sex;
userInfo.sign=info.sign;

return userInfo;
}
/**
* 转换用户信息格式。
* @private
*/
function parseCloudDataList(data) {
var dataArray=[];
for(var i=0;i<data.length;i++)
{
    var dt = new YYCloudData();
  dt.uniqueKey =data[i].key;
  dt.createTime =data[i].create_time;
  dt.updateTime =data[i].update_time;
  dt.creatorUid =data[i].creator_uid;
  dt.intValue1 =data[i].int1;
  dt.intValue2 =data[i].int2;
  dt.stringValue =data[i].str;
  dataArray.push(dt); 
}

return dataArray;
}
