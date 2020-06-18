
const kafka = require('kafka-node');

let conn = {'kafkaHost':'localhost:9092'};

class ProducerMq{
    constructor(handler){
        this.handler=handler;
    }
    mq_producers(){}
    AddProducer(handler){
        console.log('增加生产者',conn, this);
        let client = new kafka.KafkaClient(conn);
        /**
         * Producer(client, [options])
         * client: 和kafka服务保持连接的client对象
         * options：producer的属性
         */
        let producer = new kafka.Producer(client);
    
        producer.on('ready', function(){
            if(!!handler){
                handler(producer);
            }
        });
    
        producer.on('error', function(err){
            console.error('producer error ',err.stack);
        });
    
        this.mq_producers['common'] = producer;
        return producer;
    }
}


module.exports = { ProducerMq }

