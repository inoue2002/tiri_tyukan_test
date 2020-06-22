import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as TiriTyukantest from '../lib/tiri_tyukantest-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new TiriTyukantest.TiriTyukantestStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
