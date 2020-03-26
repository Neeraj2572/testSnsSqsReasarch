const aws = require('aws-sdk');
const sqs = new aws.SQS();

exports.handler = async (event:any) => {
    const randomInt = Math.floor(Math.random() * Math.floor(10000)).toString();

    const params = {
        QueueUrl: process.env.QUEUE_URL,
        MessageBody: event.Records[0].Sns.Message
        
    };
    console.log(event.Records[0].Sns.Message);
    await sqs.sendMessage(params).promise();

    return {
        statusCode: 200,
        body: `hi, Successfully pushed your message , please note, the message no is ${randomInt}!!`
    }
}