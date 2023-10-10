
import { io } from 'socket.io-client';
import { useRealmConfStore } from '@/stores/realmConf';

class socketIo {
    socket = {};

    constructor(){
    }

    connect(apiServer:String, authToken:String){
        // apiServer = apiServer.replace(/^https:\/\//, 'wss://')
        
        const realmConfStore  = useRealmConfStore();
        const realmConf = realmConfStore.realmConf;
        var query = 'arguments=' + JSON.stringify({realm: realmConf.realm});

        this.socket = io(apiServer, {
            transports: ["websocket"], 
            query: query,
            auth: {
                authorization: `${authToken}`
            }
        });
        this.socket.connect(apiServer, query);
        this.socket.on('connect', this.onConnect);
        this.socket.on('disconnect', this.disconnect);
    };

    disconnect(isLogoff:Boolean){
        if(isLogoff)
            this.socket?.emit('logoff');
        this.socket?.disconnect();
        this.socket?.close();
    };


    onConnect() {
        if(this.connected){
            this.on('push-notification', function(msg){
                try{
                    var message = JSON.parse(msg);
    
                    if(message.type == 'userLogoff'){
                        authLogout();
                    }
                    if(message.data && message.data.realm){
                        var realms;
                        if(Array.isArray(message.data.realm))
                            realms = message.data.realm;
                        else 
                            realms = [message.data.realm];
                        // if(_.intersection(_.map(realms, _.toUpper), realmService.envRealms()).length == 0)
                        //     return;
                    }
                    console.log(message);
                    const { $eventBus } = useNuxtApp();
                    $eventBus.emit('evt:server-pushNotification', message)
                }  
                catch (error){
                    useLogger().error(error, undefined);
                }  
    
            });
        }
        else {
            throw 'Server not connected';
        }
    }

}

export const SocketIOService = new socketIo();