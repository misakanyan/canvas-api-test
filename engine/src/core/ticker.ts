namespace engine {

    export type Ticker_Listener_Type = (deltaTime: number) => void;

    export class Ticker {

        private static instance: Ticker;

        static getInstance() {
            if (!Ticker.instance) {
                Ticker.instance = new Ticker();
            }
            return Ticker.instance;
        }

        listeners: Ticker_Listener_Type[] = [];

        register(listener: Ticker_Listener_Type) {
            let x=this.listeners.indexOf(listener);
            if(x<0){
                this.listeners.push(listener);
            }else{
                console.log("already listen");
            }
        }

        unregister(listener: Ticker_Listener_Type) {
            let x=this.listeners.indexOf(listener);
            if(x>=0){
                this.listeners.splice(x,1);
            }else{
                console.log("no listener");
            }
        }

        notify(deltaTime: number) {
            for (let listener of this.listeners) {
                listener(deltaTime);
            }
        }

    }

}