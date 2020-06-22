import cdk = require('@aws-cdk/core');
import * as lambda  from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';

export class TiriTyukantestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lineSampleLambda :any = new lambda.Function(this, 'LineSampleLambda', {
      code: lambda.Code.asset('src/lambda'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      timeout: cdk.Duration.seconds(5),
      environment: {
        ACCESS_TOKEN: `x`,
          CHANNEL_SECRET: `x`
      }
    });


    const api = new apigateway.RestApi(this, 'LineSampleApi', {
        restApiName: 'line-sample'
    });
    const lambdaIntegration = new apigateway.LambdaIntegration(
      lineSampleLambda, { proxy: true } );
    api.root.addMethod('POST', lambdaIntegration)
  }
}