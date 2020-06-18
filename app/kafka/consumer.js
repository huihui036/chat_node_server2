
const kafka = require('kafka-node');

let conn = { 'kafkaHost': '127.0.0.1:9092' };

class ConsumerMQ{
  constructor(topics, options, handler){
    this.topics = topics,
    this.options =options ,
     this.handler =handler

  }
  AddConsumer(topics, options, handler){
    
    let client = new kafka.KafkaClient(conn);
    let consumer = new kafka.Consumer(client, topics, options);
  
    if (!!handler) {
      consumer.on('message', handler);
    }
  
    consumer.on('error', function (err) {
      console.error('consumer error ', err.stack);
    });
  }
}




module.exports = { ConsumerMQ }

//var mq = new MQ();




// mq.AddConsumer(consumers[0].topic, consumers[0].options, function (message) {
//   console.log(message.value);
// });