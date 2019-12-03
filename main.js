const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');


const core = require('@actions/core');
const exec = require('@actions/exec');


async function main() {
  try { 
    if (process.platform === 'linux') {
      await installCondaLinux();
    }
    else if (process.platform === 'darwin') {
      await installCondaMacOSX();
    }
    else if (process.platform === 'win32') {
      await installCondaWindows();
    }
    else {
      throw new Error(`${process.platform}: platform not supported`);
    }
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}


async function download(url, dest, cb) {
  const file = fs.createWriteStream(dest);
  http.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close(cb);
    });
  }).on('error', (err) => {
    fs.unlink(dest);
    if (cb) {
      cb(err.message);
    }
  });
}


async function installCondaLinux() {
  download(
    'https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh',
    'miniconda3.sh',
    () => {
      exec.exec('/bin/bash', ['./miniconda3.sh']);
      core.addPath(path.join(os.homedir(), 'miniconda3', 'bin'))
    },
  );
}


main()
