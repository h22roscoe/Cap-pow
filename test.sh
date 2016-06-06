#!/usr/bin/env bash
set -ev
gulp testing
gulp tests
node_modules/karma/bin/karma start my.conf.js --single-run
