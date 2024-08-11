var webSocket;
var CTRL_TO_READ_SHORT = 1;
var CTRL_TO_READ_ARRAY_SHORT = 2;
var CTRL_TO_CHANGE_GAME = 3;
var CTRL_TO_SEND_MSG = 4;
var CTRL_TO_CREATE_NEW_ROOM = 5;
var CTRL_TO_SEND_MSG_IN_GAME_ROOM = 6;
var CTRL_TO_LOGIN_GAME_ROOM = 7;
var CTRL_PRINT_ROOM_INFO = 8;
var CTRL_TO_LOGIN = 9;
var CTRL_TO_CREATE_NEW_USER = 10;
var CTRL_TO_CHANGE_PASS = 11;
var CTRL_TO_LOGOUT = 12;
var CTRL_TO_USER_INFO = 13;


function connectToMyServer(url)
{
    webSocket = new WebSocket(url == undefined ? "ws://127.0.0.1:8081/websocket" : url);

    // Change binary type from "blob" to "arraybuffer"
    webSocket.binaryType = "arraybuffer";

    // Connection opened
    webSocket.addEventListener("open", (event) => {
        //socket.send("Hello Server!");

        cc.log("Connect to game server ok !");

    });
    
    // Listen for messages
    webSocket.addEventListener("message", (event) => {

        cc.log("Message from server...");

        if (event.data instanceof ArrayBuffer) 
        {
            cc.log("is binary message.");
    
            handleResponse(event.data);
        } 
        else 
        {
            cc.log("is text message.");
        
            // text frame
            cc.log(event.data);  
        }

    });

    // Connection closed
    webSocket.addEventListener("close", (event) => {
        
        cc.log("Connection closed !");

    });
}


function sendNewUserReq(username, password)
{
    if (webSocket && webSocket.readyState == WebSocket.OPEN)
    {
        let buf = new Uint8Array(username.length + password.length + 2 + 2); // 64, 128, 256
        let off = 0;

        off = packInt8(CTRL_TO_CREATE_NEW_USER, buf, off);
        off = packString(username,  buf, off);
        //off = packString("_",buf, off);
        off = packString(password,  buf, off);

        webSocket.send(buf);

        /*
        let buf = new ArrayBuffer(username.length + password.length + 1);
        
        let dataWriter = new Uint8Array(buf);
        var off = 0;
        dataWriter[off++] = 10; 
        let tmp = 0;
        for (var i = off; i < username.length + password.length; i++)
        {
            if(i >= username.length)
                dataWriter[i] = password.charCodeAt(i-username.length); 
            else
                dataWriter[i] = username.charCodeAt(i);
        }
        webSocket.send(buf);
        */
    }
    else 
    {
        cc.log("Please connect to server first !");
    }
}

function packString(str,buf, off)
{
    buf[off++] = str.length;
    for (var i = 0; i < str.length; i++)
    {
        buf[off++] = str.charCodeAt(i);
    }
    return off;
}

function packInt8(value, buf, off)
{
    
        cc.log("sendInt8() with value = " + value);
      
        //let buf = new ArrayBuffer(1);
        
        //let dataWriter = new DataView(buf);

        //let offset = 0;

        buf[off++] = value;

        //dataWriter.setInt8(offset, value);
        //offset += 1;

        //webSocket.send(buf);

        return off;
}

function sendInt8(value)
{
    if (webSocket && webSocket.readyState == WebSocket.OPEN)
    {
        cc.log("sendInt8() with value = " + value);
      
        let buf = new ArrayBuffer(3);
        
        let dataWriter = new DataView(buf);

        let offset = 0;
        dataWriter.setInt8(offset, CTRL_TO_READ_SHORT);
        offset++;
        dataWriter.setInt8(offset, value);
        offset += 1;

        webSocket.send(buf);
    }
    else
    {
        cc.log("Please connect to server first !");
    }
}


function sendInt16(value)
{
    if (webSocket && webSocket.readyState == WebSocket.OPEN)
    {
        cc.log("sendInt16() with value = " + value);
      
        let buf = new ArrayBuffer(3);
        
        let dataWriter = new DataView(buf);

        let offset = 0;
        dataWriter.setInt8(offset, CTRL_TO_READ_SHORT);
        offset++;
        dataWriter.setInt16(offset, value);
        offset += 2;

        webSocket.send(buf);
    }
    else
    {
        cc.log("Please connect to server first !");
    }
}

function sendInt16Array(value)
{
    if (webSocket && webSocket.readyState == WebSocket.OPEN)
        {
           for (let i = 0; i < value.length; i++)
           {
            cc.log("sendInt16Array() with value = " + value[i]);
           }
          
            let buf = new ArrayBuffer(2 * value.length + 2);
            
            let dataWriter = new DataView(buf);
            let offset = 0;
            dataWriter.setInt8(offset, CTRL_TO_READ_ARRAY_SHORT);
            offset++;
            //write len of arra
            dataWriter.setInt8(offset, value.length);
            offset++;

            for (let i = 0; i < value.length; i++)
            {
                dataWriter.setInt16(offset, value[i]);
                offset += 2;
            }
            webSocket.send(buf);
        }
        else
        {
            cc.log("Please connect to server first !");
        }
}

