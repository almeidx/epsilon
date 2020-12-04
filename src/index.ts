import 'dotenv/config';
import Client from './structures/client';

const client = new Client();

client
  .on('error', (err) => console.error('error', err))
  .on('shardError', (err) => console.error('shardError', err))
  .on('warn', (info) => console.warn('warn', info));

client.start().catch((err) => {
  console.error(err);
  process.exit(1);
});
