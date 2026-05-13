import Fastify from 'fastify';
import cors from '@fastify/cors';

const server = Fastify({ logger: true });

server.register(cors, {
  origin: '*'
});

server.get('/api/health', async () => {
  return { status: 'ok', timestamp: Date.now() };
});

const start = async () => {
  try {
    const port = parseInt(process.env.API_PORT || '3000', 10);
    await server.listen({ port, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