function sendLogin(username, password)
{
    if (webSocket && webSocket.readyState == WebSocket.OPEN)
        {
            let buf = new Uint8Array(username.length + password.length + 2 + 2); // 64, 128, 256
            let off = 0;
    
            off = packInt8(CTRL_TO_LOGIN, buf, off);
            off = packString(username,  buf, off);
            //off = packString("_",buf, off);
            off = packString(password,  buf, off);
    
            webSocket.send(buf);
    
            /*
            let buf = new ArrayBuffer(username.length + password.length + 1);
            
            let dataWriter = new Uint8Array(buf);
            var off = 0;
            dataWriter[off++] = 10; 
            let tmp = 0;
            for (var i = off; i < username.length + password.length; i++)
            {
                if(i >= username.length)
                    dataWriter[i] = password.charCodeAt(i-username.length); 
                else
                    dataWriter[i] = username.charCodeAt(i);
            }
            webSocket.send(buf);
            */
        }
        else 
        {
            cc.log("Please connect to server first !");
        }
}

function sendReqChangePass(password)
{
    if (webSocket && webSocket.readyState == WebSocket.OPEN)
        {
            let buf = new Uint8Array(password.length + 2); // 64, 128, 256
            let off = 0;
    
            off = packInt8(CTRL_TO_CHANGE_PASS, buf, off);
            //off = packString("_",buf, off);
            off = packString(password,  buf, off);
    
            webSocket.send(buf);
    
        }
        else 
        {
            cc.log("Please connect to server first !");
        }
}

function sendReqLogout()
{
    if (webSocket && webSocket.readyState == WebSocket.OPEN)
        {
            let buf = new Uint8Array(1); // 64, 128, 256
            let off = 0;
    
            off = packInt8(CTRL_TO_LOGOUT, buf, off);
            //off = packString("_",buf, off);
    
            webSocket.send(buf);
    
        }
        else 
        {
            cc.log("Please connect to server first !");
        }
}

// function packInt16(numbers, buf, off)
// {
//     buf[off] = parseInt(numbers); 
//     off += 2;
//     return off;

// }


function sendReqMessage(username, msg)
{
    if (webSocket && webSocket.readyState == WebSocket.OPEN)
    {
        let buf = new Uint8Array(username.length + msg.length + 3); // 64, 128, 256
        let off = 0;
        cc.log(typeof value);
        off = packInt8(CTRL_TO_SEND_MSG, buf, off);
        off = packString(username,buf, off);
        off = packString(msg,buf, off);
        //off = packInt16(value, buf,off);

        webSocket.send(buf);

    }
    else 
    {
        cc.log("Please connect to server first !");
    }
}

function sendCreateGameroomrq(id, pin)
{
    if (webSocket && webSocket.readyState == WebSocket.OPEN)
    {
        let buf = new Uint8Array(id.length + pin.length + 3); // 64, 128, 256
        let off = 0;
        cc.log(typeof value);
        off = packInt8(CTRL_TO_CREATE_NEW_ROOM, buf, off);
        off = packString(id,buf, off);
        off = packString(pin,buf, off);
        //off = packInt16(value, buf,off);

        webSocket.send(buf);

    }
    else 
    {
        cc.log("Please connect to server first !");
    }
}

function sendMessageInGameRoom(msg)
{
    if (webSocket && webSocket.readyState == WebSocket.OPEN)
    {
        let buf = new Uint8Array(msg.length + 2); // 64, 128, 256
        let off = 0;
        cc.log(typeof value);
        off = packInt8(CTRL_TO_SEND_MSG_IN_GAME_ROOM, buf, off);
        off = packString(msg,buf, off);
        //off = packInt16(value, buf,off);

        webSocket.send(buf);

    }
    else 
    {
        cc.log("Please connect to server first !");
    }
}

function sendReqToJoinGameRoom(id, pin)
{
    if (webSocket && webSocket.readyState == WebSocket.OPEN)
    {
        let buf = new Uint8Array(id.length + pin.length + 3); // 64, 128, 256
        let off = 0;
        // cc.log(typeof value);
        off = packInt8(CTRL_TO_LOGIN_GAME_ROOM, buf, off);
        off = packString(id,buf, off);
        off = packString(pin, buf,off);

        webSocket.send(buf);

    }
    else 
    {
        cc.log("Please connect to server first !");
    }
}

