/**
 * The animated background is now a single global <ParticleField /> mounted in
 * App.js (one WebGL context for the whole page instead of one per section).
 * This component is kept as a no-op so existing section imports stay valid.
 */
function Particle() {
  return null;
}

export default Particle;
