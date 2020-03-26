import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import iam = require('@aws-cdk/aws-iam');
import { ManagedPolicy } from '@aws-cdk/aws-iam';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';
import { RestApi, LambdaIntegration } from '@aws-cdk/aws-apigateway';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import * as s3 from '@aws-cdk/aws-s3';
import s3n = require('@aws-cdk/aws-s3-notifications');
import { SnsEventSource } from '@aws-cdk/aws-lambda-event-sources';
// import targets = require('@aws-cdk/aws-events-targets');

//create test bucket
//add bucket policy
//grant public access to bucket
//create queue
//create topic
//add  create event notification
// add publish lambda function
//grant read write permission to publish lambda on testbucket
//add sns subscription to publish lambda and assigne quue
//create dyanmodb table
///create subscribe lambda function
// grant publishFunction SendMessages(from queue;
//grant subscribeFunction ReadWriteData permission on the table 



export class TestSnsStack extends cdk.Stack {
  lambdaIAM: iam.Role;
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //create new bucket 
    const testBucket = new s3.Bucket(this, 'mysnstestbucket');
   


    // create topic
    const topic = new sns.Topic(this, 'TestSnsTopic');

    //create queue
    const queue = new sqs.Queue(this, 'TestSnsQueue', {
      visibilityTimeout: cdk.Duration.seconds(300)
    });


    testBucket.addEventNotification(s3.EventType.OBJECT_CREATED_PUT, new s3n.SnsDestination(topic));

    // publish lambda function
    const publishFunction = new Function(this, 'publishFunction', {
      runtime: Runtime.NODEJS_12_X,
      handler: 'publish.handler',
      code: Code.asset('./lib/lambda'),

      environment: {
        QUEUE_URL: queue.queueUrl
      },
    });
   
    // //Add subscription to invoke lamabda function
    publishFunction.addEventSource(new SnsEventSource(topic));
    //   topic.addSubscription(new subs.LambdaSubscription(publishFunction, {
    //     filterPolicy: {
    //       Contentroperties: sns.SubscriptionFilter.stringFilter({
    //         matchPrefixes: ['data']
    //       })

    //     }
    //   }));

    topic.addSubscription(new subs.EmailSubscription('neeraj.kumar@expleogroup.com'));
    queue.grantSendMessages(publishFunction);
    //create dynamo table
    const table = new Table(this, 'newtable', {
      partitionKey: { name: 'id', type: AttributeType.NUMBER }
    });

    //create labda subscribe function
    const subscribeFunction = new Function(this, 'subscribeFunction', {
      runtime: Runtime.NODEJS_12_X,
      handler: 'subscribe.handler',
      code: Code.asset('./lib/lambda'),
      environment: {
        QUEUE_URL: queue.queueUrl,
        TABLE_NAME: table.tableName
      },
      events: [
        new SqsEventSource(queue)
      ]
    });


    table.grantReadWriteData(subscribeFunction);
    //table.grant(subscribeFunction, "dynamodb:PutItem");


  }
}

