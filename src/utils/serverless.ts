import { spawn } from 'child_process';
import { EOL } from 'os';

export const deploy = async (stage = 'dev') => {
  return await new Promise((resolve, reject) => {
    const serverless = spawn('serverless', ['deploy', '--stage', stage]);

    console.log(`${EOL}Deploying Service`);
    serverless.stdout.on('data', data => {
      console.log(data.toString().trim());
    });

    serverless.stderr.on('data', data => {
      console.error(data.toString().trim());
    });

    serverless.on('close', code => {
      if (code !== 0) {
        reject(code);
      } else {
        resolve(code);
      }
    });
  });
};