function sendReqToRunDinoGame()
{
    if (webSocket && webSocket.readyState == WebSocket.OPEN)
    {
        let buf = new Uint8Array(5); // 64, 128, 256
        let off = 0;
        // cc.log(typeof value);
        off = packInt8(CTRL_TO_CHANGE_GAME, buf, off);
        off = packString("run",buf, off);

        webSocket.send(buf);

    }
    else 
    {
        cc.log("Please connect to server first !");
    }
}

function printOutString(str)
{
    // cc.log(str);
    str = str.replace(" ", ";");    
    cc.log(str);
   
}

function sendReqRoomInfo()
{
    if (webSocket && webSocket.readyState == WebSocket.OPEN)
    {
        let buf = new Uint8Array(5); // 64, 128, 256
        let off = 0;
        // cc.log(typeof value);
        off = packInt8(CTRL_PRINT_ROOM_INFO, buf, off);
        off = packString("Room",buf, off);

        webSocket.send(buf);

    }
    else 
    {
        cc.log("Please connect to server first !");
    }
}

function sendUserInfo()
{
    if (webSocket && webSocket.readyState == WebSocket.OPEN)
    {
        let buf = new Uint8Array(4); // 64, 128, 256
        let off = 0;
        // cc.log(typeof value);
        off = packInt8(CTRL_TO_USER_INFO, buf, off);
        off = packString("user",buf, off);

        webSocket.send(buf);

    }
    else 
    {
        cc.log("Please connect to server first !");
    }
}

function handleResponse(arr_buffer) 
{
    // binary frame
    // const dataReader = new DataView(arr_buffer);
    //decode response msg
    
    const decoder = new TextDecoder();
    var str = decoder.decode(arr_buffer);
    var CTRL_CODE = parseInt(str[0]);
    var array = [10,11,12,13];
    for(var i = 0; i < array.length; i++)
    {
        if (array[i] == parseInt(str[0] + str[1]))
        {
            CTRL_CODE = array[i]; 
            break;
        }
    }
    var param1 = ""; 
    var param2 = "";
    cc.log(typeof str);
    cc.log(CTRL_CODE.toString());
    str = str.replace(CTRL_CODE.toString(),"");
    cc.log(str);
    cc.log(CTRL_CODE);  
    switch (CTRL_CODE)
    {
        case CTRL_TO_READ_SHORT: 
            break;
        
        case CTRL_TO_READ_ARRAY_SHORT: 
            break;
        
        case CTRL_TO_CHANGE_GAME:
            cc.director.runScene(new dinoScene());
            break;
        
        case CTRL_TO_SEND_MSG: 

            break; 
        
        case CTRL_TO_CREATE_NEW_ROOM: 
            var flag = false;
            for (var i = 0; i < str.length; i++)
            {
                if(str[i] != " " && flag == false)
                {
                    param1 += str[i];
                    flag = true;
                }
                else if (flag == true)
                {
                    if(str[i] == " ")
                        continue;
                    param2 += str[i];
                    cc.log(str[i]);
                }
            }
            cc.log(param1 + param2);
            cc.log(param2);
            idRoom = param1; 
            myRole = param2;
            cc.log(myRole);
            break;

        case CTRL_TO_SEND_MSG_IN_GAME_ROOM: 
            break;

        case CTRL_TO_LOGIN_GAME_ROOM: 
            var flag = false;
            for (var i = 0; i < str.length; i++)
            {
                if(str[i] != " " && flag == false)
                {
                    param1 += str[i];
                    flag = true;
                }
                else if (flag == true)
                {
                    if(str[i] == " ")
                        continue;
                    param2 += str[i];
                    cc.log(str[i]);
                }
            }
            cc.log(param1 + param2);
            idRoom = param1; 
            myRole = param2;
            break;

        case CTRL_PRINT_ROOM_INFO: 
            printOutString(str);
            break;

        case CTRL_TO_LOGIN: 
            
            break;

        case CTRL_TO_CREATE_NEW_USER:
            gold = "0"; 
            level = "0";
            break;

        case CTRL_TO_CHANGE_PASS: 
            break;

        case CTRL_TO_LOGOUT: 
            break;

        case CTRL_TO_USER_INFO: 
            printOutString(str);
            break;
        
        
    }

    



    // if (arr_buffer.byteLength == 1)
    // {
    //     let offset = 0;
    //     const respCode = dataReader.getInt8(offset);
    //     cc.log("respCode int8 = " + respCode);
    // }
    // else
    // {
    //     let offset = 0;
    //     const respCode = dataReader.ge(offset);

    //     cc.log("respCode int16 = " + respCode);
    // }
   

    // var flag = false;
    // for (var i = 0; i < str.length; i++)
    // {
    //     if (str[i] == "=")
    //     {
    //         flag = true; 
    //         continue;
    //     }
    //     if (flag == true)
    //     { 
    //         idRoom += str;
    //     }
    //     else if(str[i] == " ")
    //     {
    //         flag = false;
    //         break;
    //     }
    // }

}
