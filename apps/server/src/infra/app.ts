import { env } from '@repo/env';
import { app } from './server.ts';

app.listen({ port: env.SERVER_PORT, host: '0.0.0.0' }).then(() => {
  console.log(`Server running: http://localhost:${env.SERVER_PORT}`);
});
