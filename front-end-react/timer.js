export default async function timer(req, res, next) {
  if (!req.context) req.context = {};

  const start = performance.now();
  await next();
  const end = performance.now();

  req.context.elapsed = (end - start).toFixed(1) + ' ms';
  console.log("Timer terminé :", req.context.elapsed);
}