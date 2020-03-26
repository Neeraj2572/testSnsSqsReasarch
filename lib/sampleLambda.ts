// exports.handler = function(event, context) {
//     console.log('Received event:');
//     console.log(JSON.stringify(event, null, '  '));
//     // escape admin manipulation
//     var bucket = event.Records[0].s3.bucket.name;
//     var key = event.Records[0].s3.object.key;
//     console.log('bucket: ', bucket, ' key: ', key);
//     S3.copyObject({
//       Bucket: 'mybucket',
//       CopySource: bucket + '/' + key,
//       Key: 'test.txt'
//     }, function(err, data) {
//       if (err) {
//         console.log('cant copy object');
//         console.log(err, err.stack)
//       }
//       S3.deleteObject({Bucket:bucket, Key:key}, function(err, data) {
//         if (err) {
//           console.log(err, err.stack)
//         }
//         context.done(null, '');
//       });
//     });
//   };