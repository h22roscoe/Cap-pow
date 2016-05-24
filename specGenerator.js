var JasmineSpecRunnerGenerator = require('atropa-jasmine-spec-runner-generator-html');

specRunner = new JasmineSpecRunnerGenerator(
    './lib/jasmine-2.4.1/', 'SpecRunner.html', 'Game Test Suite');

specRunner.addSources('./lib/jasmine-2.4.1/', './lib/jasmine-2.4.1/');

//specRunner.addSources('./build/', './build/');
specRunner.addSources('./lib/', './lib/');
specRunner.addSources('./src/', './src/');

specRunner.addSpecs('./spec/tests/', './spec/tests/');

specRunner.generateFile(function () {
    console.log('ok');
});
