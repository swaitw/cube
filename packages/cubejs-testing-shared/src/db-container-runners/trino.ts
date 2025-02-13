import { GenericContainer, Wait } from 'testcontainers';

import { DbRunnerAbstract, DBRunnerContainerOptions } from './db-runner.abstract';

export class TrinoDBRunner extends DbRunnerAbstract {
  public static startContainer(options: DBRunnerContainerOptions) {
    const version = process.env.TEST_TRINO_VERSION || options.version || '403';

    const container = new GenericContainer(`trinodb/trino:${version}`)
      .withExposedPorts(8080)
      .withWaitStrategy(Wait.forLogMessage('======== SERVER STARTED ========'))
      .withStartupTimeout(30 * 1000);

    if (options.volumes) {
      const binds = options.volumes.map(v => ({ source: v.source, target: v.target, mode: v.bindMode }));
      container.withBindMounts(binds);
    }

    return container.start();
  }
}
