const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs')
const rimraf = require('rimraf');
const angular = require('./angular.json');
const appDir = __dirname + '/dist/' + angular.defaultProject;
const webpackConfigChrome = path.resolve(__dirname, 'chrome');

rimraf(appDir, (err) => {
    if (err) {
        console.error(err);
        return process.exit();
    }
    ng = spawn('npm', ['run','build', '--watch'], { shell: true, stdio: 'inherit', env: process.env });
    process.stdout.write('Starting compilation NG in watch mode\r\n')
    ng.on('exit', (code) => {
        console.log(`Child Ng exited with code ${code}`);
    });
});

const intervalId = setInterval(() => {
    // process.title = ' Watch ' + angular.defaultProject;
    fs.access(appDir, fs.constants.F_OK, (err) => {
        if (!err) {
            clearInterval(intervalId);
            Wp = spawn('npx', ['webpack', '--config', `${webpackConfigChrome}/webpack.config.chrome.js`, '--watch', '--color', `${true}`], { shell: true, stdio: 'inherit' });

            Wp.on('exit', (code) => {
                console.log(`Child process chrome Watch exited with code ${code}`);
            });
            // console.log('\r\n');
            // tsc = spawn('tsc', ['-w','--pretty',`${true}`,'--listEmittedFiles',`${true}`, '-p', `${__dirname}/desktop`], { shell: true, stdio: 'inherit' });

        }
    });
}, 5000);

