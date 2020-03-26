#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { TestSnsStack } from '../lib/test_sns-stack';

const app = new cdk.App();
new TestSnsStack(app, 'TestSnsStack');
