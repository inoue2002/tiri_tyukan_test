#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { TiriTyukantestStack } from '../lib/tiri_tyukantest-stack';

const app = new cdk.App();
new TiriTyukantestStack(app, 'TiriTyukantestStack');
