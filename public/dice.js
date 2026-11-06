// Every face is real: the same six faces tumble and settle on the chosen result.
const rotations = {
  1: [0, 0], 2: [-90, 0], 3: [0, -90],
  4: [0, 90], 5: [90, 0], 6: [0, 180],
};
const rotate = (x, y, z = 0) => `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;

export async function animateDice(stage, values, {reducedMotion = false} = {}) {
  if (reducedMotion || !stage) return;
  const dice = [...stage.querySelectorAll('.die')];
  if (!dice.length || dice.some(die => typeof die.animate !== 'function')) return;
  const height = parseFloat(getComputedStyle(stage).getPropertyValue('--throw-height')) || 56;
  const animations = [];
  try {
    dice.forEach((die, index) => {
      const cube = die.querySelector('.die-cube');
      const shadow = die.parentElement.querySelector('.die-ground');
      const impact = die.parentElement.querySelector('.die-impact');
      const direction = index === 0 ? -1 : 1;
      const duration = index === 0 ? 920 : 1040;
      const rest = getComputedStyle(die).transform;
      const pose = (x, y, tilt = 0, scaleX = 1, scaleY = 1, tiltX = 0, tiltY = 0) =>
        `translate3d(${x}px, ${y}px, 0) ${rest} rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${tilt}deg) scale3d(${scaleX}, ${scaleY}, 1)`;
      die.setAttribute('aria-label', 'Dobbelsteen rolt');
      animations.push(die.animate([
        {transform: pose(0, 0), offset: 0},
        {transform: pose(-direction * 3, 6, -direction * 4, 1.04, .95), offset: .12},
        {transform: pose(direction * 18, -height, direction * 16, 1.05, 1.05, 22, -direction * 18), offset: .38},
        {transform: pose(-direction * 5, 3, -direction * 5, 1.06, .93), offset: .67},
        {transform: pose(direction * 3, -14, direction * 3), offset: .80},
        {transform: pose(0, 1, 0, 1.02, .98), offset: .93},
        {transform: pose(0, 0), offset: 1},
      ], {duration, easing: 'cubic-bezier(.3, 0, .35, 1)', fill: 'forwards'}));

      const [startX, startY] = rotations[Number(die.dataset.value)];
      const [targetX, targetY] = rotations[values[index]];
      const endX = targetX + 720 * direction;
      const endY = targetY + (index === 0 ? 360 : -720);
      animations.push(cube.animate([
        {transform: rotate(startX, startY), offset: 0},
        {transform: rotate(startX + direction * 22, startY - 12), offset: .10},
        {transform: rotate(endX, endY), offset: 1},
      ], {duration: duration * .67, easing: 'cubic-bezier(.15, .52, .38, 1)', fill: 'forwards'}));

      animations.push(shadow.animate([
        {transform: 'scale(1)', opacity: .22, offset: 0},
        {transform: `translateX(${direction * 12}px) scale(.65)`, opacity: .08, offset: .38},
        {transform: 'scale(1.15)', opacity: .30, offset: .67},
        {transform: 'scale(.86)', opacity: .14, offset: .80},
        {transform: 'scale(1)', opacity: .22, offset: 1},
      ], {duration, easing: 'ease-in-out', fill: 'forwards'}));

      animations.push(impact.animate([
        {transform: 'scale(.55)', opacity: 0, offset: 0},
        {transform: 'scale(.55)', opacity: 0, offset: .63},
        {transform: 'scale(.8)', opacity: .5, offset: .68},
        {transform: 'scale(1.55)', opacity: 0, offset: .94},
        {transform: 'scale(1.55)', opacity: 0, offset: 1},
      ], {duration, easing: 'ease-out', fill: 'forwards'}));
    });
    await Promise.allSettled(animations.map(animation => animation.finished));
  } finally {
    // Release finished animations even when the view was closed while rolling.
    for (const animation of animations) animation.cancel();
  }
}
