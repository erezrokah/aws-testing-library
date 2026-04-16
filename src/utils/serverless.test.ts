import { EOL } from 'os';
import { deploy } from './serverless';

jest.mock('child_process');
jest.spyOn(console, 'log');
jest.spyOn(console, 'error');

describe('serverless utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const { spawn } = require('child_process');
  const spawned = {
    on: jest.fn(),
    stderr: { on: jest.fn() },
    stdout: { on: jest.fn() },
  };
  spawn.mockReturnValue(spawned);

  describe('deploy', () => {
    test('resolves on exit code === 0', async () => {
      const stage = 'stage';
      const promise = deploy(stage);

      expect(spawn).toHaveBeenCalledTimes(1);
      expect(spawn).toHaveBeenCalledWith('serverless', [
        'deploy',
        '--stage',
        stage,
      ]);

      expect(spawned.stdout.on).toHaveBeenCalledTimes(1);
      expect(spawned.stdout.on).toHaveBeenCalledWith(
        'data',
        expect.any(Function),
      );
      const data = 'Serverless output';
      spawned.stdout.on.mock.calls[0][1](data);

      expect(spawned.on).toHaveBeenCalledTimes(1);
      expect(spawned.on).toHaveBeenCalledWith('close', expect.any(Function));
      const exitCode = 0;
      spawned.on.mock.calls[0][1](exitCode);

      await expect(promise).resolves.toEqual(exitCode);

      expect(console.log).toHaveBeenCalledTimes(2);
      expect(console.log).toHaveBeenCalledWith(`${EOL}Deploying Service`);
      expect(console.log).toHaveBeenCalledWith(data);

      expect.assertions(10);
    });

    test('rejects on exit code !== 1', async () => {
      const promise = deploy();

      expect(spawn).toHaveBeenCalledTimes(1);
      expect(spawn).toHaveBeenCalledWith('serverless', [
        'deploy',
        '--stage',
        'dev',
      ]);

      expect(spawned.stderr.on).toHaveBeenCalledTimes(1);
      expect(spawned.stderr.on).toHaveBeenCalledWith(
        'data',
        expect.any(Function),
      );
      const data = 'Serverless error';
      spawned.stderr.on.mock.calls[0][1](data);

      const exitCode = 1;
      spawned.on.mock.calls[0][1](exitCode);

      await expect(promise).rejects.toEqual(exitCode);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(data);

      expect.assertions(7);
    });
  });
});
